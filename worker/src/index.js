import { sendPushNotification, deserializeVapidKeys } from 'web-push-browser';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Each installed home-screen app shares this one Worker + KV namespace but
// gets its own subscription list, rule list, and notification branding.
const DEFAULT_APP = 'tour';
const APPS = {
  tour: { title: '강낭콩 투어', icon: 'icons/icon-192.png', url: 'schedule.html', fallbackBody: '여행 알림' },
  hangeoreum: {
    title: '한걸음 🐾',
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23463B78'/%3E%3Ctext x='50' y='66' font-size='54' text-anchor='middle'%3E%F0%9F%90%BE%3C/text%3E%3C/svg%3E",
    url: 'hangeoreum.html',
    fallbackBody: '한 걸음만 가볼까',
  },
};
function appKey(name) {
  return Object.prototype.hasOwnProperty.call(APPS, name) ? name : DEFAULT_APP;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function getSubscriptions(env, app) {
  const raw = await env.PUSH_KV.get(`subscriptions:${app}`);
  return raw ? JSON.parse(raw) : [];
}
async function setSubscriptions(env, app, subs) {
  await env.PUSH_KV.put(`subscriptions:${app}`, JSON.stringify(subs));
}
async function getRules(env, app) {
  const raw = await env.PUSH_KV.get(`rules:${app}`);
  return raw ? JSON.parse(raw) : [];
}
async function setRules(env, app, rules) {
  await env.PUSH_KV.put(`rules:${app}`, JSON.stringify(rules));
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/subscribe' && request.method === 'POST') {
      const body = await request.json();
      // Back-compat: the trip app posts the raw PushSubscription with no
      // wrapper; hangeoreum.html sends { app, subscription }.
      const app = appKey(body?.app);
      const subscription = body?.subscription || body;
      if (!subscription || !subscription.endpoint) return json({ error: 'invalid subscription' }, 400);
      const subs = await getSubscriptions(env, app);
      const deduped = subs.filter((s) => s.endpoint !== subscription.endpoint);
      deduped.push(subscription);
      await setSubscriptions(env, app, deduped);
      return json({ ok: true });
    }

    if (url.pathname === '/rules' && request.method === 'POST') {
      const body = await request.json();
      if (!Array.isArray(body?.rules)) return json({ error: 'rules must be an array' }, 400);
      const app = appKey(body?.app);
      await setRules(env, app, body.rules);
      return json({ ok: true });
    }

    return json({ error: 'not found' }, 404);
  },

  // runs every minute (see [triggers] in wrangler.toml) — pushes any rule
  // whose time has passed and hasn't fired yet, to every stored subscription,
  // once per registered app
  async scheduled(event, env) {
    const vapidKeys = await deserializeVapidKeys({
      publicKey: env.VAPID_PUBLIC_KEY,
      privateKey: env.VAPID_PRIVATE_KEY,
    });
    const now = Date.now();

    for (const app of Object.keys(APPS)) {
      const [rules, subs] = await Promise.all([getRules(env, app), getSubscriptions(env, app)]);
      if (!rules.length || !subs.length) continue;

      const dueRules = rules.filter((r) => !r.fired && r.datetime && new Date(r.datetime).getTime() <= now);
      if (!dueRules.length) continue;

      const meta = APPS[app];
      const deadEndpoints = new Set();
      for (const rule of dueRules) {
        const payload = JSON.stringify({
          title: meta.title,
          body: rule.content || meta.fallbackBody,
          icon: meta.icon,
          url: meta.url,
        });
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

      await setRules(env, app, rules);
      if (deadEndpoints.size) {
        await setSubscriptions(env, app, subs.filter((s) => !deadEndpoints.has(s.endpoint)));
      }
    }
  },
};
