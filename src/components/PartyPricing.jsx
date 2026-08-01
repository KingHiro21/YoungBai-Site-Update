import React from "react";
import { ArrowRight, Flame } from "lucide-react";
import { SITE_CONFIG, PARTY_PRICING, peso } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function PartyPricing() {
  return (
    <section className="yb-sec" id="party">
      <div className="yb-glow" style={{ width: 420, height: 420, right: "-12%", top: "14%",
        background: "rgba(217,169,76,.12)" }} aria-hidden="true" />
      <div className="yb-wrap yb-content">
        <SectionHead
          eyebrow="You play too"
          title="Party boosting"
          lead="Play with the booster and climb through the ranks together."
        >
          <div style={{ marginTop: 26 }}>
            <span className="yb-perwin"><Flame size={17} /> Pay per win</span>
          </div>
        </SectionHead>
        <div className="yb-party-grid">
          {PARTY_PRICING.map((r, i) => (
            <Reveal key={r.label + i} delay={i * 70}>
              <div className={"yb-party-card " + (r.premium ? "is-premium" : "")}>
                <div className="yb-eyebrow">MMR bracket</div>
                <div className="yb-mmr" style={{ marginTop: 10 }}>
                  <i className="yb-rung" style={r.premium
                    ? { background: "var(--gold)" } : undefined} />
                  {r.label}
                </div>
                <b className="yb-num">{peso(r.perWin)}</b>
                <i>per win</i>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="yb-note">
            Party boosting is charged per win — you only pay for games that are won,
            at the rate for your bracket. No per-100-MMR charge.
          </p>
          <div className="yb-hero-cta" style={{ marginTop: 30 }}>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-gold yb-btn-lg">
              Order party boost <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
