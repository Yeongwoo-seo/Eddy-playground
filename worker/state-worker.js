// Standalone Worker for lgs-model.html's auto-save/share feature.
// No npm dependencies — paste this directly into the Cloudflare dashboard's
// Worker code editor from a phone (no wrangler/terminal needed). Requires a
// KV namespace bound as PUSH_KV in the Worker's Settings > Bindings.
// Uses the same `state:<app>` KV key shape as worker/src/index.js, so it
// stays compatible if this is later replaced by the full wrangler-deployed
// Worker.

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

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/state' && request.method === 'GET') {
      const app = url.searchParams.get('app');
      if (!app) return json({ error: 'app is required' }, 400);
      const raw = await env.PUSH_KV.get(`state:${app}`);
      return json({ data: raw ? JSON.parse(raw) : {} });
    }

    if (url.pathname === '/state' && request.method === 'POST') {
      const body = await request.json();
      if (!body?.app) return json({ error: 'app is required' }, 400);
      if (!body.data || typeof body.data !== 'object') return json({ error: 'data must be an object' }, 400);
      await env.PUSH_KV.put(`state:${body.app}`, JSON.stringify(body.data));
      return json({ ok: true });
    }

    return json({ error: 'not found' }, 404);
  },
};
