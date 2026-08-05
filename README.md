# Youngbai — Dota 2 Boosting & Gaming Community

React + Vite site. Everything editable lives in **one file**: `src/config.js`.

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
Push this repo to GitHub, import it in Vercel — it auto-detects Vite.
(Build command `npm run build`, output directory `dist`. No config needed.)

## Edit your content — all in `src/config.js`
| What | Where |
|---|---|
| YouTube / Facebook / Discord links | `SITE_CONFIG.socialLinks` |
| Solo pricing (per 100 MMR) | `SOLO_PRICING` |
| Party pricing (per win) | `PARTY_PRICING` |
| Order add-ons + percentages | `BOOST_ADDONS` (set `[]` to hide) |
| Payment methods strip | `PAYMENT_METHODS` |
| Server / queue dropdowns | `ORDER_OPTIONS` |
| "Youngbai Shield" trust points | `SHIELD_POINTS` |
| Rank medals + MMR thresholds | `RANKS` (see below) |
| Service tabs (incl. "Soon" ones) | `SERVICE_TABS` |
| Stats, testimonials, FAQ, leaderboard | `COMMUNITY_STATS`, `TESTIMONIALS`, `FAQ_ITEMS`, `LEADERBOARD` |
| Payment accounts (GCash/Maya/GoTyme) | `PAYMENT_ACCOUNTS` (QR images → `public/payments/`) |
| Booking time slots + WhatsApp number | `BOOKING_SLOTS`, `BOOKING_WHATSAPP` |

The calculator reads `SOLO_PRICING` / `PARTY_PRICING` directly —
update a price once and the tables, cards, and estimates all follow.

## Rank medal images
Drop your 8 medal PNGs into `public/ranks/` and set the paths in
`RANKS` in `src/config.js`:

```js
{ name: "Herald", minMmr: 0, color: "#7d8a93", img: "/ranks/herald.png" },
```

While `img` is empty (or a file is missing) tiles show a colored gem
fallback — the site never shows a broken image.

## Pages
- `/` — the full landing page
- `/payment` — Payment & Booking (lazy-loaded; the configurator's
  "Rank up" button links here with the order pre-filled via URL params)

`vercel.json` contains the SPA rewrite so `/payment` works on refresh
and direct links. Don't delete it.

## Booking backend (`/api/book`)
The Payment page's **Confirm booking** button POSTs to a Vercel serverless
function that delivers the order to whichever of these you configure in
**Vercel → Project → Settings → Environment Variables**:

| Env var | What it does |
|---|---|
| `DISCORD_WEBHOOK_URL` | **Private staff channel.** Full order + receipt image. Right-click a PRIVATE channel → Edit Channel → Integrations → Webhooks → New Webhook → Copy URL |
| `DISCORD_PROOF_WEBHOOK_URL` | Optional. **Public proof-of-payments channel.** Posts ref, service, climb, amount and the receipt image. Never the IGN or contact details. |
| `PROOF_RECEIPT` | Optional. Set to `off` to keep receipt images out of the public channel (numbers only). The private channel always gets the image. |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Optional: also sends to Telegram |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Optional: also inserts into a `bookings` table — run `supabase/bookings.sql` in the Supabase SQL editor first |

Set at least one, then **redeploy**. Until one is set, the form shows the
error fallback (WhatsApp/Discord manual send) — nothing breaks.

Built-in protection: honeypot field, 5 bookings/min/IP soft rate limit,
strict ref-code validation, capped field lengths.

To confirm an order: check the ref against the receipt the customer sends,
then (if using Supabase) flip its `status` from `pending` to `confirmed`.

**Check your setup:** visit `/api/health` on your deployed site. It returns
which channels are configured (true/false only — never the values):
```json
{ "ok": true, "configured": { "discord": true, "telegram": false, "supabase": false } }
```
`"discord": false` means the env var didn't reach the build — check the key
spelling and redeploy.

Delivery failures are logged to **Vercel → your project → Logs** with the
order ref and reason, e.g. `[book] discord delivery failed for YB-K3F7M2: http_404`.

**Local testing:** `npx vercel dev` (the plain `npm run dev` doesn't run
`/api` functions — the form will show the fallback locally, that's normal).

## Structure
```
src/
  config.js        ← edit this one
  styles.css       ← full design system
  shared.jsx       ← Reveal, Embers, RankBadge, SocialLinks
  App.jsx
  components/      ← one file per section (Navbar … Footer)
```
