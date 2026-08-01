import React from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function Testimonials() {
  return (
    <section className="yb-sec">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="Placeholder reviews" title="What players say" />
        <div className="yb-tst">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 90}>
              <figure className="yb-tst-card">
                <div className="yb-tst-top">
                  <span className="yb-tst-av" aria-hidden="true">
                    {t.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div className="yb-tst-who">
                    <b>{t.author}</b>
                    <span className="yb-stars" aria-label={t.stars + " out of 5 stars"}>
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} size={12} fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                  </div>
                </div>
                <blockquote>{t.quote}</blockquote>
                <div className="yb-chips">
                  {t.chips.map((c) => <span key={c}>{c}</span>)}
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
