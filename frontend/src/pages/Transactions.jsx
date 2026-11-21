import { useState, useMemo } from "react";
import { Plus, Download, Pencil, Trash2, Sparkles, SlidersHorizontal } from "lucide-react";

function getTagStyle(type) {
  if (type === "pink") return { background: "#fce7f3", color: "#be185d" };
  if (type === "blue") return { background: "#dbeafe", color: "#1d4ed8" };
  if (type === "amber") return { background: "#fef3c7", color: "#b45309" };
  return { background: "#f1f5f9", color: "#334155" };
}

export function Transactions({ transactions, searchQuery, onOpenAddModal, onDeleteTransaction }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [aiFilter, setAiFilter] = useState("none");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(tx.amount).includes(searchQuery);

      const matchesCategory = categoryFilter === "All" || tx.category === categoryFilter;
      const matchesType = typeFilter === "all" || tx.type === typeFilter;

      const matchesAi =
        aiFilter === "none" ||
        (aiFilter === "review" && Boolean(tx.aiTag)) ||
        (aiFilter === "duplicate" && tx.aiTag?.toLowerCase().includes("duplicate")) ||
        (aiFilter === "unusual" && tx.aiTag?.toLowerCase().includes("unusual"));

      return matchesSearch && matchesCategory && matchesType && matchesAi;
    });
  }, [transactions, searchQuery, categoryFilter, typeFilter, aiFilter]);

  const { totalIncome, totalExpenses, netSavings } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const tx of transactions) {
      if (tx.amount > 0) income += tx.amount;
      else expenses += Math.abs(tx.amount);
    }
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netSavings: income - expenses,
    };
  }, [transactions]);

  const handleExportCsv = () => {
    const headers = ["Date,Description,Category,Amount,Payment Method,AI Notes"];
    const rows = filtered.map(
      (t) =>
        `"${t.date}","${t.description}","${t.category}",${t.amount},"${t.paymentMethod}","${t.aiTag || ""}"`
    );
    const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spendwise-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Transaction History</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Your complete financial log, categorized and analyzed.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button type="button" className="btn btn-teal" onClick={onOpenAddModal}>
            <Plus size={15} />
            <span>Add New Transaction</span>
          </button>
          <button type="button" className="btn btn-outline" onClick={handleExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Summary Bar */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.85rem" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <input
              type="text"
              className="input"
              style={{ width: "100%" }}
              placeholder="Search by merchant, category, or amount..."
              value={searchQuery}
              readOnly
            />
          </div>
          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Total Income (Oct): <strong>${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Total Expenses (Oct): <strong>${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Net Savings (Oct): <strong>${netSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center", fontSize: "0.82rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: 600 }}>
            <SlidersHorizontal size={14} /> Filters
          </span>
          <span className="select" style={{ background: "var(--bg-app)" }}>
            Date Range: Last 30 Days
          </span>
          <select
            className="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category: All Categories</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Cloud Hosting">Cloud Hosting</option>
            <option value="Income">Income</option>
            <option value="Groceries">Groceries</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
          </select>

          <div style={{ display: "inline-flex", border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden" }}>
            {["all", "income", "expense"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: "0.42rem 0.7rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: typeFilter === t ? 700 : 400,
                  background: typeFilter === t ? "#e2e8f0" : "var(--bg-card)",
                  color: "var(--text-main)",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <span style={{ color: "var(--text-muted)", marginLeft: "0.35rem" }}>AI Suggestions:</span>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
            onClick={() => setAiFilter(aiFilter === "review" ? "none" : "review")}
          >
            Needs Review
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
            onClick={() => setAiFilter(aiFilter === "duplicate" ? "none" : "duplicate")}
          >
            Potential Duplicate
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
            onClick={() => setAiFilter(aiFilter === "unusual" ? "none" : "unusual")}
          >
            Unusual Amount
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc", color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
              <th style={{ padding: "0.75rem 1rem" }}>Date ↓</th>
              <th style={{ padding: "0.75rem 1rem" }}>Description</th>
              <th style={{ padding: "0.75rem 1rem" }}>Category</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Amount</th>
              <th style={{ padding: "0.75rem 1rem" }}>Payment Method</th>
              <th style={{ padding: "0.75rem 1rem" }}>AI Notes/Tags</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "0.7rem 1rem", color: "var(--text-muted)" }}>{tx.date}</td>
                <td style={{ padding: "0.7rem 1rem", fontWeight: 600 }}>{tx.description}</td>
                <td style={{ padding: "0.7rem 1rem" }}>{tx.category}</td>
                <td
                  style={{
                    padding: "0.7rem 1rem",
                    textAlign: "right",
                    fontWeight: 700,
                    color: tx.amount > 0 ? "#0d9488" : "var(--text-main)",
                  }}
                >
                  {tx.amount > 0
                    ? `+$${tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : `-$${Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                </td>
                <td style={{ padding: "0.7rem 1rem", color: "var(--text-muted)" }}>{tx.paymentMethod}</td>
                <td style={{ padding: "0.7rem 1rem" }}>
                  {tx.aiTag ? (
                    <span className="badge-ai" style={getTagStyle(tx.aiTagType)}>
                      <Sparkles size={12} /> AI {tx.aiTag}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>-</span>
                  )}
                </td>
                <td style={{ padding: "0.7rem 1rem", textAlign: "right" }}>
                  <button
                    type="button"
                    aria-label="Edit transaction"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginRight: "0.5rem" }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete transaction"
                    onClick={() => onDeleteTransaction(tx.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          <span>Showing 1-{filtered.length} of 150 transactions</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <span className="btn btn-teal" style={{ padding: "0.35rem 0.65rem" }}>
              {page}
            </span>
            <button type="button" className="btn btn-outline" onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}