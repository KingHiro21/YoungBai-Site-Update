import React from "react";
import { WHY_CARDS } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function WhyYoungbai() {
  return (
    <section className="yb-sec">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="The difference" title="Why play with Youngbai?" />
        <div className="yb-why">
          {WHY_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={(i % 3) * 80}>
                <div className="yb-why-card">
                  <Icon size={26} strokeWidth={1.6} />
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
