import React from "react";
import { SITE_CONFIG, NAV_LINKS, SOCIALS } from "../config.js";
import { SocialLinks } from "../shared.jsx";

export default function Footer() {
  return (
    <footer className="yb-foot">
      <div className="yb-wrap">
        <div className="yb-foot-grid">
          <div>
            <div className="yb-logo" style={{ fontSize: "1.7rem" }}>YOUNGBA<i>I</i></div>
            <p style={{ color: "var(--ash)", marginTop: 12, fontSize: ".95rem" }}>
              {SITE_CONFIG.descriptor}
            </p>
            <div style={{ marginTop: 22 }}><SocialLinks /></div>
          </div>
          <div>
            <h4>Navigate</h4>
            <div className="yb-foot-links">
              {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            </div>
          </div>
          <div>
            <h4>Follow</h4>
            <div className="yb-foot-links">
              {SOCIALS.map((s) =>
                s.href ? (
                  <a key={s.id} href={s.href} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                ) : (
                  <span key={s.id} style={{ color: "var(--ash)" }}>
                    {s.label}: {s.info}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        <div className="yb-foot-bot">
          <span>© {new Date().getFullYear()} Youngbai. All rights reserved.</span>
          <span className="yb-disclaimer">
            Dota 2 is a trademark of Valve Corporation. Youngbai is an independent
            community and is not affiliated with or endorsed by Valve Corporation.
          </span>
        </div>
      </div>
    </footer>
  );
}
