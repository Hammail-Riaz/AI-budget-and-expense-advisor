import { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { financeService } from "../services/financeService";

function formatPkr(value) {
  if (value === null || value === undefined) return "Not set";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `PKR ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


export function AiInsights() {
  const [report, setReport] = useState(null);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasMonthlyBudget =report?.monthly_budget !== null && report?.monthly_budget !== undefined;
  const monthlyBudgetNum = hasMonthlyBudget ? Number(report.monthly_budget) : 0;
  const monthlyExpensesNum = Number(report?.total_expenses) || 0;
  const remainingBudgetNum =report?.remaining_budget !== null && report?.remaining_budget !== undefined? Number(report.remaining_budget): hasMonthlyBudget? monthlyBudgetNum - monthlyExpensesNum: null;

  const loadInsights = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await financeService.getInsights();
      setReport(data.report || null);
      setAdvice(data.advice || "");
    } catch (err) {
      setError(err.message || "Failed to generate AI insights");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return (
    <div className="page-content">
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>AI Insights</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Personalized budget and spending analysis generated from your live financial report.
          </p>
        </div>

        <button type="button" className="btn btn-outline" onClick={loadInsights} disabled={loading}>
          <RefreshCw size={15} />
          <span>{loading ? "Analyzing..." : "Regenerate Insights"}</span>
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

      {report && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Monthly Budget</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem" }}>
              {hasMonthlyBudget ? formatPkr(monthlyBudgetNum) : "Not set"}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Monthly Expenses</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem" }}>
              {formatPkr(monthlyExpensesNum)}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Remaining       Balance</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem" }}>
              {remainingBudgetNum !== null ? formatPkr(remainingBudgetNum) : "Not set"}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Budget Utilization</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "0.25rem" }}>
              {report.budget_utilization !== null && report.budget_utilization !== undefined
                ? `${report.budget_utilization}%`
                : "No Budget"}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.75rem" }}>
          <Sparkles size={18} color="#0d9488" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Advisor Report</h3>
        </div>

        {loading && !advice ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Generating personalized financial advice with Groq...
          </p>
        ) : (
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              fontSize: "0.9rem",
            }}
          > 
              
            {advice || "No advice returned yet."}
          </div>
        )}
      </div>
    </div>
  );
}