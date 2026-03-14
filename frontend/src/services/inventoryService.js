/**
 * Inventory Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const inventoryService = {
  getInventory: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.INVENTORY.LIST, { params });
  },

  getInventoryByProduct: async (productId) => {
    return await apiClient.get(API_ENDPOINTS.INVENTORY.GET_BY_PRODUCT(productId));
  },

  addInventory: async (inventoryData) => {
    return await apiClient.post(API_ENDPOINTS.INVENTORY.ADD, inventoryData);
  },

  adjustInventory: async (adjustmentData) => {
    return await apiClient.post(API_ENDPOINTS.INVENTORY.ADJUST, adjustmentData);
  },

  transferInventory: async (transferData) => {
    return await apiClient.post(API_ENDPOINTS.INVENTORY.TRANSFER, transferData);
  },
};

export default inventoryService;
