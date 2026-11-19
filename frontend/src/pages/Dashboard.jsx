import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sparkles, Send } from "lucide-react";

const SPARKLINE_DATA = [
  { v: 18 },
  { v: 24 },
  { v: 21 },
  { v: 32 },
  { v: 29 },
  { v: 40 },
];

export function Dashboard({ dashboard, onAskAi, aiResponse, aiLoading }) {
  const [prompt, setPrompt] = useState("");

  if (!dashboard) {
    return <div className="page-content">Loading dashboard...</div>;
  }

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onAskAi(prompt);
    setPrompt("");
  };

  return (
    <div className="page-content">
      {/* Greeting */}
      <div style={{ marginBottom: "1.1rem" }}>
        <h1 style={{ fontSize: "1.55rem", fontWeight: 700 }}>
          Welcome back, {dashboard.userName || "Alex"}!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Nov 19, 2026</p>
      </div>

      {/* Top 3 KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Total Spent This Month
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.45rem" }}>
            <span style={{ fontSize: "1.65rem", fontWeight: 700 }}>
              ${Number(dashboard.totalSpentMonth).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <div style={{ width: 78, height: 32 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SPARKLINE_DATA}>
                  <Line type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2.2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#0d9488", marginTop: "0.35rem" }}>
            +{dashboard.spentDeltaPercent}% vs last month
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Current Budget
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "0.45rem" }}>
            <span style={{ fontSize: "1.65rem", fontWeight: 700 }}>
              ${Number(dashboard.currentBudget).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {dashboard.budgetUtilizedPercent}%
            </span>
          </div>
          <div
            style={{
              height: 7,
              background: "#e2e8f0",
              borderRadius: 999,
              marginTop: "0.65rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${dashboard.budgetUtilizedPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #0d9488, #2dd4bf)",
                borderRadius: 999,
              }}
            />
          </div>
        </div>

        <div
          className="card"
          style={{
            border: "1.5px solid transparent",
            background:
              "linear-gradient(var(--bg-card), var(--bg-card)) padding-box, linear-gradient(120deg, #f59e0b, #ec4899, #3b82f6) border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>AI Savings Tip</span>
            <Sparkles size={17} color="#d97706" />
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
            {dashboard.savingsTip}{" "}
            <strong style={{ color: "#0d9488", cursor: "pointer" }}>[Apply Goal]</strong>
          </p>
        </div>
      </div>

      {/* Middle Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.65fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Monthly Spending Chart</h3>
            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>● Food</span>
              <span>● Utilities</span>
              <span>● Subscription</span>
              <span>● Transport</span>
              <span>•• Trend</span>
            </div>
          </div>

          <div style={{ width: "100%", height: 225, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Line type="monotone" dataKey="food" stroke="#0d9488" strokeWidth={2.2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="utilities" stroke="#1e293b" strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="subscription" stroke="#6366f1" strokeWidth={1.8} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="transport" stroke="#38bdf8" strokeWidth={1.8} dot={false} connectNulls={false} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#0f172a"
                  strokeWidth={2}
                  strokeDasharray="3 4"
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Expense Breakdown</h3>
          <div style={{ width: "100%", height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboard.expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={2}
                >
                  {dashboard.expenseBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.65rem", fontSize: "0.75rem" }}>
            {dashboard.expenseBreakdown.map((item) => (
              <span key={item.name} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                {item.name} ({item.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions + Ask AI Assistant */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "1rem" }}>
        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Recent Transactions</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ paddingBottom: "0.5rem" }}>Description</th>
                <th style={{ paddingBottom: "0.5rem" }}>Category</th>
                <th style={{ paddingBottom: "0.5rem" }}>Date</th>
                <th style={{ paddingBottom: "0.5rem", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard.recentTransactions || []).map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.55rem 0", fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: "0.55rem 0", color: "var(--text-muted)" }}>{tx.category}</td>
                  <td style={{ padding: "0.55rem 0", color: "var(--text-muted)" }}>{tx.date}</td>
                  <td style={{ padding: "0.55rem 0", textAlign: "right", fontWeight: 600 }}>
                    ${Number(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ask AI Assistant</h3>
            {aiResponse && (
              <p
                style={{
                  fontSize: "0.82rem",
                  background: "var(--bg-app)",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "8px",
                  marginBottom: "0.75rem",
                  color: "var(--text-main)",
                }}
              >
                {aiResponse}
              </p>
            )}
          </div>

          <form onSubmit={handleAsk} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="text"
              className="input"
              style={{ flex: 1 }}
              placeholder='Ask SpendWise: "How can I save $200 by next month?"'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" className="btn btn-outline" disabled={aiLoading}>
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}