import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Plus } from "lucide-react";

export function Budgets({ budgets, onCreateBudget }) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !limit) return;
    await onCreateBudget({ name: name.trim(), limit: Number(limit) });
    setName("");
    setLimit("");
    setShowForm(false);
  };

  return (
    <div className="page-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Budgets</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Define your limits, achieve your goals.
          </p>
        </div>
        <button type="button" className="btn btn-teal" onClick={() => setShowForm((s) => !s)}>
          <Plus size={15} />
          <span>Create New Budget</span>
        </button>
      </div>

      <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.85rem" }}>
        Current Budgeting Period: <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>Nov 1 - Nov 30</span>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ display: "flex", gap: "0.65rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            className="input"
            placeholder="Budget category (e.g., Fitness)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Monthly limit ($)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-teal">Save Budget</button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "1rem", alignItems: "start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
            return (
              <div key={b.id} className="card">
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>{b.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ flex: 1, height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: b.color || "#0d9488", borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  ${b.spent} spent of ${b.limit}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Budget Allocation:</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>A visual breakdown</p>
            <div style={{ width: "100%", height: 185 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budgets} dataKey="limit" nameKey="name" innerRadius={46} outerRadius={72}>
                    {budgets.map((entry, i) => (
                      <Cell key={entry.id || i} fill={entry.color || "#0d9488"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "0.98rem", fontWeight: 700, marginBottom: "0.65rem" }}>AI Budget Optimization</h3>
            <ul style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              <li>
                <strong style={{ color: "var(--text-main)" }}>AI Alert:</strong> Dining Out budget is on track to exceed by $45 this month. Consider cooking one more meal this week.
              </li>
              <li>
                <strong style={{ color: "var(--text-main)" }}>AI Suggestion:</strong> You can save $50 by switching to the annual plan for &apos;Netflix&apos; subscription.
              </li>
              <li>
                <strong style={{ color: "var(--text-main)" }}>AI Insight:</strong> You spend 30% more on &apos;Groceries&apos; on weekends. Try planned shopping lists.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}