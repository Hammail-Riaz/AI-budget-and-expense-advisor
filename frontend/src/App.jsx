import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useFinanceData } from "./hooks/useFinanceData";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { TransactionModal } from "./components/TransactionModal";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { AiInsights } from "./pages/AiInsights";
import {LandingHome}from "./pages/LandingHome";

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

  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const goToLanding = () => {
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLandingPage) {
    return (
      <LandingHome
        onOpenLogin={goToDashboard}
        onOpenSignup={goToDashboard}
        onTryDemo={goToDashboard}
      />
    );
  }

  return (
      <div className="app-shell flex min-h-screen">
        <Sidebar onGoHome={goToLanding} />
        <div className="main-area">
          <TopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
          <main className="flex-1">
            <Routes>
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
          </Routes>
        </main>
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