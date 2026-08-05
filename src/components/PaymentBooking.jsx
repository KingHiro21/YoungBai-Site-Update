import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Copy, Check, MessageSquare, Phone, Wallet, CalendarClock, ReceiptText,
} from "lucide-react";
import {
  SITE_CONFIG, PAYMENT_ACCOUNTS, BOOKING_SLOTS, BOOKING_WHATSAPP, peso,
} from "../config.js";
import { Reveal, SectionHead } from "../shared.jsx";
import { quote } from "../lib.js";

/* Reference codes tie a payment to a booking. Random, unambiguous chars. */
function makeRef() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "YB-" + s;
}

/* Server error codes → something a customer can act on. */
const ERROR_TEXT = {
  target_below_current: "Your target MMR needs to be higher than your current MMR.",
  date_out_of_range: "Pick a date from today onward.",
  bad_slot: "Please choose a time slot from the list.",
  bad_mmr: "Please check the MMR values you entered.",
  missing_fields: "Please fill in your IGN, date, and time slot.",
  slow_down: "Too many attempts — wait a minute and try again.",
  not_configured: "Bookings aren't connected yet. Send your order directly instead:",
  delivery_failed: "Couldn't reach the booking system — send your order directly instead:",
  network: "Connection problem — send your order directly instead:",
};
const CHAT_FALLBACK = ["not_configured", "delivery_failed", "network"];

function CopyBtn({ text, label }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      window.prompt("Copy this:", text);
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

function StepHead({ n, kicker, title, sub }) {
  return (
    <>
      <div className="yb-stephead">
        <span className="yb-eyebrow">Step {n} — {kicker}</span><i />
      </div>
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
    </>
  );
}

export default function PaymentBooking({ standalone = false }) {
  const [params] = useSearchParams();
  const fromCfg = (k, fb) => params.get(k) || fb;

  /* step 1 — order */
  const [mode, setMode] = useState(fromCfg("service", "solo") === "party" ? "party" : "solo");
  const [current, setCurrent] = useState(fromCfg("current", ""));
  const [target, setTarget] = useState(fromCfg("target", ""));
  /* step 2 — pay */
  const [payWith, setPayWith] = useState(PAYMENT_ACCOUNTS[0]?.id || "");
  /* step 3 — book */
  const [ign, setIgn] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  /* flow */
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errCode, setErrCode] = useState("");
  const [hp, setHp] = useState(""); // honeypot — humans never see the field
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [refSeed, setRefSeed] = useState(0);
  const orderRef = useMemo(makeRef, [refSeed]);

  const serviceLabel = mode === "party" ? "Party Boost" : "Solo Boost";
  const account = PAYMENT_ACCOUNTS.find((p) => p.id === payWith) || PAYMENT_ACCOUNTS[0];

  const nCur = current === "" ? null : Number(current);
  const nTgt = target === "" ? null : Number(target);
  const mmrValid = nCur !== null && nTgt !== null &&
    Number.isFinite(nCur) && Number.isFinite(nTgt) && nTgt > nCur && nCur >= 0;
  const mmrInvalid = nCur !== null && nTgt !== null && !mmrValid;
  const est = mmrValid ? quote(nCur, nTgt, mode) : null;

  const ready = ign.trim() && date && slot && !mmrInvalid;

  const message = [
    "YOUNGBAI BOOST ORDER",
    "Ref: " + orderRef,
    "Service: " + serviceLabel,
    mmrValid && "Climb: " + nCur.toLocaleString() + " \u2192 " + nTgt.toLocaleString() + " MMR",
    est && "Estimated: " + peso(est.total),
    "Schedule: " + date + " \u00b7 " + slot,
    "IGN: " + ign.trim(),
    "Paying via: " + (account?.name || payWith),
    "(Receipt screenshot attached)",
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

  async function submitBooking() {
    if (!ready || status === "sending") return;
    setStatus("sending");
    setErrCode("");
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined,
        body: JSON.stringify({
          ref: orderRef, service: serviceLabel, ign: ign.trim(),
          current, target, amount: est ? String(est.total) : "",
          date, slot, payWith: account?.name || payWith, website: hp,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (d.ok) setStatus("done");
      else { setErrCode(d.error || "delivery_failed"); setStatus("error"); }
    } catch {
      setErrCode("network");
      setStatus("error");
    }
  }

  function bookAnother() {
    setRefSeed((n) => n + 1);
    setStatus("idle");
    setErrCode("");
    setSlot("");
    setDate("");
  }

  return (
    <section className="yb-sec" id="payment">
      <div className="yb-wrap yb-content">
        {!standalone && (
          <SectionHead
            eyebrow="Order, pay, book"
            title="Payment & booking"
            lead="Three steps: set your climb, send payment, lock your slot. Your slot is confirmed once Youngbai verifies the receipt — usually within the hour."
          />
        )}

        <div className="yb-cfg">
          {/* ═══ left: the three steps ═══ */}
          <div>
            {/* STEP 1 — ORDER */}
            <div className="yb-cfg-block">
              <StepHead n="01" kicker="Your order" title="Set your climb"
                        sub="Same rates as the pricing tables — the estimate updates live." />
              <div className="yb-slots" role="group" aria-label="Service">
                <button type="button" className={"yb-slot " + (mode === "solo" ? "is-on" : "")}
                        onClick={() => setMode("solo")} aria-pressed={mode === "solo"}>
                  Solo Boost
                </button>
                <button type="button" className={"yb-slot " + (mode === "party" ? "is-on" : "")}
                        onClick={() => setMode("party")} aria-pressed={mode === "party"}>
                  Party Boost
                </button>
              </div>
              <div className="yb-book-grid" style={{ marginTop: 16 }}>
                <div className="yb-bk-field">
                  <label htmlFor="pb-cur">Current MMR</label>
                  <input id="pb-cur" type="number" min="0" max="12000" step="100"
                         placeholder="e.g. 3200" value={current}
                         onChange={(e) => setCurrent(e.target.value)} />
                </div>
                <div className="yb-bk-field">
                  <label htmlFor="pb-tgt">Target MMR</label>
                  <input id="pb-tgt" type="number" min="0" max="12000" step="100"
                         placeholder="e.g. 4000" value={target}
                         onChange={(e) => setTarget(e.target.value)} />
                </div>
              </div>
              {mmrInvalid && (
                <p className="yb-inline-warn">
                  Target MMR must be higher than your current MMR.
                </p>
              )}
              <div className="yb-payamount">
                <div>
                  <span className="yb-order-lbl" style={{ margin: 0 }}>
                    {est ? "Amount to send" : "Amount"}
                  </span>
                  <b className="yb-num">{est ? peso(est.total) : "Enter your MMR"}</b>
                </div>
                {est && (
                  <span className="yb-payamount-meta">
                    +{est.gained.toLocaleString()} MMR · ~{est.wins} wins ·{" "}
                    {mode === "solo" ? "per 100 MMR" : "per win"}
                  </span>
                )}
              </div>
              <p className="yb-note" style={{ marginTop: 12 }}>
                Estimate — the final price is confirmed by Youngbai before games start.
                Skipping the MMR fields is fine; you can settle the amount in chat.
              </p>
            </div>

            {/* STEP 2 — PAY */}
            <div className="yb-cfg-block">
              <StepHead n="02" kicker="Send payment" title="Pick where to pay" />
              <div className="yb-slots" role="group" aria-label="Payment method">
                {PAYMENT_ACCOUNTS.map((p) => (
                  <button key={p.id} type="button"
                          className={"yb-slot " + (payWith === p.id ? "is-on" : "")}
                          onClick={() => setPayWith(p.id)} aria-pressed={payWith === p.id}>
                    <Wallet size={12} /> {p.name}
                  </button>
                ))}
              </div>
              {account && (
                <div className="yb-payacct yb-payacct-single" style={{ "--pay": account.color }}>
                  <div className="yb-payacct-row" style={{ borderTop: "none" }}>
                    <div>
                      <span>Account name</span>
                      <b>{account.accountName}</b>
                    </div>
                  </div>
                  <div className="yb-payacct-row">
                    <div>
                      <span>{account.name} number</span>
                      <b className="yb-num yb-paynum">{account.number}</b>
                    </div>
                    <CopyBtn text={account.number.replace(/\s/g, "")}
                             label={account.name + " number"} />
                  </div>
                  {account.qr && (
                    <img className="yb-payacct-qr" src={account.qr}
                         alt={account.name + " QR code"} loading="lazy" />
                  )}
                  <div className="yb-payref">
                    <ReceiptText size={14} />
                    <span>
                      Put <b className="yb-num">{orderRef}</b> in the transfer note if
                      your app allows it, and <b>screenshot the receipt</b>.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3 — BOOK */}
            <div className="yb-cfg-block">
              <StepHead n="03" kicker="Lock your slot" title="Book your schedule" />
              <div className="yb-book-grid">
                <div className="yb-bk-field">
                  <label htmlFor="pb-ign">Dota IGN / Friend ID</label>
                  <input id="pb-ign" type="text" placeholder="Your in-game name"
                         value={ign} onChange={(e) => setIgn(e.target.value)} />
                </div>
                <div className="yb-bk-field">
                  <label htmlFor="pb-date">Preferred date</label>
                  <input id="pb-date" type="date" value={date}
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
            </div>
          </div>

          {/* ═══ right: sticky live summary ═══ */}
          <div>
            <Reveal>
              <div className="yb-order-card">
                <div className="yb-order-head">
                  <div>
                    <span className="yb-eyebrow" style={{ color: "var(--ash-dim)" }}>
                      Order summary
                    </span>
                    <b style={{ display: "block" }}>
                      {status === "done" ? "Booking received" : "Your booking"}
                    </b>
                  </div>
                  <span className="yb-ref yb-num" title="Your order reference">{orderRef}</span>
                </div>

                <div className="yb-calc-rows">
                  <div><span>Service</span><span>{serviceLabel}</span></div>
                  <div><span>Climb</span>
                    <span>{mmrValid
                      ? nCur.toLocaleString() + " → " + nTgt.toLocaleString()
                      : "—"}</span></div>
                  <div><span>Pay via</span><span>{account?.name || "—"}</span></div>
                  <div><span>Schedule</span>
                    <span>{date && slot ? date + " · " + slot : "—"}</span></div>
                  <div><span>IGN</span><span>{ign.trim() || "—"}</span></div>
                  <div><span>Status</span>
                    <span style={{ color: status === "done" ? "#7fd6a0" : "var(--gold)" }}>
                      {status === "done" ? "Pending verification" : "Draft"}
                    </span></div>
                </div>

                <div className="yb-total">
                  <div>
                    <span className="yb-order-lbl" style={{ margin: 0 }}>
                      {est ? "Send exactly" : "Amount"}
                    </span>
                    <div className="yb-price-big yb-num">
                      {est ? peso(est.total) : "—"}
                    </div>
                  </div>
                  {est && (
                    <div className="yb-total-meta">
                      to {account?.name}<br />
                      <b>estimate</b>
                    </div>
                  )}
                </div>

                {/* honeypot — hidden from humans, bots fill it */}
                <input type="text" value={hp} onChange={(e) => setHp(e.target.value)}
                       name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                       style={{ position: "absolute", left: "-9999px", height: 0, opacity: 0 }} />

                {status !== "done" ? (
                  <>
                    <button type="button"
                            className={"yb-btn yb-btn-primary yb-btn-block" +
                              (ready && status !== "sending" ? "" : " is-disabled")}
                            disabled={!ready || status === "sending"}
                            onClick={submitBooking}>
                      <Check size={16} />
                      {status === "sending" ? "Sending your booking…" : "Confirm booking"}
                    </button>
                    {!ready && (
                      <p className="yb-calc-note">
                        {mmrInvalid
                          ? "Fix the MMR values in Step 1 to continue."
                          : "Complete Step 3 (IGN, date, time slot) to confirm."}
                      </p>
                    )}
                    {status === "error" && (
                      <div className="yb-book-fallback">
                        <p>{ERROR_TEXT[errCode] || ERROR_TEXT.delivery_failed}</p>
                        {CHAT_FALLBACK.includes(errCode) && (
                          <div className="yb-book-ctas">
                            <a className="yb-btn yb-btn-primary yb-btn-block" href={waHref}
                               target="_blank" rel="noreferrer noopener">
                              <Phone size={16} /> Send via WhatsApp
                            </a>
                            <button type="button" className="yb-btn yb-btn-ghost yb-btn-block"
                                    onClick={copyForDiscord}>
                              <MessageSquare size={16} />
                              {copiedMsg ? "Copied — paste it in Discord" : "Send via Discord"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="yb-calc-note">
                      Your slot is <b>pending</b> until Youngbai verifies the payment
                      receipt and replies to confirm.
                    </p>
                  </>
                ) : (
                  <div className="yb-book-done" role="status" style={{ marginTop: 0 }}>
                    <div className="yb-book-done-head">
                      <Check size={20} strokeWidth={2.5} />
                      <div>
                        <b>Order sent to Youngbai</b>
                        <span className="yb-num">Ref {orderRef}</span>
                      </div>
                    </div>
                    <p>
                      Last step — send your <b>payment receipt screenshot</b> with the
                      reference code so the slot can be confirmed:
                    </p>
                    <div className="yb-book-ctas">
                      <a className="yb-btn yb-btn-primary yb-btn-block" href={waHref}
                         target="_blank" rel="noreferrer noopener">
                        <Phone size={16} /> Send receipt via WhatsApp
                      </a>
                      <button type="button" className="yb-btn yb-btn-ghost yb-btn-block"
                              onClick={copyForDiscord}>
                        <MessageSquare size={16} />
                        {copiedMsg ? "Copied — paste it in Discord" : "Send receipt via Discord"}
                      </button>
                    </div>
                    <button type="button" className="yb-linkbtn" onClick={bookAnother}>
                      Book another boost
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
