/**
 * Analytics API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const analyticsService = {
  /**
   * Get dashboard overview
   */
  getDashboardOverview: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, { params });
  },

  /**
   * Get sales report
   */
  getSalesReport: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.SALES_REPORT, { params });
  },

  /**
   * Get inventory report
   */
  getInventoryReport: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.INVENTORY_REPORT, { params });
  },

  /**
   * Get financial report
   */
  getFinancialReport: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.FINANCIAL_REPORT, { params });
  },

  /**
   * Get customer report
   */
  getCustomerReport: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.CUSTOMER_REPORT, { params });
  },

  /**
   * Get expense report
   */
  getExpenseReport: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.EXPENSE_REPORT, { params });
  },

  /**
   * Export report
   */
  exportReport: async (reportType, params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.EXPORT(reportType), {
      params,
      responseType: 'blob',
    });
  },
};

export default analyticsService;
