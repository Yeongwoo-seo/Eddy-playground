// OPERATION MK DEV — AI 배경 생성 프록시.
//
// Deploy:  supabase functions deploy generate-background
// Secret:  supabase secrets set OPENAI_API_KEY=sk-...
//
// SUPABASE_ANON_KEY (dev/assetDb.js) is meant to be public client-side —
// that's what "anon" means. An OpenAI key billed per image is not, so the
// actual OpenAI call has to happen server-side. This function is that
// server side: dev/upload/index.html's 배경 DB tab sends a free-text 장소
// 설명 to AssetDB.generateBackgroundImage() (dev/assetDb.js), which POSTs
// it here; this function calls OpenAI with the real key and hands back
// just the generated image bytes (base64), never the key itself.

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// The game composites real, background-removed cast photos onto these
// backgrounds (see 배경 제거/누끼 in dev/upload/index.html) — a cartoon/anime
// backdrop would clash, so every generation is steered toward a
// photorealistic establishing shot with nobody in frame (characters are
// added separately, per-scene, in-game).
function buildPrompt(description: string): string {
  return `A photorealistic wide establishing-shot photograph of ${description}. `
    + 'Natural daylight, real-world detail and texture, no people, no text or '
    + 'watermarks, shot like a real travel/location photo — not illustration, '
    + 'not CGI, not anime style.';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return jsonResponse({ error: 'POST only' }, 405);
  if (!OPENAI_API_KEY) return jsonResponse({ error: '서버에 OPENAI_API_KEY가 설정되어 있지 않습니다.' }, 500);

  let body: { description?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: '요청 본문이 JSON이 아닙니다.' }, 400);
  }

  const description = (body.description || '').trim();
  if (!description) return jsonResponse({ error: '장소 설명이 비어 있습니다.' }, 400);

  const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: buildPrompt(description),
      size: '1536x1024', // landscape — closest gpt-image-1 size to a scene background's aspect
      quality: 'medium',
      n: 1,
    }),
  });

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    return jsonResponse({ error: `이미지 생성 실패 (${openaiRes.status}): ${errText}` }, 502);
  }

  const data = await openaiRes.json();
  const b64 = data && data.data && data.data[0] && data.data[0].b64_json;
  if (!b64) return jsonResponse({ error: 'OpenAI 응답에 이미지 데이터가 없습니다.' }, 502);

  return jsonResponse({ image: b64 });
});
