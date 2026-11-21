import { Search, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TopBar({ searchQuery, onSearchChange, onOpenAddModal, showSearch = true }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.9rem 1.75rem",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--bg-card)",
      }}
    >
      <div style={{ flex: 1, maxWidth: "360px" }}>
        {showSearch && (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "0.75rem", pointerEvents: "none" }}
            />
            <input
              type="text"
              className="input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: "100%", paddingLeft: "2.2rem" }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <button type="button" className="btn btn-teal" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate("/insights")}>
          <Sparkles size={15} color="#7c3aed" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
}