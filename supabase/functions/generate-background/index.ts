// OPERATION MK DEV — AI 배경 생성 프록시 (Gemini).
//
// Deploy:  supabase functions deploy generate-background
// Secret:  supabase secrets set GEMINI_API_KEY=...
//
// detect-hotspots와 같은 GEMINI_API_KEY를 그대로 재사용한다 — 쿼터가 걸린
// 비공개 키라 SUPABASE_ANON_KEY(dev/assetDb.js)처럼 클라이언트에 둘 수 없어,
// 실제 호출은 여기 서버 쪽에서만 일어난다. dev/upload/index.html의 배경 DB
// 탭이 보낸 장소 설명으로 Gemini의 네이티브 이미지 생성 모델
// (gemini-2.5-flash-image, 일명 "나노바나나")을 호출해 이미지 바이트만
// (base64) 돌려준다 — 응답 모양({ image: base64 })은 이전 OpenAI 버전과
// 동일해서 dev/assetDb.js의 generateBackgroundImage()는 고칠 필요가 없다.

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

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
  if (!GEMINI_API_KEY) return jsonResponse({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' }, 500);

  let body: { description?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: '요청 본문이 JSON이 아닙니다.' }, 400);
  }

  const description = (body.description || '').trim();
  if (!description) return jsonResponse({ error: '장소 설명이 비어 있습니다.' }, 400);

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(description) }] }],
      }),
    }
  );

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return jsonResponse({ error: `이미지 생성 실패 (${geminiRes.status}): ${errText}` }, 502);
  }

  const data = await geminiRes.json();
  const parts: Array<Record<string, any>> = data?.candidates?.[0]?.content?.parts || [];
  // Google's REST JSON canonically uses camelCase (inlineData/mimeType), but
  // the API tolerates snake_case on the way in — accept both on the way out
  // too rather than assuming one.
  const imagePart = parts.find(p => p.inlineData || p.inline_data);
  const inline = imagePart && (imagePart.inlineData || imagePart.inline_data);
  const b64 = inline && inline.data;
  if (!b64) return jsonResponse({ error: 'Gemini 응답에 이미지 데이터가 없습니다.' }, 502);

  return jsonResponse({ image: b64 });
});
