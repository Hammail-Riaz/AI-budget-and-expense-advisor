import { useState, useEffect, useCallback } from "react";
import { financeService } from "../services/financeService";

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const now = new Date();

export function useFinanceData() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analytics, setAnalytics] = useState({
    category_expenses: [],
    monthly_expenses: [],
  });
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [budgetMonth, setBudgetMonth] = useState(now.getMonth() + 1);
  const [budgetYear, setBudgetYear] = useState(now.getFullYear());
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBudget = useCallback(async (month = budgetMonth, year = budgetYear) => {
    setBudgetLoading(true);
    try {
      const res = await financeService.getBudget({ month, year });
      setBudget(res.budget || null);
      return res.budget || null;
    } catch (err) {
      setError(err.message || "Failed to fetch monthly budget");
      throw err;
    } finally {
      setBudgetLoading(false);
    }
  }, [budgetMonth, budgetYear]);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, analyticsRes, txRes, budgetRes] = await Promise.all([
        financeService.getDashboard(),
        financeService.getAnalytics(),
        financeService.getTransactions(),
        financeService.getBudget({ month: budgetMonth, year: budgetYear }),
      ]);

      setDashboardStats(dashRes.dashboard || null);
      setAnalytics({
        category_expenses: analyticsRes.analytics?.category_expenses || [],
        monthly_expenses: (analyticsRes.analytics?.monthly_expenses || []).map((m) => ({
          ...m,
          label: `${MONTH_NAMES[m.month] || m.month} ${m.year}`,
          total: Number(m.total) || 0,
        })),
      });
      setTransactions(Array.isArray(txRes.transactions) ? txRes.transactions : []);
      setBudget(budgetRes.budget || null);
    } catch (err) {
      setError(err.message || "Failed to load data from backend");
    } finally {
      setLoading(false);
    }
  }, [budgetMonth, budgetYear]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const changeBudgetPeriod = async (nextMonth, nextYear) => {
    const m = Number(nextMonth);
    const y = Number(nextYear);
    setBudgetMonth(m);
    setBudgetYear(y);
    await fetchBudget(m, y);
  };

  const saveBudget = async ({ monthly_limit, month = budgetMonth, year = budgetYear }) => {
    setError("");
    setBudgetLoading(true);
    try {
      const res = await financeService.saveBudget({
        monthly_limit: Number(monthly_limit),
        month: Number(month),
        year: Number(year),
      });
      setBudget(res.budget || null);
      await refreshDashboard();
      return res.budget;
    } catch (err) {
      setError(err.message || "Failed to save monthly budget");
      throw err;
    } finally {
      setBudgetLoading(false);
    }
  };

  const addTransaction = async (newTx) => {
    setError("");
    const res = await financeService.createTransaction(newTx);
    await refreshDashboard();
    return res.transaction;
  };

  const removeTransaction = async (id) => {
    setError("");
    try {
      await financeService.deleteTransaction(id);
      await refreshDashboard();
    } catch (err) {
      setError(err.message || "Failed to delete transaction");
      throw err;
    }
  };

  return {
    dashboardStats,
    analytics,
    transactions,
    budget,
    budgetMonth,
    budgetYear,
    budgetLoading,
    loading,
    error,
    refreshDashboard,
    fetchBudget,
    changeBudgetPeriod,
    saveBudget,
    addTransaction,
    removeTransaction,
  };
}