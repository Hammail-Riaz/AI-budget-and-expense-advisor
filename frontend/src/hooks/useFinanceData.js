import { useState, useEffect, useCallback } from "react";
import { financeService } from "../services/financeService";

export function useFinanceData() {
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dashData, txData, budgetData] = await Promise.all([
        financeService.getDashboardData(),
        financeService.getTransactions(),
        financeService.getBudgets(),
      ]);
      setDashboard(dashData);
      setTransactions(txData);
      setBudgets(budgetData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const addTransaction = async (newTx) => {
    const isExpense = newTx.type === "expense";
    const signedAmount = isExpense ? -Math.abs(Number(newTx.amount)) : Math.abs(Number(newTx.amount));
    const created = await financeService.createTransaction({
      ...newTx,
      amount: signedAmount,
    });
    setTransactions((prev) => [created, ...prev]);
    return created;
  };

  const removeTransaction = async (id) => {
    await financeService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudget = async (budget) => {
    const created = await financeService.createBudget({
      ...budget,
      limit: Number(budget.limit),
    });
    setBudgets((prev) => [...prev, created]);
    return created;
  };

  const sendAiPrompt = async (prompt) => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await financeService.askAiAssistant(prompt);
      setAiResponse(res.reply);
      return res.reply;
    } finally {
      setAiLoading(false);
    }
  };

  return {
    dashboard,
    transactions,
    budgets,
    loading,
    aiResponse,
    aiLoading,
    addTransaction,
    removeTransaction,
    addBudget,
    sendAiPrompt,
    refresh: loadAll,
  };
}