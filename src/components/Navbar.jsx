import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageSquare } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "../config.js";
import { SocialLinks } from "../shared.jsx";

/* Hash links must become "/#section" when we're not on the home page. */
function NavA({ href, children, className, onClick }) {
  const { pathname } = useLocation();
  if (href.startsWith("#")) {
    const target = pathname === "/" ? href : "/" + href;
    return <a href={target} className={className} onClick={onClick}>{children}</a>;
  }
  return <Link to={href} className={className} onClick={onClick}>{children}</Link>;
}

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const logo = (
    <NavA href="#home" className="yb-logo" onClick={() => setOpen(false)}>
      YOUNGBA<i>I</i>
    </NavA>
  );

  return (
    <>
      <header className={"yb-nav " + (stuck ? "is-stuck" : "")}>
        <div className="yb-wrap yb-nav-in">
          {logo}
          <nav className="yb-navlinks" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <NavA key={l.href} href={l.href}>{l.label}</NavA>
            ))}
          </nav>
          <div className="yb-nav-cta">
            <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
               className="yb-btn yb-btn-ghost yb-btn-sm">
              <MessageSquare size={15} /> Discord
            </a>
            <NavA href="#solo" className="yb-btn yb-btn-primary yb-btn-sm">Order boost</NavA>
          </div>
          <button className="yb-burger" onClick={() => setOpen(true)}
                  aria-label="Open menu" aria-expanded={open}>
            <Menu size={26} />
          </button>
        </div>
      </header>

      <div className={"yb-drawer " + (open ? "is-open" : "")}>
        <div className="yb-drawer-top">
          {logo}
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={26} />
          </button>
        </div>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} style={{ animationDelay: 40 + i * 45 + "ms", display: "contents" }}>
              <NavA href={l.href} onClick={() => setOpen(false)}>{l.label}</NavA>
            </span>
          ))}
        </nav>
        <div className="yb-drawer-foot">
          <a href={SITE_CONFIG.socialLinks.discord} target="_blank" rel="noreferrer noopener"
             className="yb-btn yb-btn-ghost yb-btn-block">
            <MessageSquare size={17} /> Join Discord
          </a>
          <NavA href="#solo" onClick={() => setOpen(false)}
                className="yb-btn yb-btn-primary yb-btn-block">
            Order boost
          </NavA>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <SocialLinks />
          </div>
        </div>
      </div>
    </>
  );
}
