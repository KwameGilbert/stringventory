/**
 * Analytics API Service
 */

import { apiClient, API_ENDPOINTS } from '../api/client';

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

  /**
   * Get activity logs with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.module - Filter by module (optional)
   * @param {string} params.severity - Filter by severity (optional)
   * @param {string} params.userId - Filter by user ID (optional)
   * @param {string} params.startDate - Filter from start date (optional)
   * @param {string} params.endDate - Filter to end date (optional)
   * @returns {Promise} Activity logs with summary and pagination
   */
  getActivityLogs: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };
    return await apiClient.get(API_ENDPOINTS.ANALYTICS.ACTIVITY_LOGS, { params: defaultParams });
  },
};

export default analyticsService;
