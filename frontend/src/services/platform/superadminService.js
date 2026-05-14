/**
 * Superadmin API Service
 * Handles all platform-level API calls using the real backend.
 */

import { apiClient, API_ENDPOINTS } from '../api/client';

export const superadminService = {
  // ─── Businesses ────────────────────────────────────────────────────────────

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

  // ─── Pricing Plans ─────────────────────────────────────────────────────────

  getPricingPlans: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.LIST, { params });
  },

  getPricingPlanById: async (planId) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.GET(planId));
  },

  createPricingPlan: async (payload) => {
    return await apiClient.post(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.CREATE, payload);
  },

  updatePricingPlan: async (planId, payload) => {
    return await apiClient.put(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.UPDATE(planId), payload);
  },

  deletePricingPlan: async (planId) => {
    return await apiClient.delete(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.DELETE(planId));
  },

  // ─── Analytics ─────────────────────────────────────────────────────────────

  getPlatformAnalytics: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.ANALYTICS.PLATFORM, { params });
  },

  getPlanComparison: async () => {
    try {
      return await apiClient.get(API_ENDPOINTS.SUPERADMIN.PRICING_PLANS.COMPARE);
    } catch (error) {
      // Gracefully handle if backend doesn't implement this endpoint yet
      console.warn('[superadminService] getPlanComparison endpoint not available:', error?.message);
      return { data: [] };
    }
  },
  // ─── Settings ──────────────────────────────────────────────────────────────

  getSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SUPERADMIN.SETTINGS.GET);
  },

  updateSettings: async (payload) => {
    return await apiClient.put(API_ENDPOINTS.SUPERADMIN.SETTINGS.UPDATE, payload);
  },
};

export default superadminService;
