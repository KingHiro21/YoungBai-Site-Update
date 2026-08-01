import React from "react";
import { MessageSquare, Hash, Volume2 } from "lucide-react";
import { SITE_CONFIG, DISCORD_CHANNELS, COMMUNITY_FEATURES } from "../config.js";
import { Reveal } from "../shared.jsx";

const MOCK_MESSAGES = [
  { n: "Youngbai", c: "#c41230", t: "Today", m: "5.6K party stack forming in 10 — two slots open." },
  { n: "Shadow", c: "#d9a94c", t: "Today", m: "In. Need a pos 4?" },
  { n: "MidDiff", c: "#3a7bd5", t: "Today", m: "Tournament bracket is up in #tournaments 👀" },
  { n: "CarryMe", c: "#4caf7d", t: "Today", m: "Hit 4.2K from 3.6K this week. Worth it." },
];

export default function DiscordCommunity() {
  return (
    <section className="yb-sec" id="community">
      <div className="yb-glow" style={{ width: 520, height: 520, left: "-16%", top: "20%",
        background: "rgba(196,18,48,.15)" }} aria-hidden="true" />
      <div className="yb-wrap yb-content">
        <div className="yb-discord">
          <div>
            <Reveal>
              <div className="yb-rule" style={{ width: 64 }} />
              <div className="yb-eyebrow">The community</div>
              <h2 className="yb-display" style={{ fontSize: "clamp(2.1rem,5.4vw,3.8rem)",
                margin: "14px 0 16px" }}>
                More than a boosting service.
              </h2>
              <p className="yb-lead">
                Join the Youngbai Discord and become part of the community. It isn't just
                about MMR — it's a place for Dota players to meet teammates, compete,
                join events, win prizes, and have fun.
              </p>
            </Reveal>
            <Reveal delay={110}>
              <div className="yb-tags">
                {COMMUNITY_FEATURES.map((f) => (
                  <span className="yb-tag-pill" key={f}>{f}</span>
                ))}
              </div>
              <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
                 className="yb-btn yb-btn-primary yb-btn-lg">
                <MessageSquare size={19} /> Join the Youngbai Discord
              </a>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="yb-dsc" role="img"
                 aria-label="Illustration of the Youngbai Discord server showing community channels">
              <div className="yb-dsc-bar" aria-hidden="true">
                <i /><i /><i /><span>Youngbai — community</span>
              </div>
              <div className="yb-dsc-body">
                <div className="yb-dsc-side">
                  <div className="yb-dsc-srv">Youngbai</div>
                  {DISCORD_CHANNELS.map((c) => (
                    <div className={"yb-dsc-ch " + (c.active ? "is-on" : "")} key={c.name}>
                      <Hash size={13} /> {c.name}
                    </div>
                  ))}
                  <div className="yb-dsc-ch" style={{ marginTop: 10 }}>
                    <Volume2 size={13} /> party-voice
                  </div>
                </div>
                <div className="yb-dsc-main">
                  {MOCK_MESSAGES.map((m, i) => (
                    <div className="yb-msg" key={i}>
                      <span className="yb-av" style={{ background: m.c }}>
                        {m.n.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <span className="yb-msg-n">{m.n}</span>
                        <span className="yb-msg-t">{m.t}</span>
                        <p>{m.m}</p>
                      </div>
                    </div>
                  ))}
                  <div className="yb-dsc-input">Message #looking-for-party</div>
                </div>
              </div>
              <div className="yb-dsc-cap">Illustration only — channels and messages are examples</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
