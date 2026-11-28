import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, Quote, Sparkles, X } from "lucide-react";

const reviews = [
  { quote: "Separate limits for food, transport, and bills make it easier to understand where my allowance goes.", name: "Ayesha K.", role: "Student tester" },
  { quote: "I like that AI suggestions appear as drafts. I can check the amount and category before saving.", name: "Bilal M.", role: "Early tester" },
  { quote: "The budget overview makes it much easier to plan the rest of the month without guessing.", name: "Zainab R.", role: "Student tester" },
  { quote: "Testing cuts with the What-If sliders makes it obvious how small daily savings add up over time.", name: "Hamza T.", role: "Beta tester" },
  { quote: "Scanning a receipt into an editable draft saves me from typing every item manually after shopping.", name: "Maha S.", role: "Student tester" },
  { quote: "Having category progress bars next to my overall budget helps me spot overspending early.", name: "Usman A.", role: "Early tester" },
  { quote: "Checking my remaining monthly budget separately from my net balance keeps weekend plans realistic.", name: "Hira N.", role: "Student tester" },
  { quote: "Asking AI about recent expenses gives clear answers without me digging through every entry.", name: "Daniyal K.", role: "Beta tester" },
];

const articles = [
  { topic: "AI Tips", time: "4 min read", title: "From one sentence to expense drafts", summary: "How natural-language expense entry can reduce repetitive form filling.", body: "Magic Input turns a short description into structured expense candidates. You can inspect the merchant, date, amount, and category, then edit or remove anything that needs attention before saving." },
  { topic: "Budgets", time: "5 min read", title: "A practical guide to category budgets", summary: "Pair an overall monthly limit with category caps that show where money is going.", body: "An overall budget gives you a monthly ceiling. Category caps help you spot pressure in areas such as Food, Transport, Bills, Shopping, and Entertainment. Reviewing both gives a more useful picture than looking at one total alone." },
  { topic: "AI Tips", time: "3 min read", title: "Turn receipts into editable expense drafts", summary: "A quick look at extracting receipt details while keeping the final review in your hands.", body: "Receipt scanning can extract details such as merchant, date, and total into an editable draft. Check the extracted fields and correct unclear details before confirming the transaction." },
];

export default function LandingShowcaseBottom({ onOpenLogin, onOpenSignup, onTryDemo }) {
  const [topic, setTopic] = useState("All");
  const [article, setArticle] = useState(null);
  const visible = topic === "All" ? articles : articles.filter((item) => item.topic === topic);

  return (
    <>
      <section className="reviews-section section-anchor" id="reviews">
        <div className="landing-content">
          <motion.div className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-kicker">Made for real-life routines</span>
            <h2>Clarity feels <span className="gradient-text">good.</span></h2>
            <p>Thoughtful tools designed to make everyday money decisions feel less overwhelming.</p>
          </motion.div>
          <div className="review-grid">
            {reviews.map((review, index) => (
              <motion.article className={`review-card review-card-${index + 1}`} key={review.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Quote size={22} className="review-quote-icon" />
                <div className="review-stars">★★★★★</div>
                <p>“{review.quote}”</p>
                <div className="review-person"><span>{review.name.slice(0, 1)}</span><div><b>{review.name}</b><small>{review.role}</small></div></div>
              </motion.article>
            ))}
          </div>
          <div className="review-note"><Sparkles size={16} /> Example feedback from early product testers.</div>
        </div>
      </section>

      <section className="blog-section section-anchor" id="blog">
        <div className="landing-content">
          <div className="blog-heading">
            <div><span className="section-kicker"><BookOpen size={14} /> Learn at your pace</span><h2>Small reads.<br /><span className="gradient-text">Smarter habits.</span></h2></div>
            <div className="topic-filters">
              {["All", "AI Tips", "Budgets"].map((item) => <button key={item} className={topic === item ? "active" : ""} onClick={() => setTopic(item)}>{item}</button>)}
            </div>
          </div>
          <div className="article-grid">
            {visible.map((item, index) => (
              <motion.button className="article-card" key={item.title} onClick={() => setArticle(item)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <div className={`article-art article-art-${index + 1}`}><BookOpen size={27} /><span>{item.topic}</span></div>
                <div className="article-meta"><span>{item.topic}</span><span><Clock3 size={13} /> {item.time}</span></div>
                <h3>{item.title}</h3><p>{item.summary}</p>
                <span className="article-read">Read guide <ArrowUpRight size={15} /></span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-orb" />
        <div className="landing-content final-cta-inner">
          <span className="section-kicker">Your next chapter starts here</span>
          <h2>Feel more in control<br />of your money.</h2>
          <p>Build a clearer picture of your spending, one small step at a time.</p>
          <div className="hero-actions">
            <button className="button button-light button-large" onClick={onOpenSignup}>Get started <ArrowRight size={17} /></button>
            <button className="button button-glass button-large" onClick={onTryDemo}>Try demo data</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-content footer-inner">
          <a href="#top" className="brand footer-brand"><span className="brand-mark"><Sparkles size={17} /></span><span>SpendWise <b>AI</b></span></a>
          <p>Smart budgeting, thoughtful insights, and expense tools that keep you in control.</p>
          <div className="footer-links"><a href="#assistant">Features</a><a href="#reviews">Reviews</a><a href="#blog">Guides</a><button onClick={onOpenLogin}>Log in</button></div>
          <small>© 2026 SpendWise AI. Built for clearer everyday budgeting.</small>
        </div>
      </footer>

      <AnimatePresence>
        {article && (
          <motion.div className="article-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setArticle(null)}>
            <motion.div className="article-modal" role="dialog" aria-modal="true" aria-labelledby="article-title" initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} onClick={(event) => event.stopPropagation()}>
              <div className="modal-top"><span>{article.topic} · {article.time}</span><button aria-label="Close guide" onClick={() => setArticle(null)}><X size={19} /></button></div>
              <h3 id="article-title">{article.title}</h3><p>{article.body}</p>
              <button className="button button-primary" onClick={() => { setArticle(null); onOpenSignup?.(); }}>Get started <ArrowRight size={16} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
