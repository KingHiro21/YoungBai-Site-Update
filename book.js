/* /api/book — receives bookings from the Payment page.
   Delivers to any of the following that are configured (Vercel env vars):
     DISCORD_WEBHOOK_URL            → posts an embed to your #orders channel
     TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → sends a Telegram message
     SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → inserts into `bookings` table
   At least one must be set or the endpoint returns not_configured. */

const RATE = new Map(); // per warm instance — light protection, not a fortress

/* Drop stale IPs so the map can't grow without bound between cold starts. */
function pruneRate(now) {
  if (RATE.size < 500) return;
  for (const [k, v] of RATE) {
    if (!v.some((t) => now - t < 60_000)) RATE.delete(k);
  }
}

const clean = (v, max) => String(v ?? "").slice(0, max).trim();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // ── soft rate limit: 5 bookings / minute / IP ──
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  pruneRate(now);
  const hits = (RATE.get(ip) || []).filter((t) => now - t < 60_000);
  if (hits.length >= 5) {
    return res.status(429).json({ ok: false, error: "slow_down" });
  }
  hits.push(now);
  RATE.set(ip, hits);

  // ── honeypot: bots fill every field; humans never see this one ──
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // pretend success

  // ── validate + cap lengths ──
  const ref = clean(b.ref, 12);
  const service = clean(b.service, 24);
  const ign = clean(b.ign, 60);
  const current = clean(b.current, 6);
  const target = clean(b.target, 6);
  const date = clean(b.date, 12);
  const slot = clean(b.slot, 12);
  const payWith = clean(b.payWith, 24);
  const amount = clean(b.amount, 8);
  if (!/^YB-[A-Z2-9]{6}$/.test(ref)) {
    return res.status(400).json({ ok: false, error: "bad_reference" });
  }
  if (!ign || !date || !slot) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }
  if (!/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(slot)) {
    return res.status(400).json({ ok: false, error: "bad_slot" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ ok: false, error: "bad_date" });
  }
  const when = new Date(date + "T00:00:00Z").getTime();
  const today = new Date(new Date().toISOString().split("T")[0] + "T00:00:00Z").getTime();
  if (!Number.isFinite(when) || when < today || when > today + 120 * 86_400_000) {
    return res.status(400).json({ ok: false, error: "date_out_of_range" });
  }
  const nCur = current ? Number(current) : null;
  const nTgt = target ? Number(target) : null;
  for (const n of [nCur, nTgt]) {
    if (n !== null && (!Number.isFinite(n) || n < 0 || n > 15000)) {
      return res.status(400).json({ ok: false, error: "bad_mmr" });
    }
  }
  if (nCur !== null && nTgt !== null && nTgt <= nCur) {
    return res.status(400).json({ ok: false, error: "target_below_current" });
  }
  const nAmt = amount ? Number(amount) : null;
  if (nAmt !== null && (!Number.isFinite(nAmt) || nAmt < 0 || nAmt > 1_000_000)) {
    return res.status(400).json({ ok: false, error: "bad_amount" });
  }

  const climb = current || target ? `${current || "?"} → ${target || "?"} MMR` : "—";
  const summary =
    `Ref: ${ref}\nService: ${service}\nClimb: ${climb}\n` +
    `Est. amount: ${nAmt !== null ? "₱" + nAmt.toLocaleString() : "—"}\n` +
    `Schedule: ${date} · ${slot}\nIGN: ${ign}\nPaying via: ${payWith}`;

  /* Never let a hanging webhook stall the request. */
  const withTimeout = (p, ms = 8000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return p(ctrl.signal).finally(() => clearTimeout(timer));
  };

  const tasks = [];
  const channels = [];

  if (process.env.DISCORD_WEBHOOK_URL) {
    channels.push("discord");
    tasks.push(
      withTimeout((signal) => fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🛒 New boost booking — " + ref,
            color: 0xc41230,
            fields: [
              { name: "Service", value: service || "—", inline: true },
              { name: "Climb", value: climb, inline: true },
              { name: "Schedule", value: `${date} · ${slot}`, inline: true },
              { name: "IGN", value: ign, inline: true },
              { name: "Paying via", value: payWith || "—", inline: true },
              { name: "Est. amount", value: nAmt !== null ? "₱" + nAmt.toLocaleString() : "—", inline: true },
              { name: "Status", value: "⏳ Pending receipt", inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      }))
    );
  }

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    channels.push("telegram");
    tasks.push(
      withTimeout((signal) => fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: "🛒 New boost booking\n" + summary,
        }),
      }))
    );
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    channels.push("supabase");
    tasks.push(
      withTimeout((signal) => fetch(process.env.SUPABASE_URL + "/rest/v1/bookings", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          ref, service, ign,
          current_mmr: nCur,
          target_mmr: nTgt,
          date, slot, pay_with: payWith,
          amount: nAmt,
          status: "pending",
        }),
      }))
    );
  }

  if (tasks.length === 0) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  const results = await Promise.allSettled(tasks);
  const ok = [];
  const failed = [];
  results.forEach((r, i) => {
    const name = channels[i];
    if (r.status === "fulfilled" && r.value.ok) ok.push(name);
    else {
      failed.push(name);
      const why = r.status === "rejected"
        ? r.reason?.message || "network_error"
        : "http_" + r.value.status;
      console.error(`[book] ${name} delivery failed for ${ref}: ${why}`);
    }
  });

  if (ok.length === 0) {
    return res.status(502).json({ ok: false, error: "delivery_failed" });
  }
  return res.status(200).json({ ok: true, ref, delivered: ok, failed });
}
