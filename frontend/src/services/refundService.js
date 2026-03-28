/**
 * Refund Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const refundService = {
  /**
   * Get all refunds
   */
  getRefunds: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.REFUNDS.LIST, { params });
  },

  /**
   * Get refund by ID
   */
  getRefundById: async (refundId) => {
    return await apiClient.get(API_ENDPOINTS.REFUNDS.GET(refundId));
  },

  /**
   * Create new refund request
   */
  createRefund: async (refundData) => {
    return await apiClient.post(API_ENDPOINTS.REFUNDS.CREATE, refundData);
  },

  /**
   * Update refund status (Approve/Reject)
   */
  updateRefundStatus: async (refundId, status) => {
    return await apiClient.put(API_ENDPOINTS.REFUNDS.UPDATE_STATUS(refundId), {
      refundStatus: status,
    });
  },
};

export default refundService;
