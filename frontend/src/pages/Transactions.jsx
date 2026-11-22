import { useState, useMemo } from "react";
import { Plus, Download, Trash2, SlidersHorizontal, RefreshCw } from "lucide-react";

const ALL_CATEGORIES = [
  "Pocket Money",
  "Salary",
  "Freelancing",
  "Business Income",
  "Other Income",
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Other",
];

function formatAmount(amount, type) {
  const num = Math.abs(Number(amount) || 0);
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === "Income" ? `+Rs ${formatted}` : `-Rs ${formatted}`;
}

export function Transactions({
  transactions = [],
  searchQuery = "",
  onSearchChange,
  onOpenAddModal,
  onDeleteTransaction,
  onRefresh,
  loading,
  error,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const activeSearch = onSearchChange ? searchQuery : localSearch;
  const handleSearch = (val) => {
    if (onSearchChange) onSearchChange(val);
    else setLocalSearch(val);
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filtered = useMemo(() => {
    const q = activeSearch.trim().toLowerCase();
    return safeTransactions.filter((tx) => {
      const matchesSearch =
        !q ||
        (tx.description || "").toLowerCase().includes(q) ||
        (tx.category || "").toLowerCase().includes(q) ||
        (tx.type || "").toLowerCase().includes(q) ||
        String(tx.amount ?? "").toLowerCase().includes(q) ||
        (tx.date || "").toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "All" || tx.category === categoryFilter;
      const matchesType = typeFilter === "All" || tx.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [safeTransactions, activeSearch, categoryFilter, typeFilter]);

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const tx of safeTransactions) {
      const val = Math.abs(Number(tx.amount) || 0);
      if (tx.type === "Income") income += val;
      else if (tx.type === "Expense") expenses += val;
    }
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    };
  }, [safeTransactions]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDeleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ["ID,Date,Type,Category,Description,Amount"];
    const rows = filtered.map(
      (t) =>
        `${t.id},"${t.date || ""}","${t.type || ""}","${t.category || ""}","${(
          t.description || ""
        ).replace(/"/g, '""')}",${Number(t.amount) || 0}`
    );
    const blob = new Blob([[...headers, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Transaction History</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            All income and expense records from your database.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-outline" onClick={onRefresh}>
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
          <button type="button" className="btn btn-teal" onClick={onOpenAddModal}>
            <Plus size={15} />
            <span>Add Transaction</span>
          </button>
          <button type="button" className="btn btn-outline" onClick={handleExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{ borderColor: "#ef4444", color: "#dc2626", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      {/* Summary & Filters Bar */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ flex: 1, minWidth: "240px" }}>
            <input
              type="text"
              className="input"
              style={{ width: "100%" }}
              placeholder="Search by description, category, date, or amount..."
              value={activeSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Total Income:{" "}
            <strong style={{ color: "#0d9488" }}>
              +Rs {totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </strong>
          </div>
          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Total Expenses:{" "}
            <strong>
              -Rs {totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </strong>
          </div>
          <div className="btn btn-outline" style={{ cursor: "default" }}>
            Net Balance:{" "}
            <strong style={{ color: netBalance < 0 ? "#dc2626" : "var(--text-main)" }}>
              {netBalance < 0 ? "-" : ""}Rs
              {Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.65rem",
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: "0.82rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontWeight: 600,
            }}
          >
            <SlidersHorizontal size={14} /> Filters
          </span>

          <select
            className="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category: All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div
            style={{
              display: "inline-flex",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {["All", "Income", "Expense"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: "0.42rem 0.75rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: typeFilter === t ? 700 : 400,
                  background: typeFilter === t ? "#e2e8f0" : "var(--bg-card)",
                  color: "var(--text-main)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading && safeTransactions.length === 0 ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted)" }}>
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "1.5rem", color: "var(--text-muted)" }}>
            No matching transactions found.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border-color)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>Description</th>
                <th style={{ padding: "0.75rem 1rem" }}>Category</th>
                <th style={{ padding: "0.75rem 1rem" }}>Type</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Amount</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "0.7rem 1rem", color: "var(--text-muted)" }}>
                    {tx.date}
                  </td>
                  <td style={{ padding: "0.7rem 1rem", fontWeight: 600 }}>
                    {tx.description || "-"}
                  </td>
                  <td style={{ padding: "0.7rem 1rem" }}>{tx.category}</td>
                  <td style={{ padding: "0.7rem 1rem" }}>{tx.type}</td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      textAlign: "right",
                      fontWeight: 700,
                      color: tx.type === "Income" ? "#0d9488" : "var(--text-main)",
                    }}
                  >
                    {formatAmount(tx.amount, tx.type)}
                  </td>
                  <td style={{ padding: "0.7rem 1rem", textAlign: "right" }}>
                    <button
                      type="button"
                      aria-label={`Delete transaction ${tx.id}`}
                      disabled={deletingId === tx.id}
                      onClick={() => handleDelete(tx.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: deletingId === tx.id ? "not-allowed" : "pointer",
                        color: "#dc2626",
                        opacity: deletingId === tx.id ? 0.5 : 1,
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
          <span>
            Showing {filtered.length} of {safeTransactions.length} transactions
          </span>
        </div>
      </div>
    </div>
  );
}