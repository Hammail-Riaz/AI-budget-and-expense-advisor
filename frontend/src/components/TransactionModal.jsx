import { useState } from "react";
import { X } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Education",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Other",
];

const INCOME_CATEGORIES = [
  "Pocket Money",
  "Salary",
  "Freelancing",
  "Business Income",
  "Other Income",
];

export function TransactionModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = type === "Income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setCategory(nextType === "Income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await onSave({
        amount: Number(amount),
        category,
        type,
        description: description.trim().slice(0, 255),
        date,
      });
      setAmount("");
      setDescription("");
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "430px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3>Add Transaction</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <p style={{ color: "#dc2626", fontSize: "0.82rem", marginBottom: "0.65rem" }}>{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={`btn ${type === "Expense" ? "btn-teal" : "btn-outline"}`}
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => handleTypeChange("Expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${type === "Income" ? "btn-teal" : "btn-outline"}`}
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => handleTypeChange("Income")}
            >
              Income
            </button>
          </div>

          <input
            type="number"
            step="0.01"
            min="0.01"
            className="input"
            placeholder="Amount (greater than 0)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="input"
            placeholder="Description (optional, max 255 chars)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
          />

          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-teal" disabled={submitting}>
              {submitting ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}