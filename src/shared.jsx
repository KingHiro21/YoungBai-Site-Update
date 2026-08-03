import React, { useState, useEffect, useRef } from "react";
import {
  Facebook, Instagram, Music2, Phone, MessageCircle, MessageSquare,
  Target, Users, Crosshair, Lock, GraduationCap,
} from "lucide-react";
import { SITE_CONFIG, SOCIALS } from "./config.js";

export function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

export function Reveal({ children, delay = 0, className = "" }) {
  const [ref, seen] = useReveal();
  return (
    <div
      ref={ref}
      className={"yb-rev " + (seen ? "is-in " : "") + className}
      style={{ transitionDelay: seen ? delay + "ms" : "0ms" }}
    >
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, lead, children }) {
  return (
    <Reveal className="yb-head">
      <div className="yb-rule" style={{ width: 64 }} />
      {eyebrow && <div className="yb-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {lead && <p className="yb-lead">{lead}</p>}
      {children}
    </Reveal>
  );
}

export function Embers({ density = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf = 0, w = 0, h = 0, t = 0, running = false, visible = true, onscreen = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let parts = [];

    const seed = () => {
      const count = Math.round((w < 700 ? 22 : 44) * density);
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.5,
        vy: Math.random() * 0.32 + 0.1,
        sway: Math.random() * 22 + 8,        // horizontal drift amplitude
        phase: Math.random() * Math.PI * 2,   // drift offset
        speed: Math.random() * 0.012 + 0.004, // drift speed
        a: Math.random() * 0.45 + 0.2,
        flick: Math.random() * 0.02 + 0.006,  // alpha flicker speed
        gold: Math.random() > 0.7,
      }));
    };
    const size = () => {
      const r = cvs.getBoundingClientRect();
      w = r.width; h = r.height;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const tick = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        const x = p.x + Math.sin(t * p.speed + p.phase) * p.sway;
        if (p.y < -14) { p.y = h + 14; p.x = Math.random() * w; }
        const glow = p.a * (0.72 + 0.28 * Math.sin(t * p.flick * 60 + p.phase));
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? "rgba(217,169,76," + glow.toFixed(3) + ")"
          : "rgba(255,92,64," + glow.toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const should = visible && onscreen;
      if (should && !running) { running = true; raf = requestAnimationFrame(tick); }
      if (!should && running) { running = false; cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; sync(); });
    const onVis = () => { visible = !document.hidden; sync(); };

    size();
    io.observe(cvs);
    document.addEventListener("visibilitychange", onVis);
    // ResizeObserver catches the section growing/shrinking (font load,
    // mobile URL bar, orientation) — not just window resizes.
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      let first = true;
      ro = new ResizeObserver(() => {
        if (first) { first = false; return; } // initial fire; size() already ran
        size();
      });
      ro.observe(cvs);
    } else {
      window.addEventListener("resize", size);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", size);
    };
  }, [density]);
  return <canvas ref={ref} className="yb-embers" aria-hidden="true" />;
}

export const TAB_ICONS = {
  target: Target, users: Users, crosshair: Crosshair,
  lock: Lock, graduation: GraduationCap,
};

export function RankBadge({ rank, size = 30 }) {
  const [broken, setBroken] = useState(false);
  if (rank.img && !broken) {
    return (
      <img src={rank.img} alt={rank.name + " medal"} className="yb-medal"
           width={size} height={size} loading="lazy" decoding="async"
           onError={() => setBroken(true)} />
    );
  }
  return <span className="yb-gem" style={{ "--tier": rank.color }} aria-hidden="true" />;
}

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,       // lucide has no brand glyph; musical note reads as TikTok
  whatsapp: Phone,
  wechat: MessageCircle,
  discord: MessageSquare,
};

export function SocialLinks({ size = 18 }) {
  return (
    <div className="yb-socials">
      {SOCIALS.map((s) => {
        const Icon = SOCIAL_ICONS[s.icon] || MessageSquare;
        const title = s.info ? s.label + ": " + s.info : "Youngbai on " + s.label;
        return s.href ? (
          <a key={s.id} href={s.href} className="yb-soc" aria-label={title}
             title={title} target="_blank" rel="noreferrer noopener">
            <Icon size={size} strokeWidth={1.7} />
          </a>
        ) : (
          <span key={s.id} className="yb-soc is-static" aria-label={title} title={title}>
            <Icon size={size} strokeWidth={1.7} />
          </span>
        );
      })}
    </div>
  );
}
