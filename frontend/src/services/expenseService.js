/**
 * Expense Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const expenseService = {
  getExpenses: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.EXPENSES.LIST, { params });
  },

  getExpenseById: async (expenseId) => {
    return await apiClient.get(API_ENDPOINTS.EXPENSES.GET(expenseId));
  },

  createExpense: async (expenseData) => {
    return await apiClient.post(API_ENDPOINTS.EXPENSES.CREATE, expenseData);
  },

  updateExpense: async (expenseId, expenseData) => {
    return await apiClient.put(API_ENDPOINTS.EXPENSES.UPDATE(expenseId), expenseData);
  },

  deleteExpense: async (expenseId) => {
    return await apiClient.delete(API_ENDPOINTS.EXPENSES.DELETE(expenseId));
  },

  getExpenseCategories: async () => {
    return await apiClient.get(API_ENDPOINTS.EXPENSES.CATEGORIES);
  },

  createExpenseCategory: async (categoryData) => {
    return await apiClient.post(API_ENDPOINTS.EXPENSES.CREATE_CATEGORY, categoryData);
  },

  updateExpenseCategory: async (categoryId, categoryData) => {
    return await apiClient.put(`/expense-categories/${categoryId}`, categoryData);
  },

  deleteExpenseCategory: async (categoryId) => {
    return await apiClient.delete(`/expense-categories/${categoryId}`);
  },

  getPaymentSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SETTINGS.PAYMENT);
  },
};

export default expenseService;
