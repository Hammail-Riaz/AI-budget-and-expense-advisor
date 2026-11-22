import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

export function AiInsights({ onAskAi, aiResponse, aiLoading }) {
  const [question, setQuestion] = useState("How can I save Rs 200 by next month?");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAskAi(question);
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: "1.1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>AI Insights</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Personalized spending diagnostics, savings opportunities, and conversational financial advice.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.65rem" }}>
          <Sparkles size={18} color="#0d9488" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Ask SpendWise AI</h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.9rem" }}>
          <input
            type="text"
            className="input"
            style={{ flex: 1 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn btn-teal" disabled={aiLoading}>
            <Send size={15} />
            <span>{aiLoading ? "Analyzing..." : "Ask AI"}</span>
          </button>
        </form>

        <div
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "8px",
            background: "var(--bg-app)",
            fontSize: "0.88rem",
          }}
        >
          {aiResponse ||
            "Ask a question about your monthly spending, duplicate subscriptions, or budget targets to get tailored recommendations."}
        </div>
      </div>
    </div>
  );
}