import React, { useState, useEffect } from "react";
import { COMMUNITY_STATS } from "../config.js";
import { useReveal, SectionHead } from "../shared.jsx";

function CountUp({ to, suffix }) {
  const [ref, seen] = useReveal();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    const dur = 1500, t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <b ref={ref} className="yb-num">{n.toLocaleString()}{suffix}</b>;
}

export default function CommunityStats() {
  return (
    <section className="yb-sec is-tight" style={{ paddingBottom: 0 }}>
      <div className="yb-wrap yb-content" style={{ marginBottom: 72 }}>
        <SectionHead eyebrow="By the numbers" title="The community so far" />
      </div>
      <div className="yb-stats">
        {COMMUNITY_STATS.map((s) => (
          <div className="yb-stat" key={s.label}>
            <CountUp to={s.to} suffix={s.suffix} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
