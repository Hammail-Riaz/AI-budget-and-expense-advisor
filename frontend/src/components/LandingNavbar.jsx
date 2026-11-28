import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

const links = [
  ["Assistant", "#assistant"],
  ["Features", "#more-features"],
  ["Reviews", "#reviews"],
  ["Guides", "#blog"],
];

export default function LandingNavbar({ onOpenLogin, onOpenSignup }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="landing-nav"
    >
      <div className="nav-inner">
        <a href="#top" className="brand" aria-label="SpendWise AI home">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>SpendWise <b>AI</b></span>
        </a>

        <nav className="desktop-links" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="button button-quiet nav-login" onClick={onOpenLogin}>Log in</button>
          <button className="button button-primary nav-cta" onClick={onOpenSignup}>
            Get started <ArrowUpRight size={16} />
          </button>
          <button
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="Mobile navigation"
          >
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <button className="button button-primary" onClick={() => { setMenuOpen(false); onOpenSignup?.(); }}>
              Create account <ArrowUpRight size={16} />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
