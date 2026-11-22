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

const PIE_COLORS = ["#0f172a", "#0d9488", "#3b82f6", "#6366f1", "#8b5cf6", "#f59e0b", "#ec4899", "#64748b"];

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "Not set";
  const num = Number(value);
  if (Number.isNaN(num)) return "0.00";
  return `Rs ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function Dashboard({
  dashboardStats,
  analytics,
  transactions = [],
  loading,
  error,
  onRefresh,
}) {
  if (loading && !dashboardStats) {
    return <div className="page-content">Loading live dashboard statistics...</div>;
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const recentTx = safeTransactions.slice(0, 5);

  const totalIncome = Number(dashboardStats?.total_income || 0);
  const totalExpenses = Number(dashboardStats?.total_expenses || 0);
  const balance = Number(dashboardStats?.balance || 0);
  const monthlyBudget = dashboardStats?.monthly_budget;
  const remainingBudget = dashboardStats?.remaining_budget;

  const hasBudget = monthlyBudget !== null && monthlyBudget !== undefined;
  const budgetNum = hasBudget ? Number(monthlyBudget) : 0;
  const utilizedPct =
    hasBudget && budgetNum > 0 ? Math.min(100, Math.round((totalExpenses / budgetNum) * 100)) : 0;

  const categoryData = (analytics?.category_expenses || []).map((item, idx) => ({
    name: item.category,
    value: Number(item.total) || 0,
    color: PIE_COLORS[idx % PIE_COLORS.length],
  }));

  const monthlyData = analytics?.monthly_expenses || [];
  const period = dashboardStats?.period;

  return (
    <div className="page-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 700 }}>Welcome back, Alex!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {period ? `Period: ${period.month}/${period.year}` : "Current Month Overview"}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onRefresh}>
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "#ef4444", color: "#ef4444", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Top KPI Cards from GET /api/dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Total Spent This Month
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 700, marginTop: "0.45rem" }}>
            {formatMoney(totalExpenses)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
            Income: {formatMoney(totalIncome)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Current Balance
          </div>
          <div
            style={{
              fontSize: "1.65rem",
              fontWeight: 700,
              marginTop: "0.45rem",
              color: balance < 0 ? "#dc2626" : "var(--text-main)",
            }}
          >
            {formatMoney(balance)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
            {balance < 0 ? "Expenses exceed income" : "Income minus expenses"}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Monthly Budget & Remaining
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "0.45rem" }}>
            <span style={{ fontSize: "1.65rem", fontWeight: 700 }}>{formatMoney(monthlyBudget)}</span>
            {hasBudget && <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{utilizedPct}%</span>}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
            {hasBudget ? `Remaining: ${formatMoney(remainingBudget)}` : "No monthly budget configured"}
          </div>
          {hasBudget && (
            <div style={{ height: 7, background: "#e2e8f0", borderRadius: 999, marginTop: "0.55rem", overflow: "hidden" }}>
              <div
                style={{
                  width: `${utilizedPct}%`,
                  height: "100%",
                  background: utilizedPct > 90 ? "#ef4444" : "#0d9488",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Charts from GET /api/analytics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.55fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Monthly Expense Trend (6 Months)
          </h3>
          <div style={{ width: "100%", height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickFormatter={(v) => `Rs ${v}`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(val) => formatMoney(val)} />
                <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Expense Breakdown (Current Month)
          </h3>
          {categoryData.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", paddingTop: "2rem" }}>
              No expense categories recorded for this month yet.
            </p>
          ) : (
            <>
              <div style={{ width: "100%", height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2}>
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatMoney(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.65rem", fontSize: "0.75rem" }}>
                {categoryData.map((item) => (
                  <span key={item.name} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                    {item.name}: {formatMoney(item.value)}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions from GET /api/transactions */}
      <div className="card">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Recent Transactions</h3>
        {recentTx.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No transactions found in the database.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                <th style={{ paddingBottom: "0.5rem" }}>Description</th>
                <th style={{ paddingBottom: "0.5rem" }}>Category</th>
                <th style={{ paddingBottom: "0.5rem" }}>Type</th>
                <th style={{ paddingBottom: "0.5rem" }}>Date</th>
                <th style={{ paddingBottom: "0.5rem", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.55rem 0", fontWeight: 500 }}>{tx.description || "-"}</td>
                  <td style={{ padding: "0.55rem 0", color: "var(--text-muted)" }}>{tx.category}</td>
                  <td style={{ padding: "0.55rem 0", color: "var(--text-muted)" }}>{tx.type}</td>
                  <td style={{ padding: "0.55rem 0", color: "var(--text-muted)" }}>{tx.date}</td>
                  <td
                    style={{
                      padding: "0.55rem 0",
                      textAlign: "right",
                      fontWeight: 600,
                      color: tx.type === "Income" ? "#0d9488" : "var(--text-main)",
                    }}
                  >
                    {tx.type === "Income" ? "+" : "-"}
                    {formatMoney(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}