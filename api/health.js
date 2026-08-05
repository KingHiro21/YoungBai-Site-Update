/* /api/health — quick check that the booking backend is wired up.
   Reports only whether each variable EXISTS. Never returns any value. */
export default function handler(req, res) {
  const configured = {
    discord: Boolean(process.env.DISCORD_WEBHOOK_URL),
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
  const ready = Object.values(configured).some(Boolean);
  res.setHeader("Cache-Control", "no-store");
  return res.status(ready ? 200 : 503).json({
    ok: ready,
    configured,
    hint: ready
      ? "Booking delivery is configured."
      : "No delivery channel set. Add DISCORD_WEBHOOK_URL in Vercel → Settings → Environment Variables, then redeploy.",
  });
}
