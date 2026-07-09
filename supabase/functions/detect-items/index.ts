// OPERATION MK — 특수 능력 테스트 (dev/minigame-item-scan) backend.
//
// The client can't hold a real Anthropic API key (this whole app is static
// client-side JS shipped to a browser), so real photo-item "detection" has
// to happen server-side. This Edge Function is that server: it takes a
// player-uploaded photo, asks Claude (a vision-capable model) to find
// distinct physical objects in it, and returns each one's label, a
// normalized bounding box, and a short 지수/영우 investigation exchange —
// everything dev/minigame-item-scan/index.html needs to render clickable
// regions and dialogue. The ANTHROPIC_API_KEY only ever lives in this
// function's Supabase project secrets, never in client JS.
//
// Deploy: see README.md in this folder (Supabase Dashboard copy-paste
// steps, no CLI required).

import Anthropic from "npm:@anthropic-ai/sdk@^0.68.0";

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

const ALLOWED_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
// Anthropic's base64 image limit is ~5MB per image; stay comfortably under it
// since base64 itself adds ~33% overhead on top of the raw file size.
const MAX_BASE64_LENGTH = 6_000_000;

const DETECT_ITEMS_TOOL = {
  name: "report_detected_items",
  description:
    "Report the distinct physical objects visible in the photo, for a detective visual-novel game's item-scan minigame.",
  input_schema: {
    type: "object" as const,
    properties: {
      items: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              description: "짧은 한국어 물품 이름 (예: 지갑, 열쇠, 커피컵). 2~6자 내외.",
            },
            box: {
              type: "object",
              description: "물품을 감싸는 사각형 영역. 이미지 가로/세로 대비 0~1 비율.",
              properties: {
                x: { type: "number", description: "왼쪽 상단 x (0~1)" },
                y: { type: "number", description: "왼쪽 상단 y (0~1)" },
                w: { type: "number", description: "너비 (0~1)" },
                h: { type: "number", description: "높이 (0~1)" },
              },
              required: ["x", "y", "w", "h"],
            },
            description: {
              type: "string",
              description: "이 물품에 대한 한 문장짜리 수사 관찰 (한국어).",
            },
            dialogue: {
              type: "array",
              description:
                "이 물품을 조사할 때 나오는 2~3줄 대사. 지수(호기심 많고 관찰력 좋은 신입 수사관)와 영우(차분한 파트너)가 번갈아 말한다.",
              minItems: 2,
              maxItems: 3,
              items: {
                type: "object",
                properties: {
                  speaker: { type: "string", enum: ["지수", "영우"] },
                  text: { type: "string" },
                },
                required: ["speaker", "text"],
              },
            },
          },
          required: ["label", "box", "description", "dialogue"],
        },
      },
    },
    required: ["items"],
  },
};

const SYSTEM_PROMPT = `당신은 한국어 형사/추리 비주얼노벨 게임 "OPERATION MK"의 물품 인식 기능을 담당합니다.
업로드된 사진을 분석해 뚜렷하게 구분되는 실제 물체를 최대 8개까지 찾아 report_detected_items 도구로 보고하세요.

규칙:
- 배경, 벽, 바닥처럼 개별 "물품"이 아닌 것은 제외하세요.
- 사진 속에 실존 인물로 보이는 사람이 있어도 그 사람이 누구인지 추정하거나 신원을 언급하지 마세요. 사람 자체를 물품으로 보고하지 말고, 사람이 들고 있거나 곁에 있는 물건만 보고하세요.
- 각 물품의 한국어 이름, 0~1 비율의 사각형 영역, 한 문장 관찰, 그리고 지수/영우가 번갈아 말하는 2~3줄의 짧은 수사 대사를 작성하세요.
- 대사는 자연스러운 한국어 구어체로, 게임의 톤(가볍고 티키타카가 있는 파트너 수사관 케미)에 맞게 쓰세요.
- 물품이 하나도 없다면 items를 빈 배열로 두지 말고, 가장 두드러지는 배경 요소 하나라도 보고하세요.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return jsonResponse({ error: "POST만 지원합니다." }, 405);

  let body: { imageBase64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "요청 본문이 올바른 JSON이 아닙니다." }, 400);
  }

  const { imageBase64, mediaType } = body;
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return jsonResponse({ error: "imageBase64가 필요합니다." }, 400);
  }
  if (!mediaType || !ALLOWED_MEDIA_TYPES.has(mediaType)) {
    return jsonResponse({ error: `지원하지 않는 이미지 형식입니다: ${mediaType}` }, 400);
  }
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    return jsonResponse({ error: "이미지 용량이 너무 큽니다. 더 작은 사진을 업로드해주세요." }, 413);
  }

  let message;
  try {
    message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [DETECT_ITEMS_TOOL],
      tool_choice: { type: "tool", name: "report_detected_items" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType as any, data: imageBase64 },
            },
            { type: "text", text: "이 사진 속 물품들을 감지해주세요." },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("Anthropic API call failed:", err);
    return jsonResponse({ error: "물품 인식 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }, 502);
  }

  const toolUseBlock = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUseBlock) {
    return jsonResponse({ error: "물품을 인식하지 못했습니다." }, 502);
  }

  const input = toolUseBlock.input as { items?: unknown };
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return jsonResponse({ error: "사진에서 물품을 찾지 못했습니다." }, 502);
  }

  return jsonResponse({ items: input.items });
});
