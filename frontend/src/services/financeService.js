import { apiRequest } from "./apiClient";

export const MOCK_TRANSACTIONS = [
  {
    id: 1,
    date: "Nov 19, 2026",
    description: "Starbucks Coffee",
    category: "Food & Drink",
    amount: -5.5,
    paymentMethod: "Chase Freedom",
    aiTag: "Unusual high spend for this vendor",
    aiTagType: "pink",
    type: "expense",
  },
  {
    id: 2,
    date: "Nov 19, 2026",
    description: "AWS / Amazon Web Services",
    category: "Cloud Hosting",
    amount: -130.5,
    paymentMethod: "Amex Platinum",
    aiTag: "Budget 70% utilized",
    aiTagType: "blue",
    type: "expense",
  },
  {
    id: 3,
    date: "Nov 18, 2026",
    description: "Deposit - Salary",
    category: "Income",
    amount: 4150.0,
    paymentMethod: "Bank of America",
    aiTag: "",
    aiTagType: "",
    type: "income",
  },
  {
    id: 4,
    date: "Nov 18, 2026",
    description: "Whole Foods Market",
    category: "Groceries",
    amount: -98.15,
    paymentMethod: "Chase Freedom",
    aiTag: "",
    aiTagType: "",
    type: "expense",
  },
  {
    id: 5,
    date: "Nov 17, 2026",
    description: "Netflix Subscription",
    category: "Subscriptions",
    amount: -15.49,
    paymentMethod: "Chase Freedom",
    aiTag: "Potential duplicate charge detected",
    aiTagType: "amber",
    type: "expense",
  },
  {
    id: 6,
    date: "Nov 15, 2026",
    description: "Shell Gas Station",
    category: "Transport",
    amount: -62.0,
    paymentMethod: "Amex Platinum",
    aiTag: "",
    aiTagType: "",
    type: "expense",
  },
  {
    id: 7,
    date: "Nov 15, 2026",
    description: "Uber Technologies",
    category: "Transport",
    amount: -24.5,
    paymentMethod: "Chase Freedom",
    aiTag: "",
    aiTagType: "",
    type: "expense",
  },
  {
    id: 8,
    date: "Nov 14, 2026",
    description: "Rent Payment",
    category: "Housing",
    amount: -1200.0,
    paymentMethod: "Bank of America",
    aiTag: "",
    aiTagType: "",
    type: "expense",
  },
  {
    id: 9,
    date: "Nov 14, 2026",
    description: "Spotify Subscription",
    category: "Subscriptions",
    amount: -9.99,
    paymentMethod: "Amex Platinum",
    aiTag: "",
    aiTagType: "",
    type: "expense",
  },
];

export const MOCK_BUDGETS = [
  { id: 1, name: "Dining & Food", spent: 425, limit: 500, color: "#ef4444" },
  { id: 2, name: "Travel & Transport", spent: 300, limit: 500, color: "#eab308" },
  { id: 3, name: "Subscriptions & Services", spent: 120, limit: 600, color: "#10b981" },
  { id: 4, name: "Groceries & Household", spent: 240, limit: 600, color: "#3b82f6" },
];

export const financeService = {
  async getDashboardData() {
    try {
      return await apiRequest("/dashboard");
    } catch {
      return {
        userName: "Alex",
        totalSpentMonth: 1420.5,
        spentDeltaPercent: 3.4,
        currentBudget: 3500.0,
        budgetUtilizedPercent: 40.5,
        savingsTip:
          "AI Advisory: You're spending 14% more on 'Dining Out' this week. Opt for home cooking this weekend to save $45!",
        monthlyTrend: [
          { day: "1", food: 320, utilities: 180, subscription: 110, transport: 90, forecast: null },
          { day: "4", food: 690, utilities: 310, subscription: 150, transport: 210, forecast: null },
          { day: "8", food: 660, utilities: 390, subscription: 170, transport: 240, forecast: null },
          { day: "12", food: 840, utilities: 460, subscription: 220, transport: 280, forecast: null },
          { day: "14", food: 610, utilities: 520, subscription: 240, transport: 310, forecast: 610 },
          { day: "18", food: null, utilities: null, subscription: null, transport: null, forecast: 730 },
          { day: "22", food: null, utilities: null, subscription: null, transport: null, forecast: 640 },
          { day: "26", food: null, utilities: null, subscription: null, transport: null, forecast: 510 },
          { day: "30", food: null, utilities: null, subscription: null, transport: null, forecast: 380 },
        ],
        expenseBreakdown: [
          { name: "Housing", value: 42, color: "#0f172a" },
          { name: "Food", value: 18, color: "#0d9488" },
          { name: "Utilities", value: 12, color: "#3b82f6" },
          { name: "Leisure", value: 15, color: "#6366f1" },
          { name: "Tech", value: 13, color: "#8b5cf6" },
        ],
        recentTransactions: [
          { id: "r1", description: "Starbucks", category: "Food & Drink", date: "Nov 19, 2026", amount: 120.5 },
          { id: "r2", description: "AWS", category: "Cloud Hosting", date: "Nov 19, 2026", amount: 85.0 },
          { id: "r3", description: "Airtel", category: "Utility", date: "Nov 9, 2026", amount: 30.0 },
        ],
      };
    }
  },

  async getTransactions() {
    try {
      const res = await apiRequest("/transactions");
      return res.transactions || res;
    } catch {
      return MOCK_TRANSACTIONS;
    }
  },

  async createTransaction(tx) {
    try {
      const res = await apiRequest("/transactions", { method: "POST", body: tx });
      return res.transaction || res;
    } catch {
      return {
        ...tx,
        id: Date.now(),
        date: tx.date || "Nov 19, 2026",
        aiTag: tx.amount < -100 ? "Budget 70% utilized" : "",
        aiTagType: tx.amount < -100 ? "blue" : "",
      };
    }
  },

  async deleteTransaction(id) {
    try {
      await apiRequest(`/transactions/${id}`, { method: "DELETE" });
    } catch {
      // Handled optimistically in state when backend is offline
    }
  },

  async getBudgets() {
    try {
      const res = await apiRequest("/budgets");
      return res.budgets || res;
    } catch {
      return MOCK_BUDGETS;
    }
  },

  async createBudget(budget) {
    try {
      const res = await apiRequest("/budgets", { method: "POST", body: budget });
      return res.budget || res;
    } catch {
      return { ...budget, id: Date.now(), spent: 0, color: "#0d9488" };
    }
  },

  async askAiAssistant(prompt) {
    try {
      return await apiRequest("/ai/chat", { method: "POST", body: { prompt } });
    } catch {
      return {
        reply: `To save $200 by next month based on "${prompt}", trim Dining Out by 20% (~$85), switch recurring media subscriptions to annual billing (~$50), and cap weekend grocery overruns (~$65).`,
      };
    }
  },
};