import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG, HERO_STATS } from "../config.js";
import { Reveal, Embers } from "../shared.jsx";

export default function Hero() {
  return (
    <section className="yb-hero" id="home">
      <div className="yb-hero-bg" aria-hidden="true" />
      <Embers />
      <div className="yb-hero-ridge" aria-hidden="true" />
      <div className="yb-wrap yb-content">
        <Reveal>
          <span className="yb-badge"><i className="yb-dot" /> Currently boosting</span>
        </Reveal>
        <Reveal delay={90}>
          <h1>
            Climb the ranks.
            <em>Play with the best.</em>
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="yb-hero-sub">
            Professional Dota 2 boosting, competitive party games, and a community
            built for players who want to go further.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="yb-hero-cta">
            <a href="#solo" className="yb-btn yb-btn-primary yb-btn-lg">
              Boost my MMR <ArrowRight size={18} />
            </a>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-ghost yb-btn-lg">
              <MessageSquare size={18} /> Join Discord
            </a>
          </div>
        </Reveal>
        <Reveal delay={340}>
          <div className="yb-hero-stats">
            {HERO_STATS.map((s) => (
              <div className="yb-hero-stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="yb-scroll" aria-hidden="true">
        <i /> Scroll
      </div>
    </section>
  );
}
