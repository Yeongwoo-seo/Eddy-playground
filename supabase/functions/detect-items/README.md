# detect-items Edge Function

Backs `/dev/minigame-item-scan/` (특수 능력 테스트). Takes a downscaled photo
from the player, calls the Anthropic Messages API with a vision request +
a forced tool call, and returns detected objects (label, bounding box,
investigation dialogue). This keeps the Anthropic API key out of the
client — it only ever lives in this function's Supabase project secrets.

## One-time setup (run by a human with access to this Supabase project)

```bash
# from the repo root
supabase login
supabase link --project-ref dhtstqnksjoyyshnhksv

# register the Anthropic API key as a project secret — never commit this key
# or paste it into chat/PRs
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# deploy the function
supabase functions deploy detect-items
```

The client calls it at:

```
https://dhtstqnksjoyyshnhksv.supabase.co/functions/v1/detect-items
```

using the existing public Supabase anon key (same one `dev/assetDb.js`
already uses) as the `apikey` / `Authorization: Bearer` headers — that's
normal for Supabase's anon role and does not need to change.

## Redeploying after edits

```bash
supabase functions deploy detect-items
```

## Local testing (optional)

```bash
supabase functions serve detect-items --env-file .env.local
# .env.local: ANTHROPIC_API_KEY=sk-ant-...
```

Then point `dev/minigame-item-scan/index.html`'s `DETECT_ITEMS_URL` at
`http://localhost:54321/functions/v1/detect-items` temporarily to test
against the local function.

## Cost

Each photo scan is one Anthropic API call to `claude-sonnet-5` (vision +
forced tool call). Sonnet 5 is priced at $3 / $15 per million input/output
tokens (a $2 / $10 introductory rate applies through 2026-08-31). A single
1200px-long-edge photo is roughly 600–1000 image tokens, and the tool-call
response for up to 8 items is a few hundred output tokens — so each scan
costs a small fraction of a cent, but it is metered, unlike everything
else in this repo (which is either static or backed by Supabase's free
tier). Consider adding a rate limit if this page is ever exposed outside
of dev testing.
