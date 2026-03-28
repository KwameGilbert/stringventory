/**
 * Transaction Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const transactionService = {
  /**
   * Get all transactions
   * @param {Object} params - Query parameters (status, type, etc.)
   */
  getTransactions: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.TRANSACTIONS.LIST, { params });
  },

  /**
   * Get transaction by ID
   * @param {string|number} id - Transaction ID
   */
  getTransactionById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.TRANSACTIONS.GET(id));
  },
};

export default transactionService;
