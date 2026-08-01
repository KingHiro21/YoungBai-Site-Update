import React from "react";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG, SOLO_PRICING, peso } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function SoloPricing() {
  return (
    <section className="yb-sec" id="solo">
      <div className="yb-glow" style={{ width: 460, height: 460, left: "-14%", top: "8%",
        background: "rgba(196,18,48,.16)" }} aria-hidden="true" />
      <div className="yb-wrap yb-content">
        <SectionHead
          eyebrow="Priced per 100 MMR"
          title="Solo boosting"
          lead="MMR climbing handled by experienced players."
        />
        <Reveal>
          <div className="yb-table-wrap">
            <table className="yb-table">
              <caption className="yb-eyebrow" style={{ textAlign: "left", padding: "16px 24px 0" }}>
                Solo rate card
              </caption>
              <thead>
                <tr>
                  <th scope="col">Current MMR</th>
                  <th scope="col">Price / 100 MMR</th>
                  <th scope="col">Approx. price / win</th>
                </tr>
              </thead>
              <tbody>
                {SOLO_PRICING.map((r) => (
                  <tr key={r.label} className={r.premium ? "yb-row-premium" : ""}>
                    <td>
                      <span className="yb-mmr">
                        <i className="yb-rung" />
                        {r.label}
                        {r.premium && <span className="yb-tag">High tier</span>}
                      </span>
                    </td>
                    <td className="yb-cell-price">{peso(r.per100)}</td>
                    <td className="yb-cell-est">~{peso(r.perWin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <p className="yb-note">
            Prices are calculated per 100 MMR. Approximate per-win prices are based on
            ~{SITE_CONFIG.mmrPerWin} MMR per win.
          </p>
          <div className="yb-hero-cta" style={{ marginTop: 30 }}>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-primary yb-btn-lg">
              Order solo boost <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
