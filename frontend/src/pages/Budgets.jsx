import { useState, useEffect } from "react";
import { Wallet, RefreshCw, CheckCircle2 } from "lucide-react";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function formatMoney(val) {
  const num = Number(val);
  if (Number.isNaN(num)) return "$0.00";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function Budgets({
  budget,
  budgetMonth,
  budgetYear,
  dashboardStats,
  budgetLoading,
  error,
  onChangePeriod,
  onSaveBudget,
  onRefresh,
}) {
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (budget?.monthly_limit !== undefined && budget?.monthly_limit !== null) {
      setMonthlyLimit(String(budget.monthly_limit));
    } else {
      setMonthlyLimit("");
    }
  }, [budget, budgetMonth, budgetYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setStatusMessage("");

    const numericLimit = Number(monthlyLimit);
    if (!numericLimit || numericLimit <= 0) {
      setFormError("Monthly limit must be greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await onSaveBudget({
        monthly_limit: numericLimit,
        month: Number(budgetMonth),
        year: Number(budgetYear),
      });
      setStatusMessage("Budget saved successfully.");
    } catch (err) {
      setFormError(err.message || "Failed to save budget.");
    } finally {
      setSubmitting(false);
    }
  };

  const limitNum = budget?.monthly_limit ? Number(budget.monthly_limit) : 0;
  const currentExpenses = Number(dashboardStats?.total_expenses || 0);
  const remaining = limitNum > 0 ? limitNum - currentExpenses : null;
  const utilizedPct =
    limitNum > 0 ? Math.min(100, Math.round((currentExpenses / limitNum) * 100)) : 0;

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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Monthly Budget</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Set or update your monthly spending limit by month and year.
          </p>
        </div>

        <button type="button" className="btn btn-outline" onClick={onRefresh}>
          <RefreshCw size={15} />
          <span>Refresh</span>
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

      {/* Period Selector */}
      <div
        className="card"
        style={{
          display: "flex",
          gap: "0.85rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>Budget Period:</span>

        <select
          className="select"
          value={budgetMonth}
          onChange={(e) => {
            setStatusMessage("");
            onChangePeriod(Number(e.target.value), budgetYear);
          }}
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label} ({m.value})
            </option>
          ))}
        </select>

        <input
          type="number"
          className="input"
          min={2020}
          max={2100}
          style={{ width: "120px" }}
          value={budgetYear}
          onChange={(e) => {
            setStatusMessage("");
            onChangePeriod(budgetMonth, Number(e.target.value));
          }}
        />
      </div>

      {/* Main Budget Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        {/* Current Budget Summary Card */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
              Saved Budget ({budgetMonth}/{budgetYear})
            </h3>
            <Wallet size={18} color="#0d9488" />
          </div>

          {budgetLoading ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Loading budget...
            </p>
          ) : !budget ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              No monthly budget set for {budgetMonth}/{budgetYear}. Enter a limit on the right
              to create one.
            </p>
          ) : (
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                {formatMoney(budget.monthly_limit)}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  marginTop: "0.35rem",
                }}
              >
                Current month expenses: {formatMoney(currentExpenses)} • Remaining:{" "}
                <strong style={{ color: remaining < 0 ? "#dc2626" : "var(--text-main)" }}>
                  {remaining !== null ? formatMoney(remaining) : "N/A"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginTop: "0.8rem",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#e2e8f0",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${utilizedPct}%`,
                      height: "100%",
                      background: utilizedPct > 90 ? "#ef4444" : "#0d9488",
                    }}
                  />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{utilizedPct}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Create or Update Budget Form */}
        <div className="card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            {budget ? "Update Monthly Budget" : "Create Monthly Budget"}
          </h3>

          {formError && (
            <p style={{ color: "#dc2626", fontSize: "0.82rem", marginBottom: "0.65rem" }}>
              {formError}
            </p>
          )}

          {statusMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#0f766e",
                fontSize: "0.82rem",
                marginBottom: "0.65rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={15} />
              <span>{statusMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              Monthly Limit (must be greater than 0)
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="input"
                style={{ width: "100%", marginTop: "0.35rem" }}
                placeholder="e.g., 20000"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-teal"
              disabled={submitting}
              style={{ justifyContent: "center" }}
            >
              {submitting ? "Saving..." : budget ? "Update Budget" : "Save Budget"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}