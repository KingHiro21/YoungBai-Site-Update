/* Shared pricing math — the configurator and the payment page both use this,
   so an estimate on one always matches the other. */
import { SITE_CONFIG, SOLO_PRICING, PARTY_PRICING } from "./config.js";

export function quote(from, to, mode) {
  const bands = mode === "solo" ? SOLO_PRICING : PARTY_PRICING;
  const ceiling = bands[bands.length - 1].max;
  const start = Math.max(0, Math.min(from, ceiling));
  const end = Math.max(start, Math.min(to, ceiling));
  let total = 0;
  for (const b of bands) {
    const lo = Math.max(start, b.min);
    const hi = Math.min(end, b.max);
    if (hi <= lo) continue;
    const span = hi - lo;
    total += mode === "solo"
      ? (span / 100) * b.per100
      : (span / SITE_CONFIG.mmrPerWin) * b.perWin;
  }
  const gained = end - start;
  return {
    total: Math.round(total),
    gained,
    wins: Math.ceil(gained / SITE_CONFIG.mmrPerWin),
    capped: to > ceiling,
    ceiling,
  };
}
