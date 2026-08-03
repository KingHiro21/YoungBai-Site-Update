import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import Configurator from "./components/Configurator.jsx";
import SoloPricing from "./components/SoloPricing.jsx";
import PartyPricing from "./components/PartyPricing.jsx";
import BoostComparison from "./components/BoostComparison.jsx";
import PaymentBooking from "./components/PaymentBooking.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import WhyYoungbai from "./components/WhyYoungbai.jsx";
import DiscordCommunity from "./components/DiscordCommunity.jsx";
import Tournaments from "./components/Tournaments.jsx";
import CommunityStats from "./components/CommunityStats.jsx";
import Testimonials from "./components/Testimonials.jsx";
import FAQ from "./components/FAQ.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="yb">
      <div className="yb-grain" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Configurator />
        <SoloPricing />
        <PartyPricing />
        <PaymentBooking />
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
      <Footer />
    </div>
  );
}
