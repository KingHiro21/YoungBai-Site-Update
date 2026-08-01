import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="yb-sec" id="faq">
      <div className="yb-wrap yb-content">
        <SectionHead eyebrow="Answers" title="Frequently asked" />
        <Reveal>
          <div className="yb-faq">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={"yb-q " + (isOpen ? "is-open" : "")} key={item.q}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span>{item.q}</span>
                    <span className="yb-q-ico">
                      {isOpen ? <Minus size={19} /> : <Plus size={19} />}
                    </span>
                  </button>
                  <div className="yb-a" aria-hidden={!isOpen}>
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
