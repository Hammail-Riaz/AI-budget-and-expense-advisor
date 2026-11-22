import { RefreshCw } from "lucide-react";
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
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#0d9488",
  "#0284c7",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#10b981",
  "#ec4899",
  "#6366f1",
];

function formatRs(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "Rs 0.00";
  const sign = num < 0 ? "-" : "";
  return `${sign}Rs ${Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function Dashboard({
  dashboardStats,
  analytics,
  transactions = [],
  loading,
  error,
  onRefresh,
}) {
  const txList = Array.isArray(transactions) ? transactions : [];
  const recentTransactions = txList.slice(0, 5);

  const budgetLimitNum =
    dashboardStats?.monthly_budget !== null &&
    dashboardStats?.monthly_budget !== undefined
      ? Number(dashboardStats.monthly_budget)
      : null;

  const monthlySeries = (
    Array.isArray(analytics?.monthly_expenses) ? analytics.monthly_expenses : []
  ).map((m) => ({
    ...m,
    label: m.label || `${m.month}/${m.year}`,
    total: Number(m.total) || 0,
    budget: budgetLimitNum,
  }));

  const categorySeries = (
    Array.isArray(analytics?.category_expenses) ? analytics.category_expenses : []
  )
    .map((c) => ({
      name: c.category,
      value: Number(c.total) || 0,
    }))
    .filter((c) => c.value > 0);

  const totalIncome = dashboardStats?.total_income ?? "0.00";
  const totalExpenses = dashboardStats?.total_expenses ?? "0.00";
  const balance = dashboardStats?.balance ?? "0.00";
  const hasBudget = budgetLimitNum !== null && !Number.isNaN(budgetLimitNum);
  const totalExpensesNum = Number(totalExpenses) || 0;
  const remainingBudgetNum = hasBudget ? budgetLimitNum - totalExpensesNum : null;

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1.1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Welcome back, Sir!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Current Month Overview
          </p>
        </div>

        <button type="button" className="btn btn-outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={15} />
          <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {error && (
        <div
          className="card"
          style={{ borderColor: "#ef4444", color: "#dc2626", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      {/* Top KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Total Spent This Month
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.3rem" }}>
            {formatRs(totalExpenses)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Income: {formatRs(totalIncome)}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Current Balance</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.3rem" }}>
            {formatRs(remainingBudgetNum)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Income minus expenses
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Monthly Budget &amp; Remaining
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.3rem" }}>
            {hasBudget ? formatRs(dashboardStats.monthly_budget) : "Not set"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {hasBudget
              ? `Remaining: ${formatRs(dashboardStats.remaining_budget)}`
              : "No monthly budget configured"}
          </div>
        </div>
      </div>

      {/* Charts Row: LineChart & PieChart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem" }}>
            Monthly Expense Trend (6 Months)
          </h3>

          {monthlySeries.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No monthly expense trend data available.
            </p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySeries} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => formatRs(val)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Expenses"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {hasBudget && (
                    <Line
                      type="monotone"
                      dataKey="budget"
                      name="Monthly Budget"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.85rem" }}>
            Expense Breakdown (Current Month)
          </h3>

          {categorySeries.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No expense categories recorded for this month yet.
            </p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySeries}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={82}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {categorySeries.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatRs(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Recent Transactions
        </h3>

        {recentTransactions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No transactions found in the database.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "0.55rem 0.4rem" }}>Date</th>
                <th style={{ padding: "0.55rem 0.4rem" }}>Description</th>
                <th style={{ padding: "0.55rem 0.4rem" }}>Category</th>
                <th style={{ padding: "0.55rem 0.4rem" }}>Type</th>
                <th style={{ padding: "0.55rem 0.4rem", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === "Income";
                const amt = Math.abs(Number(tx.amount) || 0);
                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "0.6rem 0.4rem", color: "var(--text-muted)" }}>
                      {tx.date}
                    </td>
                    <td style={{ padding: "0.6rem 0.4rem", fontWeight: 600 }}>
                      {tx.description || "-"}
                    </td>
                    <td style={{ padding: "0.6rem 0.4rem" }}>{tx.category}</td>
                    <td style={{ padding: "0.6rem 0.4rem" }}>{tx.type}</td>
                    <td
                      style={{
                        padding: "0.6rem 0.4rem",
                        textAlign: "right",
                        fontWeight: 700,
                        color: isIncome ? "#0d9488" : "var(--text-main)",
                      }}
                    >
                      {isIncome ? "+" : "-"}
                      {formatRs(amt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 