import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Zap, ShieldCheck, Target, TrendingUp, ChevronDown, Lock } from "lucide-react";
import { SITE_CONFIG, SOLO_PRICING, PARTY_PRICING, BOOST_ADDONS, ORDER_OPTIONS, SHIELD_POINTS, RANKS, SERVICE_TABS, rankForMmr, peso } from "../config.js";
import { Reveal, SectionHead, TAB_ICONS, RankBadge } from "../shared.jsx";
import { quote } from "../lib.js";

export default function ClimbCalculator() {
  const [mode, setMode] = useState("solo");
  const [from, setFrom] = useState(3000);
  const [to, setTo] = useState(4500);
  const [addons, setAddons] = useState([]);
  const [server, setServer] = useState(ORDER_OPTIONS.servers[0]);
  const [queue, setQueue] = useState(ORDER_OPTIONS.queues[0]);
  const [shieldOpen, setShieldOpen] = useState(false);
  const toggleAddon = (id) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const bands = mode === "solo" ? SOLO_PRICING : PARTY_PRICING;
  const cap = bands[bands.length - 1].max;
  const setFromSafe = useCallback((v) => {
    setFrom(v);
    setTo((t) => (t <= v + 100 ? Math.min(v + 100, cap) : t));
  }, [cap]);

  useEffect(() => {
    setFrom((f) => Math.min(f, cap - 100));
    setTo((t) => Math.min(t, cap));
  }, [cap]);

  const base = useMemo(() => quote(from, to, mode), [from, to, mode]);
  const addonPct = BOOST_ADDONS
    .filter((a) => addons.includes(a.id))
    .reduce((s, a) => s + a.pct, 0);
  const q = { ...base, total: Math.round(base.total * (1 + addonPct / 100)) };
  const perWinAvg = q.wins ? Math.round(q.total / q.wins) : 0;

  const bandIdx = Math.max(0, bands.findIndex((b) => from >= b.min && from < b.max));
  // Each tile gets a distinct medal, spread across the ladder low → high.
  const bandRank = (i) =>
    RANKS[Math.round((i / Math.max(bands.length - 1, 1)) * (RANKS.length - 1))];
  const fill = (v, min, max) =>
    ({ "--fill": Math.round(((v - min) / (max - min)) * 100) + "%" });

  return (
    <section className="yb-sec">
      <div className="yb-wrap yb-content">
        <SectionHead
          eyebrow="Build your order"
          title="Configure your boost"
          lead="Pick your bracket, set the goal, and watch the estimate update live — same rates as the tables below, nothing hidden."
        />
        <Reveal>
          <div className="yb-tabs" role="tablist" aria-label="Service">
            {SERVICE_TABS.map((t) => {
              const Icon = TAB_ICONS[t.icon] || Target;
              const live = !t.soon;
              const on = live && mode === t.id;
              return (
                <button key={t.id} type="button" role="tab" aria-selected={on}
                        className={"yb-tab " + (on ? "is-on" : "")}
                        disabled={!live}
                        title={live ? t.label : t.label + " — coming soon"}
                        onClick={() => live && setMode(t.id)}>
                  <b>{t.label}</b>
                  <span className="yb-tab-ico">
                    {live ? <Icon size={16} strokeWidth={1.7} />
                          : <Lock size={14} strokeWidth={1.7} />}
                  </span>
                  {t.soon && <span className="yb-tab-soon">Soon</span>}
                </button>
              );
            })}
          </div>
        </Reveal>
        <Reveal>
          <div className="yb-cfg">

            {/* ── left: step-by-step configurator ── */}
            <div>
              <div className="yb-cfg-block">
                <div className="yb-stephead">
                  <span className="yb-eyebrow">Step 01 — Starting point</span><i />
                </div>
                <h3>Current MMR</h3>
                <p>Select your bracket, then fine-tune below.</p>
                <div className="yb-tiles" role="group" aria-label="Current MMR bracket">
                  {bands.map((b, i) => {
                    const r = bandRank(i);
                    return (
                      <button key={b.label} type="button"
                              className={"yb-tile " + (i === bandIdx ? "is-on" : "")}
                              style={{ "--tier": r.color }}
                              onClick={() => setFromSafe(b.min)}
                              aria-pressed={i === bandIdx}
                              title={r.name}>
                        <RankBadge rank={r} />
                        <span>{b.label.replace(/\s/g, "")}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="yb-field">
                  <label htmlFor="yb-from">
                    Exact MMR <b className="yb-num">{from.toLocaleString()}</b>
                  </label>
                  <input id="yb-from" className="yb-range" type="range"
                         min={0} max={cap - 100} step={100} value={from}
                         style={fill(from, 0, cap - 100)}
                         onChange={(e) => setFromSafe(Number(e.target.value))} />
                </div>
                <div className="yb-selects">
                  <div className="yb-select">
                    <label htmlFor="yb-server">Server</label>
                    <select id="yb-server" value={server}
                            onChange={(e) => setServer(e.target.value)}>
                      {ORDER_OPTIONS.servers.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="yb-select">
                    <label htmlFor="yb-queue">Queue</label>
                    <select id="yb-queue" value={queue}
                            onChange={(e) => setQueue(e.target.value)}>
                      {ORDER_OPTIONS.queues.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="yb-cfg-block">
                <div className="yb-stephead">
                  <span className="yb-eyebrow">Step 02 — Goal</span><i />
                </div>
                <h3>Target MMR</h3>
                <p>Where the climb ends.</p>
                <div className="yb-goal">
                  <span className="yb-goal-big yb-num" aria-hidden="true">
                    {(to / 1000).toFixed(to % 1000 === 0 ? 0 : 1)}K
                  </span>
                  <div className="yb-goal-track">
                    <div className="yb-field" style={{ marginTop: 0 }}>
                      <label htmlFor="yb-to">
                        Target <b className="yb-num">{to.toLocaleString()}</b>
                      </label>
                      <input id="yb-to" className="yb-range is-gold" type="range"
                             min={100} max={cap} step={100} value={to}
                             style={fill(to, 100, cap)}
                             onChange={(e) => setTo(Math.max(from + 100, Number(e.target.value)))} />
                    </div>
                  </div>
                </div>
                <p className="yb-note" style={{ marginTop: 20 }}>
                  {mode === "solo"
                    ? "Solo is billed per 100 MMR at the rate for each bracket you pass through."
                    : "Party is billed per win. The estimate assumes ~" +
                      SITE_CONFIG.mmrPerWin + " MMR per win."}
                </p>
              </div>
            </div>

            {/* ── right: sticky order card ── */}
            <div>
              <div className="yb-order-card">
                <div className="yb-order-head">
                  <div>
                    <span className="yb-eyebrow" style={{ color: "var(--ash-dim)" }}>Checkout</span>
                    <b style={{ display: "block" }}>Your order</b>
                  </div>
                  <span className="yb-online"><i /> Currently boosting</span>
                </div>

                <div className="yb-order-sum">
                  <RankBadge rank={rankForMmr(from)} size={26} />
                  <div>
                    <span>{rankForMmr(from)?.name} → {rankForMmr(to)?.name}</span>
                    <b className="yb-num">{from.toLocaleString()} → {to.toLocaleString()} MMR</b>
                  </div>
                </div>

                {BOOST_ADDONS.length > 0 && (
                  <>
                    <div className="yb-order-lbl">Add-ons</div>
                    <div className="yb-addons" style={{ margin: 0 }}>
                      {BOOST_ADDONS.map((a) => {
                        const on = addons.includes(a.id);
                        return (
                          <button key={a.id} type="button"
                                  className={"yb-addon " + (on ? "is-on" : "")}
                                  onClick={() => toggleAddon(a.id)} aria-pressed={on}>
                            <span className="yb-addon-txt">
                              <b>{a.label}</b>
                              <span>{a.desc}</span>
                            </span>
                            <span className="yb-addon-pct">+{a.pct}%</span>
                            <span className="yb-switch" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="yb-order-lbl">Summary</div>
                <div className="yb-calc-rows">
                  <div><span>Service</span>
                    <span>{mode === "solo" ? "Solo Boost" : "Party Boost"}</span></div>
                  <div><span>MMR gained</span><span>+{q.gained.toLocaleString()}</span></div>
                  <div><span>Games to win (approx.)</span><span>{q.wins}</span></div>
                  <div><span>Average per win</span><span>{peso(perWinAvg)}</span></div>
                  {addonPct > 0 && <div><span>Add-ons</span><span>+{addonPct}%</span></div>}
                  <div><span>Server / queue</span><span>{server} · {queue}</span></div>
                </div>

                <div className="yb-total">
                  <div>
                    <span className="yb-order-lbl" style={{ margin: 0 }}>Total</span>
                    <div className="yb-price-big yb-num">{peso(q.total)}</div>
                  </div>
                  <div className="yb-total-meta">
                    {mode === "solo" ? "billed per 100 MMR" : "billed per win"}<br />
                    <b>~{q.wins} wins to go</b>
                  </div>
                </div>

                <Link
                  to={"/payment?service=" + mode + "&current=" + from + "&target=" + to}
                  className={"yb-btn yb-btn-block " + (mode === "solo" ? "yb-btn-primary" : "yb-btn-gold")}>
                  <TrendingUp size={17} /> Rank up
                </Link>
                <div className="yb-trust">
                  <span><Zap size={11} /> Fast queue</span>
                  <span><ShieldCheck size={11} /> Progress updates</span>
                  <span><MessageSquare size={11} /> Discord support</span>
                </div>
                <p className="yb-calc-note">
                  Estimate only — the final price is confirmed with Youngbai in Discord
                  before any games are played. Wins assume ~{SITE_CONFIG.mmrPerWin} MMR each.
                  {q.capped && " Rates are listed up to " + cap.toLocaleString() +
                    " MMR — message Youngbai for anything above."}
                </p>
              </div>

              {SHIELD_POINTS.length > 0 && (
                <div className={"yb-shield " + (shieldOpen ? "is-open" : "")}>
                  <button type="button" onClick={() => setShieldOpen(!shieldOpen)}
                          aria-expanded={shieldOpen}>
                    <ShieldCheck size={19} strokeWidth={1.8} />
                    <b>
                      <span className="yb-shield-eyebrow">Youngbai shield</span>
                      How your order is handled
                    </b>
                    <ChevronDown size={17} className="yb-shield-chev" />
                  </button>
                  <div className="yb-shield-body" aria-hidden={!shieldOpen}>
                    <ul>
                      {SHIELD_POINTS.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
