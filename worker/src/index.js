import { sendPushNotification, deserializeVapidKeys } from 'web-push-browser';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function getSubscriptions(env) {
  const raw = await env.PUSH_KV.get('subscriptions');
  return raw ? JSON.parse(raw) : [];
}
async function setSubscriptions(env, subs) {
  await env.PUSH_KV.put('subscriptions', JSON.stringify(subs));
}
async function getRules(env) {
  const raw = await env.PUSH_KV.get('rules');
  return raw ? JSON.parse(raw) : [];
}
async function setRules(env, rules) {
  await env.PUSH_KV.put('rules', JSON.stringify(rules));
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/subscribe' && request.method === 'POST') {
      const subscription = await request.json();
      if (!subscription || !subscription.endpoint) return json({ error: 'invalid subscription' }, 400);
      const subs = await getSubscriptions(env);
      const deduped = subs.filter((s) => s.endpoint !== subscription.endpoint);
      deduped.push(subscription);
      await setSubscriptions(env, deduped);
      return json({ ok: true });
    }

    if (url.pathname === '/rules' && request.method === 'POST') {
      const body = await request.json();
      if (!Array.isArray(body?.rules)) return json({ error: 'rules must be an array' }, 400);
      await setRules(env, body.rules);
      return json({ ok: true });
    }

    return json({ error: 'not found' }, 404);
  },

  // runs every minute (see [triggers] in wrangler.toml) — pushes any rule
  // whose time has passed and hasn't fired yet, to every stored subscription
  async scheduled(event, env) {
    const [rules, subs] = await Promise.all([getRules(env), getSubscriptions(env)]);
    if (!rules.length || !subs.length) return;

    const now = Date.now();
    const dueRules = rules.filter((r) => !r.fired && r.datetime && new Date(r.datetime).getTime() <= now);
    if (!dueRules.length) return;

    const vapidKeys = await deserializeVapidKeys({
      publicKey: env.VAPID_PUBLIC_KEY,
      privateKey: env.VAPID_PRIVATE_KEY,
    });

    const deadEndpoints = new Set();
    for (const rule of dueRules) {
      const payload = JSON.stringify({ title: '강낭콩 투어', body: rule.content || '여행 알림' });
      for (const sub of subs) {
        if (deadEndpoints.has(sub.endpoint)) continue;
        try {
          const res = await sendPushNotification(vapidKeys, sub, env.VAPID_SUBJECT, payload);
          if (res.status === 404 || res.status === 410) deadEndpoints.add(sub.endpoint);
        } catch (e) {
          // leave subscription in place; next tick will retry a still-unfired rule
        }
      }
      rule.fired = true;
    }

    await setRules(env, rules);
    if (deadEndpoints.size) {
      await setSubscriptions(env, subs.filter((s) => !deadEndpoints.has(s.endpoint)));
    }
  },
};
