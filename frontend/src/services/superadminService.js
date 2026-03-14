/**
 * Superadmin API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const superadminService = {
  getBusinesses: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.BUSINESSES.LIST, { params });
  },

  getBusinessById: async (businessId) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.BUSINESSES.GET(businessId));
  },

  createBusiness: async (payload) => {
    return await apiClient.post(API_ENDPOINTS.SUPERADMIN.BUSINESSES.CREATE, payload);
  },

  updateBusiness: async (businessId, payload) => {
    return await apiClient.put(API_ENDPOINTS.SUPERADMIN.BUSINESSES.UPDATE(businessId), payload);
  },

  deleteBusiness: async (businessId) => {
    return await apiClient.delete(API_ENDPOINTS.SUPERADMIN.BUSINESSES.DELETE(businessId));
  },

  suspendBusiness: async (businessId) => {
    return await apiClient.post(API_ENDPOINTS.SUPERADMIN.BUSINESSES.SUSPEND(businessId));
  },

  reactivateBusiness: async (businessId) => {
    return await apiClient.post(API_ENDPOINTS.SUPERADMIN.BUSINESSES.REACTIVATE(businessId));
  },

  getPricingPlans: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.LIST, { params });
  },

  getPlatformAnalytics: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.ANALYTICS.PLATFORM, { params });
  },
};

export default superadminService;
