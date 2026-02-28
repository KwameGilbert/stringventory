/**
 * Purchase Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const purchaseService = {
  getPurchases: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PURCHASES.LIST, { params });
  },

  getPurchaseById: async (purchaseId) => {
    return await apiClient.get(API_ENDPOINTS.PURCHASES.GET(purchaseId));
  },

  createPurchase: async (purchaseData) => {
    return await apiClient.post(API_ENDPOINTS.PURCHASES.CREATE, purchaseData);
  },

  updatePurchase: async (purchaseId, purchaseData) => {
    return await apiClient.put(API_ENDPOINTS.PURCHASES.UPDATE(purchaseId), purchaseData);
  },

  deletePurchase: async (purchaseId) => {
    return await apiClient.delete(API_ENDPOINTS.PURCHASES.DELETE(purchaseId));
  },
};

export default purchaseService;
