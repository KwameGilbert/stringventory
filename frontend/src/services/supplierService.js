/**
 * Supplier Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const supplierService = {
  getSuppliers: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPPLIERS.LIST, { params });
  },

  getSupplierById: async (supplierId) => {
    return await apiClient.get(API_ENDPOINTS.SUPPLIERS.GET(supplierId));
  },

  createSupplier: async (supplierData) => {
    return await apiClient.post(API_ENDPOINTS.SUPPLIERS.CREATE, supplierData);
  },

  updateSupplier: async (supplierId, supplierData) => {
    return await apiClient.put(API_ENDPOINTS.SUPPLIERS.UPDATE(supplierId), supplierData);
  },

  deleteSupplier: async (supplierId) => {
    return await apiClient.delete(API_ENDPOINTS.SUPPLIERS.DELETE(supplierId));
  },
};

export default supplierService;
