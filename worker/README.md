# gangnangkong-tour-push

Cloudflare Worker that delivers background push notifications for both
installed home-screen apps in this repo — the trip app's notification
settings popup (`schedule.html`) and 한걸음's reminders (`hangeoreum.html`).
Each app has its own subscriptions/rules in KV (keyed `subscriptions:<app>` /
`rules:<app>`) and its own notification title/icon, but they share one
Worker, one KV namespace, and one VAPID keypair. A cron trigger runs every
minute, checks each app's rules synced from the client, and sends a Web
Push message (VAPID + aes128gcm) to every subscribed device — so
notifications fire even when the app/PWA is fully closed.

The same Worker + KV namespace also backs a generic `/state` endpoint
(`GET /state?app=<name>`, `POST /state` with `{ app, data }`), keyed
`state:<app>` in KV. Any app name works here — it isn't limited to the
push-notification `APPS` registry. (`lgs-model.html` no longer uses this —
it auto-saves to Supabase instead, see below.)

## One-time setup

1. Install dependencies:
   ```bash
   cd worker
   npm install
   ```
2. Log into Cloudflare (opens a browser to authorize):
   ```bash
   npx wrangler login
   ```
3. Create the KV namespace used to store subscriptions + rules:
   ```bash
   npx wrangler kv namespace create PUSH_KV
   ```
   Copy the `id` it prints into `wrangler.toml` under `kv_namespaces`.
4. Set the VAPID private key as a secret (ask for the value — it's not
   committed to the repo):
   ```bash
   npx wrangler secret put VAPID_PRIVATE_KEY
   ```
5. Deploy:
   ```bash
   npx wrangler deploy
   ```
   This prints the Worker's URL, e.g.
   `https://gangnangkong-tour-push.<your-subdomain>.workers.dev`.
6. Paste that URL into `PUSH_API_URL` near the top of the notification
   script in **both** `schedule.html` and `hangeoreum.html`, then commit/push
   that change. (Both apps point at the same Worker — no separate deploy
   needed per app.)

## After that

- No further manual steps — each app registers for push and syncs its own
  notification rules to this Worker automatically once `PUSH_API_URL` is
  set and a user grants notification permission.
- To rotate VAPID keys later, generate a new pair and repeat steps 4-6
  (existing subscriptions become invalid and devices need to reopen the
  app once to re-subscribe).

## lgs-model.html cross-device sync (Supabase)

`lgs-model.html`'s inputs auto-save to Supabase so the same numbers show up
on any device, instead of using this Worker. It reuses the same Supabase
project (URL + anon key) already embedded in `planner.html` / `deposit.js` /
the game — no new project needed, just its own table, created once from the
Supabase dashboard's SQL Editor (works fine on mobile, no CLI needed):

```sql
create table lgs_model_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table lgs_model_data enable row level security;
create policy "public read" on lgs_model_data for select using (true);
create policy "public insert" on lgs_model_data for insert with check (true);
create policy "public update" on lgs_model_data for update using (true) with check (true);
```

Same shape as `planner.html`'s `schedule_data` table. These policies make
the row publicly readable/writable by anyone with the anon key — fine for
this single-row, low-sensitivity use case, but don't reuse this table/policy
for anything private.
