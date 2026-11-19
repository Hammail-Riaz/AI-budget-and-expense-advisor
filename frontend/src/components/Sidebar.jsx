import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ArrowLeftRight,
  Wallet,
  Sparkles,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets", to: "/budgets", icon: Wallet },
  { label: "AI Insights", to: "/insights", icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: "215px",
        background: "var(--bg-sidebar)",
        color: "#cbd5e1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.1rem 0.75rem",
        flexShrink: 0,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: "0.35rem 0.6rem 1.4rem",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1.05rem",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <TrendingUp size={16} color="#0f172a" />
          </span>
          <span>SpendWise AI</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.65rem 0.8rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "var(--bg-sidebar-active)" : "transparent",
              })}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.65rem 0.6rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: "0.875rem",
          color: "#e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <img
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=AlexMercer"
            alt="Alex Mercer"
            style={{ width: 28, height: 28, borderRadius: "50%", background: "#334155" }}
          />
          <span>Alex Mercer</span>
        </div>
        <ChevronDown size={15} color="#94a3b8" />
      </div>
    </aside>
  );
}