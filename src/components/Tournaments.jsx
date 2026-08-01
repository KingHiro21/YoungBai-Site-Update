import React from "react";
import { MessageSquare, Trophy } from "lucide-react";
import { SITE_CONFIG, TOURNAMENTS, LEADERBOARD } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function Tournaments() {
  const top = LEADERBOARD[0].pts;
  return (
    <section className="yb-sec" id="tournaments">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="Think you've got what it takes?" title="Play. Compete. Win."
          lead="Youngbai hosts community tournaments, events, and competitions where players can compete, meet new teammates, and win prizes." />
        <div className="yb-trn">
          {TOURNAMENTS.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.title} delay={i * 90}>
                <div className="yb-trn-card">
                  <Icon size={27} strokeWidth={1.6} />
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="yb-board">
            <div className="yb-board-h">
              <b className="yb-display">Season standings</b>
              <span className="yb-eyebrow" style={{ color: "var(--ash-dim)" }}>
                Example data
              </span>
            </div>
            {LEADERBOARD.map((p) => (
              <div className={"yb-lb-row " + (p.rank === 1 ? "is-top" : "")} key={p.name}>
                <span className="yb-lb-rank">{String(p.rank).padStart(2, "0")}</span>
                <div>
                  <div className="yb-lb-name">{p.name}</div>
                  <div className="yb-lb-bar">
                    <i style={{ width: Math.round((p.pts / top) * 100) + "%" }} />
                  </div>
                </div>
                <span className="yb-lb-pts">{p.pts.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="yb-hero-cta" style={{ marginTop: 34 }}>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-gold yb-btn-lg">
              <Trophy size={18} /> Join the next event
            </a>
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-ghost yb-btn-lg">
              <MessageSquare size={18} /> Join Discord
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
