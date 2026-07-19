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
   script in **both** `schedule.html` and `hangeoreum.html`, then
   commit/push that change. (Both files point at the same Worker — no
   separate deploy needed per app.)

## After that

- No further manual steps — each app registers for push and syncs its own
  notification rules to this Worker automatically once `PUSH_API_URL` is
  set and a user grants notification permission.
- To rotate VAPID keys later, generate a new pair and repeat steps 4-6
  (existing subscriptions become invalid and devices need to reopen the
  app once to re-subscribe).
