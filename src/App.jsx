import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import Configurator from "./components/Configurator.jsx";
import SoloPricing from "./components/SoloPricing.jsx";
import PartyPricing from "./components/PartyPricing.jsx";
import BoostComparison from "./components/BoostComparison.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import WhyYoungbai from "./components/WhyYoungbai.jsx";
import DiscordCommunity from "./components/DiscordCommunity.jsx";
import Tournaments from "./components/Tournaments.jsx";
import CommunityStats from "./components/CommunityStats.jsx";
import Testimonials from "./components/Testimonials.jsx";
import FAQ from "./components/FAQ.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";

// Payment page is code-split: its JS only loads when someone opens /payment.
const PaymentPage = lazy(() => import("./pages/PaymentPage.jsx"));

/* On route change: scroll to top (or to the hash target if one is present). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function HomePage() {
  useEffect(() => {
    document.title = "Youngbai | Dota 2 Boosting & Gaming Community";
  }, []);
  return (
    <main id="main">
      <Hero />
      <Services />
      <Configurator />
      <SoloPricing />
      <PartyPricing />
      <BoostComparison />
      <HowItWorks />
      <WhyYoungbai />
      <DiscordCommunity />
      <Tournaments />
      <CommunityStats />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
}

export default function App() {
  return (
    <div className="yb">
      <a href="#main" className="yb-skip">Skip to content</a>
      <div className="yb-grain" aria-hidden="true" />
      <ScrollManager />
      <Navbar />
      <Suspense fallback={<div className="yb-pageload" role="status">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
