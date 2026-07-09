# detect-items Edge Function

Backs `/dev/minigame-item-scan/` (특수 능력 테스트). Takes a downscaled photo
from the player, calls the Anthropic Messages API with a vision request +
a forced tool call, and returns detected objects (label, bounding box,
investigation dialogue). This keeps the Anthropic API key out of the
client — it only ever lives in this function's Supabase project secrets.

## Deploy via the Supabase Dashboard (no CLI needed)

The `supabase link`/CLI flow can get stuck on things unrelated to this
function (database password prompts, org membership checks) — the
dashboard skips all of that. Two steps, both copy-paste:

**1. Create the function**

1. Open **[Edge Functions in this project's dashboard](https://supabase.com/dashboard/project/dhtstqnksjoyyshnhksv/functions)**.
2. Click **Deploy a new function** → **Via Editor**.
3. Name it exactly `detect-items`.
4. Delete whatever placeholder code is in the editor, then paste the
   entire contents of **`index.ts`** (the file next to this README) in
   its place.
5. Click **Deploy function**.

**2. Add the API key as a secret**

1. Open **[Edge Functions secrets for this project](https://supabase.com/dashboard/project/dhtstqnksjoyyshnhksv/settings/functions)**.
2. Click **Add new secret**.
3. Name: `ANTHROPIC_API_KEY` — Value: your Anthropic API key.
4. Save.

That's it — no login, no linking, no `--project-ref` flags. The function
is live the moment you deploy it in step 1; the secret from step 2 is
picked up automatically the next time it runs (redeploy the function once
after adding the secret if a call still fails with an auth error — the
dashboard sometimes needs a redeploy to pick up a brand-new secret).

**Redeploying after future edits to `index.ts`:** repeat step 1 (paste the
updated file into the same function's editor and click Deploy again) —
no need to touch the secret again unless the key itself changes.

## CLI alternative (if you prefer it)

```bash
supabase login
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref dhtstqnksjoyyshnhksv
supabase functions deploy detect-items --project-ref dhtstqnksjoyyshnhksv
```

Pass `--project-ref` directly rather than running `supabase link` first —
`link` also tries to link the project's local Postgres config and can
fail/hang asking for the database password, which isn't needed just to
manage secrets/functions.

## What the client calls

```
https://dhtstqnksjoyyshnhksv.supabase.co/functions/v1/detect-items
```

using the existing public Supabase anon key (same one `dev/assetDb.js`
already uses) as the `apikey` / `Authorization: Bearer` headers — that's
normal for Supabase's anon role and does not need to change.

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
