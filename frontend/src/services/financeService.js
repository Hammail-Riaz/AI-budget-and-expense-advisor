import { apiRequest } from "./api";

export const financeService = {
  getDashboard() {
    return apiRequest("/dashboard");
  },

  getAnalytics() {
    return apiRequest("/analytics");
  },

  getTransactions() {
    return apiRequest("/transactions");
  },

  createTransaction(tx) {
    return apiRequest("/transactions", {
      method: "POST",
      body: tx,
    });
  },

  deleteTransaction(id) {
    return apiRequest(`/transactions/${id}`, {
      method: "DELETE",
    });
  },

  getBudget(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/budget${query ? `?${query}` : ""}`);
  },

  saveBudget(budgetData) {
    return apiRequest("/budget", {
      method: "POST",
      body: budgetData,
    });
  },
  getInsights() {
    return apiRequest("/insights");
  },  
};