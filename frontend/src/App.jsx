import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useFinanceData } from "./hooks/useFinanceData";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { TransactionModal } from "./components/TransactionModal";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { AiInsights } from "./pages/AiInsights";

function SpendWiseWorkspace() {
  const {
    dashboard,
    transactions,
    budgets,
    aiResponse,
    aiLoading,
    addTransaction,
    removeTransaction,
    addBudget,
    sendAiPrompt,
  } = useFinanceData();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                dashboard={dashboard}
                onAskAi={sendAiPrompt}
                aiResponse={aiResponse}
                aiLoading={aiLoading}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <Transactions
                transactions={transactions}
                searchQuery={searchQuery}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onDeleteTransaction={removeTransaction}
              />
            }
          />
          <Route
            path="/budgets"
            element={<Budgets budgets={budgets} onCreateBudget={addBudget} />}
          />
          <Route
            path="/insights"
            element={
              <AiInsights
                onAskAi={sendAiPrompt}
                aiResponse={aiResponse}
                aiLoading={aiLoading}
              />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addTransaction}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SpendWiseWorkspace />
      </BrowserRouter>
    </ThemeProvider>
  );
}