import React from "react";
import { Reveal, SectionHead } from "../shared.jsx";

const COMPARISON = [
  {
    key: "solo", cls: "yb-cmp-solo", title: "SOLO BOOST",
    rows: [
      ["Best for", "Players who want direct MMR progression."],
      ["Pricing", "Per 100 MMR"],
      ["Playstyle", "The booster handles the climb."],
      ["Ideal when", "You want fast, straightforward MMR climbing."],
    ],
  },
  {
    key: "party", cls: "yb-cmp-party", title: "PARTY BOOST",
    rows: [
      ["Best for", "Players who want to play with the booster."],
      ["Pricing", "Per win"],
      ["Playstyle", "You queue and play together."],
      ["Ideal when", "You're with friends or want a more interactive climb."],
    ],
  },
];

export default function BoostComparison() {
  return (
    <section className="yb-sec is-tight">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="Side by side" title="Which boost is right for you?" />
        <Reveal>
          <div className="yb-cmp">
            {COMPARISON.map((c) => (
              <div className={"yb-cmp-col " + c.cls} key={c.key}>
                <h3>{c.title}</h3>
                {c.rows.map(([k, v]) => (
                  <div className="yb-cmp-row" key={k}>
                    <span>{k}</span>
                    <p>{v}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
