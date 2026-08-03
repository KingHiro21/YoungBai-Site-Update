import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PaymentBooking from "../components/PaymentBooking.jsx";
import { Embers } from "../shared.jsx";

export default function PaymentPage() {
  useEffect(() => {
    document.title = "Payment & Booking | Youngbai";
  }, []);
  return (
    <main id="main">
      <header className="yb-pagehero">
        <Embers density={0.5} />
        <div className="yb-wrap yb-content">
          <Link to="/" className="yb-back">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <h1 className="yb-display">Payment &amp; Booking</h1>
          <p className="yb-lead">
            Send payment, then lock in your boosting schedule with your order reference.
          </p>
        </div>
      </header>
      <PaymentBooking standalone />
    </main>
  );
}
