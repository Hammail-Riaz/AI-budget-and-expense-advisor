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
    dashboardStats,
    transactions,
    budget,
    budgetMonth,
    budgetYear,
    budgetLoading,
    changeBudgetPeriod,
    saveBudget,
    aiResponse,
    aiLoading,
    addTransaction,
    removeTransaction,
    refreshDashboard,
    loading,
    error,
    sendAiPrompt,
    analytics
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
                dashboardStats={dashboardStats}
                analytics={analytics}
                transactions={transactions}
                loading={loading}
                error={error}
                onRefresh={refreshDashboard}
              />
            }
          />
          <Route
            path="/transactions"
            element={
            <Transactions
              transactions={transactions}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteTransaction={removeTransaction}
              onRefresh={refreshDashboard}
              loading={loading}
              error={error}
              />
                    }
            />
          <Route
            path="/budgets"
            element={
              <Budgets
                budget={budget}
                budgetMonth={budgetMonth}
                budgetYear={budgetYear}
                dashboardStats={dashboardStats}
                budgetLoading={budgetLoading}
                error={error}
                onChangePeriod={changeBudgetPeriod}
                onSaveBudget={saveBudget}
                onRefresh={refreshDashboard}
              />
            }
          />
          <Route path="/insights" element={<AiInsights />} />
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