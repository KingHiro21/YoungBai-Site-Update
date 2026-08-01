import React from "react";
import { HOW_IT_WORKS } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function HowItWorks() {
  return (
    <section className="yb-sec">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="Four steps" title="How it works"
          lead="From picking a boost to hitting your target — here's the whole process." />
        <Reveal>
          <div className="yb-steps">
            {HOW_IT_WORKS.map((s) => (
              <div className="yb-step" key={s.step}>
                <span className="yb-step-eyebrow">Step {s.step} — {s.kicker}</span>
                <b className="yb-num">{s.step}</b>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
