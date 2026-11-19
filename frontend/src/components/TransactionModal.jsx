import { useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  "Food & Drink",
  "Cloud Hosting",
  "Groceries",
  "Subscriptions",
  "Transport",
  "Housing",
  "Income",
];

export function TransactionModal({ isOpen, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Drink");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [paymentMethod, setPaymentMethod] = useState("Chase Freedom");
  const [date, setDate] = useState("Nov 19, 2026");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    await onSave({
      description: description.trim(),
      category,
      amount: Number(amount),
      type,
      paymentMethod,
      date,
    });
    setDescription("");
    setAmount("");
    onClose();
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={`btn ${type === "expense" ? "btn-teal" : "btn-outline"}`}
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`btn ${type === "income" ? "btn-teal" : "btn-outline"}`}
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>

          <input
            type="text"
            className="input"
            placeholder="Description (e.g., Starbucks Coffee)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            min="0.01"
            className="input"
            placeholder="Amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="input"
            placeholder="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <input
            type="text"
            className="input"
            placeholder="Date (e.g., Nov 19, 2026)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-teal">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}