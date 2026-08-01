import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG, PAYMENT_METHODS } from "../config.js";
import { Reveal, Embers } from "../shared.jsx";

export default function FinalCTA() {
  return (
    <section className="yb-final" id="contact">
      <Embers density={0.6} />
      <div className="yb-wrap yb-content">
        <Reveal>
          <div className="yb-eyebrow" style={{ marginBottom: 18 }}>{SITE_CONFIG.tagline}</div>
          <h2>Ready to climb?</h2>
          <p>Your next rank is waiting.</p>
          <div className="yb-hero-cta">
            <a href="#solo" className="yb-btn yb-btn-primary yb-btn-lg">
              Start boosting <ArrowRight size={18} />
            </a>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-ghost yb-btn-lg">
              <MessageSquare size={18} /> Join Discord
            </a>
          </div>
          {PAYMENT_METHODS.length > 0 && (
            <div className="yb-pay" style={{ justifyContent: "center" }}>
              {PAYMENT_METHODS.map((m) => <span key={m}>{m}</span>)}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
