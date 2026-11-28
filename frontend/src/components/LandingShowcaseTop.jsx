import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BellRing, Check, CircleDollarSign,
  ClipboardCheck, CreditCard, ReceiptText, ShieldCheck, Sparkles,
  TrendingUp, Wallet,
} from "lucide-react";

const accents = [
  { name: "Violet", value: "violet", color: "#8b5cf6" },
  { name: "Ocean", value: "ocean", color: "#0ea5e9" },
  { name: "Mint", value: "mint", color: "#10b981" },
  { name: "Coral", value: "coral", color: "#f97316" },
];

const features = [
  { icon: Wallet, title: "Budgets that make sense", copy: "Set a monthly target and category caps that move with your real spending." },
  { icon: ReceiptText, title: "Capture expenses faster", copy: "Turn natural-language notes and receipts into drafts you can review." },
  { icon: TrendingUp, title: "See the patterns", copy: "Understand category trends and test small changes before they add up." },
  { icon: ShieldCheck, title: "You stay in control", copy: "Review AI suggestions before anything becomes part of your records." },
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingShowcaseTop({ onOpenSignup, onTryDemo }) {
  const [accent, setAccent] = useState("violet");
  const [confirmed, setConfirmed] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Making Hero Visual Move with Mouse 
  function handlePointerMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  // Normalized -0.5 (left/top) to +0.5 (right/bottom)
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;

  const maxTiltY = 8; // degrees left/right
  const maxTiltX = 6; // degrees up/down
  const maxShift = 8; // px subtle drift

  el.style.setProperty("--ry", `${(px * 2 * maxTiltY).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${(-py * 2 * maxTiltX).toFixed(2)}deg`);
  el.style.setProperty("--tx", `${(px * 2 * maxShift).toFixed(2)}px`);
  el.style.setProperty("--ty", `${(py * 2 * maxShift).toFixed(2)}px`);
}

function handlePointerLeave(e) {
  const el = e.currentTarget;
  // Reset back to your resting tilt
  el.style.setProperty("--rx", "2deg");
  el.style.setProperty("--ry", "-5deg");
  el.style.setProperty("--tx", "0px");
  el.style.setProperty("--ty", "0px");
}

const TRUST_ITEMS = [
  { Icon: ShieldCheck, label: "Review before save" },
  { Icon: ClipboardCheck, label: "Transparent budgets" },
  { Icon: Sparkles, label: "Helpful AI assistance" },
  { Icon: CircleDollarSign, label: "Numbers you can verify" },
];

  return (
    <div className="landing-content" data-accent={accent}>
      <section className="hero-section" id="top">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={rise}>
          <div className="eyebrow"><span className="eyebrow-pulse" /> Your money, with a clearer plan</div>
          <h1>Make every rupee<br /><span className="gradient-text">work smarter.</span></h1>
          <p className="hero-description">
            A calmer way to manage your money. Track expenses, set meaningful budgets,
            and get helpful AI insights — all while keeping every important decision in your hands.
          </p>
          <div className="hero-actions">
            <button className="button button-primary button-large" onClick={onOpenSignup}>
              Start for free <ArrowRight size={17} />
            </button>
            <button className="button button-secondary button-large" onClick={onTryDemo}>
              Explore demo <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="hero-proof">
            <span className="proof-icon"><ShieldCheck size={15} /></span>
            <span>Review-first AI · Clear numbers · Built for everyday budgets</span>
          </div>
          <div className="accent-picker" aria-label="Choose accent color">
            <span>Choose your vibe</span>
            {accents.map((item) => (
              <button
                key={item.value}
                className={`accent-dot ${accent === item.value ? "is-active" : ""}`}
                style={{ "--dot-color": item.color }}
                aria-label={`${item.name} accent`}
                aria-pressed={accent === item.value}
                onClick={() => setAccent(item.value)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
        >
          <div className="visual-glow" />
          <div className="dashboard-window" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
            <div className="window-top">
              <div className="window-dots"><i /><i /><i /></div>
              <span>SpendWise overview</span>
              <span className="live-pill"><span /> Live preview</span>
            </div>
            <div className="dashboard-body">
              <div className="dash-heading">
                <div><small>YOUR MONTHLY OVERVIEW</small><h3>Good progress ✨</h3></div>
                <span className="month-chip">November 2026</span>
              </div>
              <div className="balance-card">
                <div>
                  <span className="muted-on-dark">Monthly budget</span>
                  <strong>PKR 80,000</strong>
                  <span className="budget-note"><TrendingUp size={13} /> You’re on track this month</span>
                </div>
                <div className="balance-icon"><CircleDollarSign size={25} /></div>
                <div className="budget-track"><span /></div>
                <div className="budget-foot"><span>PKR 48,600 spent</span><b>61% used</b></div>
              </div>
              <div className="dash-grid">
                <div className="mini-stat"><span className="stat-icon lavender"><CreditCard size={16} /></span><small>Expenses</small><b>PKR 48,600</b><em>Across 24 entries</em></div>
                <div className="mini-stat"><span className="stat-icon peach"><BellRing size={16} /></span><small>Budget left</small><b>PKR 31,400</b><em>39% remaining</em></div>
              </div>
              <div className="category-preview">
                <div className="category-title"><b>Category snapshot</b><a href="#more-features">View all <ArrowUpRight size={12} /></a></div>
                {[["Food", "PKR 14,200", 72, "food"], ["Transport", "PKR 6,800", 44, "transport"], ["Shopping", "PKR 9,500", 58, "shopping"]].map(([name, amount, width, type]) => (
                  <div className="category-row" key={name}>
                    <div><span>{name}</span><b>{amount}</b></div>
                    <div className="category-track"><span className={type} style={{ width: `${width}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <motion.div className="float-card float-review" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <span className="float-check"><Check size={15} /></span><div><b>Ready for review</b><small>2 expense drafts detected</small></div>
          </motion.div>
          <motion.div className="float-card float-insight" animate={{ y: [0, 7, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
            <span className="insight-icon"><Sparkles size={16} /></span><div><b>Smart insight</b><small>Food spending is trending up</small></div>
          </motion.div>
        </motion.div>
      </section>

      {/* <section className="trust-strip" aria-label="Product principles">
        <span><ShieldCheck size={17} /> Review before save</span>
        <span><ClipboardCheck size={17} /> Transparent budgets</span>
        <span><Sparkles size={17} /> Helpful AI assistance</span>
        <span><CircleDollarSign size={17} /> Numbers you can verify</span>
      </section> */}
        <section className="trust-strip" aria-label="Product principles">
        <div className="trust-strip__track">
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className="trust-strip__group"
              aria-hidden={copyIndex === 1}
            >
              {TRUST_ITEMS.map(({ Icon, label }) => (
                <span key={`${copyIndex}-${label}`} className="trust-strip__item">
                  <Icon size={17} strokeWidth={2} aria-hidden="true" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="features-section section-anchor" id="assistant">
        <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rise}>
          <span className="section-kicker">A better money routine</span>
          <h2>Everything you need.<br /><span className="gradient-text">Nothing you don’t.</span></h2>
          <p>Simple tools for daily decisions, with enough insight to help you plan ahead.</p>
        </motion.div>
        <div className="feature-layout">
          <div className="feature-list">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button key={feature.title} className={`feature-select ${activeFeature === index ? "selected" : ""}`} onClick={() => setActiveFeature(index)}>
                  <span className="feature-select-icon"><Icon size={19} /></span>
                  <span><b>{feature.title}</b><small>{feature.copy}</small></span>
                  <ArrowUpRight size={17} className="feature-arrow" />
                </button>
              );
            })}
          </div>
          <motion.div className="feature-showcase" key={activeFeature} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <div className="showcase-topline"><span>FEATURE SPOTLIGHT</span><span>0{activeFeature + 1} / 04</span></div>
            <div className="showcase-art">
              {activeFeature === 0 && <div className="budget-art"><div className="art-ring"><strong>72%</strong><small>of budget</small></div><div className="art-legend"><span>Monthly limit <b>PKR 80k</b></span><span>Category caps <b>5 active</b></span><span>Remaining <b>PKR 31.4k</b></span></div></div>}
              {activeFeature === 1 && <div className="receipt-art"><div className="receipt-paper"><ReceiptText size={25} /><b>Campus Cafe</b><small>Today · Food</small><strong>PKR 650</strong><span className="receipt-confirm"><Check size={13} /> Draft ready to review</span></div></div>}
              {activeFeature === 2 && <div className="trend-art"><div className="trend-bars">{[38, 58, 44, 76, 61, 88, 68].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><span>Spending trend · Last 7 periods</span></div>}
              {activeFeature === 3 && <div className="ai-art"><Sparkles size={30} /><b>Here’s what I found…</b><p>Your transport spending is 12% lower than last month.</p><span><Check size={13} /> Based on your recorded transactions</span></div>}
            </div>
            <h3>{features[activeFeature].title}</h3>
            <p>{features[activeFeature].copy}</p>
          </motion.div>
        </div>
      </section>

      <section className="cta-band">
        <div><span className="section-kicker">A clearer next step</span><h2>Start with a plan.<br />Grow with confidence.</h2></div>
        <button className="button button-light button-large" onClick={onOpenSignup}>Create your free account <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}
