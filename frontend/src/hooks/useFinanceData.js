import { useState, useEffect, useCallback, useRef } from "react";
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

function computeDashboardStats(txList = [], budgetObj = null) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const tx of txList) {
    if (!tx?.date) continue;
    const [yStr, mStr] = String(tx.date).split("-");
    const txYear = Number(yStr);
    const txMonth = Number(mStr);
    const amount = Math.abs(Number(tx.amount) || 0);

    if (txYear === currentYear && txMonth === currentMonth) {
      if (tx.type === "Income") totalIncome += amount;
      else if (tx.type === "Expense") totalExpenses += amount;
    }
  }

  const balance = totalIncome - totalExpenses;
  const hasBudget =
    budgetObj?.monthly_limit !== undefined && budgetObj?.monthly_limit !== null;
  const monthlyBudget = hasBudget ? Number(budgetObj.monthly_limit) : null;
  const remainingBudget =
    monthlyBudget !== null ? monthlyBudget - totalExpenses : null;

  return {
    period: { month: currentMonth, year: currentYear },
    total_income: totalIncome.toFixed(2),
    total_expenses: totalExpenses.toFixed(2),
    balance: balance.toFixed(2),
    monthly_budget: monthlyBudget !== null ? monthlyBudget.toFixed(2) : null,
    remaining_budget:
      remainingBudget !== null ? remainingBudget.toFixed(2) : null,
  };
}

export function useFinanceData() {
  const initialNow = new Date();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analytics, setAnalytics] = useState({
    category_expenses: [],
    monthly_expenses: [],
  });
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [budgetMonth, setBudgetMonth] = useState(initialNow.getMonth() + 1);
  const [budgetYear, setBudgetYear] = useState(initialNow.getFullYear());
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const transactionsRef = useRef([]);
  const budgetRef = useRef(null);
  transactionsRef.current = transactions;
  budgetRef.current = budget;

  const fetchBudget = useCallback(async (month, year) => {
    setBudgetLoading(true);
    try {
      const res = await financeService.getBudget({ month, year });
      const nextBudget = res.budget || null;
      setBudget(nextBudget);
      return nextBudget;
    } catch (err) {
      setError(err.message || "Failed to fetch monthly budget");
      return null;
    } finally {
      setBudgetLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const [analyticsSettled, txSettled, budgetSettled] = await Promise.allSettled([
      financeService.getAnalytics(),
      financeService.getTransactions(),
      financeService.getBudget({ month: budgetMonth, year: budgetYear }),
    ]);

    const errors = [];

    let txList = transactionsRef.current;
    if (txSettled.status === "fulfilled") {
      const res = txSettled.value;
      txList = Array.isArray(res?.transactions)
        ? res.transactions
        : Array.isArray(res?.data?.transactions)
        ? res.data.transactions
        : Array.isArray(res)
        ? res
        : [];
      setTransactions(txList);
    } else {
      errors.push(txSettled.reason?.message || "Failed to load transactions");
    }

    if (analyticsSettled.status === "fulfilled") {
      const res = analyticsSettled.value;
      const payload = res?.analytics || res?.data?.analytics || res || {};
      setAnalytics({
        category_expenses: Array.isArray(payload.category_expenses)
          ? payload.category_expenses
          : [],
        monthly_expenses: Array.isArray(payload.monthly_expenses)
          ? payload.monthly_expenses.map((m) => ({
              ...m,
              label: `${MONTH_NAMES[m.month] || m.month} ${m.year}`,
              total: Number(m.total) || 0,
            }))
          : [],
      });
    } else {
      errors.push(analyticsSettled.reason?.message || "Failed to load analytics");
    }

    let nextBudget = budgetRef.current;
    if (budgetSettled.status === "fulfilled") {
      const res = budgetSettled.value;
      nextBudget = res?.budget || res?.data?.budget || null;
      setBudget(nextBudget);
    }

    setDashboardStats(computeDashboardStats(txList, nextBudget));

    if (errors.length > 0) {
      setError(errors.join(" • "));
    }

    setLoading(false);
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
      const saved = res?.budget || res?.data?.budget || null;
      setBudget(saved);
      await refreshDashboard();
      return saved;
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
    return res?.transaction || res?.data?.transaction || res;
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