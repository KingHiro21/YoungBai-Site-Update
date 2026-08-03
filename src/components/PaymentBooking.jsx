import React, { useState, useMemo } from "react";
import { Copy, Check, MessageSquare, Phone, CalendarClock, Wallet } from "lucide-react";
import {
  SITE_CONFIG, PAYMENT_ACCOUNTS, BOOKING_SLOTS, BOOKING_WHATSAPP,
} from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";

/* Reference codes tie a payment to a booking. Random, unambiguous chars. */
function makeRef() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "YB-" + s;
}

function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      window.prompt("Copy this:", text); // clipboard blocked — manual fallback
    }
  };
  return (
    <button type="button" className="yb-copy" onClick={copy}
            aria-label={"Copy " + (label || text)}>
      {done ? <Check size={13} /> : <Copy size={13} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function PaymentBooking() {
  const [service, setService] = useState("Solo Boost");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const [ign, setIgn] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [payWith, setPayWith] = useState(PAYMENT_ACCOUNTS[0]?.id || "");
  const [copiedMsg, setCopiedMsg] = useState(false);
  const orderRef = useMemo(makeRef, []);

  const ready = ign.trim() && date && slot;
  const payName = PAYMENT_ACCOUNTS.find((p) => p.id === payWith)?.name || payWith;

  const message = [
    "YOUNGBAI BOOST ORDER",
    "Ref: " + orderRef,
    "Service: " + service,
    (current || target) &&
      "Climb: " + (current || "?") + " \u2192 " + (target || "?") + " MMR",
    "Schedule: " + date + " \u00b7 " + slot,
    "IGN: " + ign.trim(),
    "Paying via: " + payName + " (receipt attached)",
  ].filter(Boolean).join("\n");

  const waHref =
    "https://wa.me/" + BOOKING_WHATSAPP + "?text=" + encodeURIComponent(message);

  const copyForDiscord = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2200);
    } catch {
      window.prompt("Copy your order message:", message);
    }
    window.open(SITE_CONFIG.socialLinks.discord, "_blank", "noopener");
  };

  return (
    <section className="yb-sec" id="payment">
      <div className="yb-wrap yb-content">
        <SectionHead
          eyebrow="Pay, then lock your slot"
          title="Payment & booking"
          lead="Send payment to any account below, then book your schedule with the reference code. Your slot is confirmed once Youngbai verifies the receipt — usually within the hour."
        />

        <div className="yb-payflow">
          {/* ── left: payment accounts ── */}
          <div>
            <div className="yb-order-lbl" style={{ marginTop: 0 }}>
              Step 1 — Send payment
            </div>
            <div className="yb-payaccts">
              {PAYMENT_ACCOUNTS.map((p) => (
                <Reveal key={p.id}>
                  <div className="yb-payacct" style={{ "--pay": p.color }}>
                    <div className="yb-payacct-head">
                      <span className="yb-payacct-ico"><Wallet size={16} /></span>
                      <b>{p.name}</b>
                    </div>
                    <div className="yb-payacct-row">
                      <div>
                        <span>Account name</span>
                        <b>{p.accountName}</b>
                      </div>
                    </div>
                    <div className="yb-payacct-row">
                      <div>
                        <span>Number</span>
                        <b className="yb-num">{p.number}</b>
                      </div>
                      <CopyBtn text={p.number.replace(/\s/g, "")} label={p.name + " number"} />
                    </div>
                    {p.qr && (
                      <img className="yb-payacct-qr" src={p.qr}
                           alt={p.name + " QR code"} loading="lazy" />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="yb-note">
              Include the reference code <b className="yb-num" style={{ color: "var(--gold)" }}>
              {orderRef}</b> in the transfer note if your app allows it, and
              screenshot the receipt — you'll attach it when you book.
            </p>
          </div>

          {/* ── right: booking ── */}
          <Reveal>
            <div className="yb-book">
              <div className="yb-order-head">
                <div>
                  <span className="yb-eyebrow" style={{ color: "var(--ash-dim)" }}>
                    Step 2 — Book your boost
                  </span>
                  <b style={{ display: "block" }}>Schedule</b>
                </div>
                <span className="yb-ref yb-num" title="Your order reference">{orderRef}</span>
              </div>

              <div className="yb-book-grid">
                <div className="yb-select">
                  <label htmlFor="bk-service">Service</label>
                  <select id="bk-service" value={service}
                          onChange={(e) => setService(e.target.value)}>
                    <option>Solo Boost</option>
                    <option>Party Boost</option>
                  </select>
                </div>
                <div className="yb-bk-field">
                  <label htmlFor="bk-ign">Dota IGN / Friend ID</label>
                  <input id="bk-ign" type="text" placeholder="Your in-game name"
                         value={ign} onChange={(e) => setIgn(e.target.value)} />
                </div>
                <div className="yb-bk-field">
                  <label htmlFor="bk-cur">Current MMR</label>
                  <input id="bk-cur" type="number" min="0" max="12000" step="100"
                         placeholder="e.g. 3200" value={current}
                         onChange={(e) => setCurrent(e.target.value)} />
                </div>
                <div className="yb-bk-field">
                  <label htmlFor="bk-tgt">Target MMR</label>
                  <input id="bk-tgt" type="number" min="0" max="12000" step="100"
                         placeholder="e.g. 4000" value={target}
                         onChange={(e) => setTarget(e.target.value)} />
                </div>
                <div className="yb-bk-field yb-bk-wide">
                  <label htmlFor="bk-date">Preferred date</label>
                  <input id="bk-date" type="date" value={date}
                         min={new Date().toISOString().split("T")[0]}
                         onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>

              <div className="yb-order-lbl">Time slot</div>
              <div className="yb-slots" role="group" aria-label="Time slot">
                {BOOKING_SLOTS.map((s) => (
                  <button key={s} type="button"
                          className={"yb-slot " + (slot === s ? "is-on" : "")}
                          onClick={() => setSlot(s)} aria-pressed={slot === s}>
                    <CalendarClock size={12} /> {s}
                  </button>
                ))}
              </div>

              <div className="yb-order-lbl">Paid via</div>
              <div className="yb-slots">
                {PAYMENT_ACCOUNTS.map((p) => (
                  <button key={p.id} type="button"
                          className={"yb-slot " + (payWith === p.id ? "is-on" : "")}
                          onClick={() => setPayWith(p.id)} aria-pressed={payWith === p.id}>
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="yb-book-ctas">
                <a className={"yb-btn yb-btn-primary yb-btn-block" + (ready ? "" : " is-disabled")}
                   href={ready ? waHref : undefined}
                   target="_blank" rel="noreferrer noopener"
                   aria-disabled={!ready}
                   onClick={(e) => { if (!ready) e.preventDefault(); }}>
                  <Phone size={16} /> Book via WhatsApp
                </a>
                <button type="button"
                        className={"yb-btn yb-btn-ghost yb-btn-block" + (ready ? "" : " is-disabled")}
                        disabled={!ready} onClick={copyForDiscord}>
                  <MessageSquare size={16} />
                  {copiedMsg ? "Message copied — paste it in Discord" : "Book via Discord"}
                </button>
              </div>
              {!ready && (
                <p className="yb-calc-note">
                  Fill in your IGN, date, and time slot to enable booking.
                </p>
              )}
              <p className="yb-calc-note">
                Your slot is <b>pending</b> until Youngbai verifies the payment receipt
                and replies to confirm — bookings aren't automatic. Attach your receipt
                screenshot in the chat.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
