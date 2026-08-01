import React from "react";
import { Users, ArrowRight, Target } from "lucide-react";
import { Reveal, SectionHead } from "../shared.jsx";

const SERVICES = [
  {
    key: "solo",
    variant: "yb-svc-solo",
    icon: Target,
    title: "SOLO BOOSTING",
    blurb: "Want pure MMR progress? Let Youngbai handle the grind.",
    features: [
      "Professional solo boosting", "Experienced boosters", "Fast completion",
      "MMR-based pricing", "Progress updates", "Reliable service",
    ],
    cta: "View solo rates",
    href: "#solo",
    btn: "yb-btn-primary",
  },
  {
    key: "party",
    variant: "yb-svc-party",
    icon: Users,
    title: "PARTY BOOSTING",
    blurb: "Climb together. Queue together. Win together.",
    features: [
      "Party boosting", "Play alongside the booster", "Pay-per-win pricing",
      "Competitive games", "Discord coordination", "Great for friends and squads",
    ],
    cta: "View party rates",
    href: "#party",
    btn: "yb-btn-gold",
  },
];

export default function Services() {
  return (
    <section className="yb-sec" id="boosting">
      <div className="yb-wrap yb-content">
        <SectionHead
          eyebrow="Two ways up"
          title="Choose your climb"
          lead="Whether you're climbing solo or bringing your squad, Youngbai has you covered."
        />
        <div className="yb-services">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.key} delay={i * 110}>
                <div className={"yb-svc " + s.variant}>
                  <div className="yb-svc-ico"><Icon size={24} strokeWidth={1.6} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.blurb}</p>
                  <ul className="yb-feat">
                    {s.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <a href={s.href} className={"yb-btn " + s.btn}>
                    {s.cta} <ArrowRight size={16} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
