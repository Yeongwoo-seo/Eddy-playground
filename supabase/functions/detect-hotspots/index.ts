// OPERATION MK DEV — AI 구성요소 탐지 프록시.
//
// Deploy:  supabase functions deploy detect-hotspots
// Secret:  supabase secrets set GEMINI_API_KEY=...
//
// Gemini API 키도 generate-background의 OPENAI_API_KEY와 같은 이유로(쿼터가
// 걸린 비공개 키) 클라이언트에 둘 수 없어, 실제 Gemini 호출은 여기 서버
// 쪽에서만 일어난다. dev/upload/index.html의 정답 영역(핫스팟) 편집기가
// 지금 보고 있는 배경 사진의 공개 Storage URL을 보내면, 이 함수가 그 사진을
// 대신 내려받아 Gemini에 물체 탐지를 요청하고 [label, box_2d] 목록만
// 돌려준다 — 어떤 게임 항목(hotspotId)에 배정할지는 여전히 개발자가 화면에서
// 직접 고른다 (자유 텍스트 라벨은 게임의 아이템 id와 대응이 안 되므로 자동
// 배정하지 않음 — dev/upload/index.html의 pickAiSuggestion 참고).

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = 'gemini-2.5-flash';

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

function errMessage(err: unknown): string {
  return err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : String(err);
}

// btoa(String.fromCharCode(...bytes)) blows the call stack on a full-size
// room photo (a few MB) — chunking keeps each spread call well under the
// argument-count limit.
async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`이미지를 불러오지 못했습니다 (${res.status})`);
  const mimeType = res.headers.get('content-type') || 'image/jpeg';
  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return { base64: btoa(binary), mimeType };
}

const PROMPT = '이 사진 속에서 플레이어가 클릭해서 조사할 만한, 서로 구분되는 물리적 물체/구성요소를 '
  + '찾아줘 (가구, 소품, 표지판, 장치 등 — 벽/바닥/하늘 같은 배경 자체는 제외). '
  + '각 물체마다 2~6글자의 짧은 한국어 라벨과 바운딩박스를 매겨서, '
  + '요청한 JSON 스키마 형식 그대로만 응답해.';

// Gemini의 object-detection 관례: box_2d = [ymin, xmin, ymax, xmax], 0~1000
// 정규화 좌표 — dev/upload/index.html의 detectHotspotsAi()가 이 순서 그대로
// 자연 픽셀 사각형으로 변환한다.
const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      label: { type: 'STRING' },
      box_2d: { type: 'ARRAY', items: { type: 'INTEGER' }, minItems: 4, maxItems: 4 },
    },
    required: ['label', 'box_2d'],
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return jsonResponse({ error: 'POST only' }, 405);
  if (!GEMINI_API_KEY) return jsonResponse({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' }, 500);

  let body: { imageUrl?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: '요청 본문이 JSON이 아닙니다.' }, 400);
  }

  const imageUrl = (body.imageUrl || '').trim();
  if (!imageUrl) return jsonResponse({ error: '이미지 URL이 비어 있습니다.' }, 400);

  let image: { base64: string; mimeType: string };
  try {
    image = await fetchImageAsBase64(imageUrl);
  } catch (err) {
    return jsonResponse({ error: `이미지 다운로드 실패: ${errMessage(err)}` }, 502);
  }

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: PROMPT },
            { inline_data: { mime_type: image.mimeType, data: image.base64 } },
          ],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    }
  );

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return jsonResponse({ error: `탐지 실패 (${geminiRes.status}): ${errText}` }, 502);
  }

  const data = await geminiRes.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return jsonResponse({ error: 'Gemini 응답에 결과가 없습니다.' }, 502);

  let detections: unknown;
  try {
    detections = JSON.parse(text);
  } catch {
    return jsonResponse({ error: 'Gemini 응답을 JSON으로 해석하지 못했습니다.' }, 502);
  }

  return jsonResponse({ detections });
});
