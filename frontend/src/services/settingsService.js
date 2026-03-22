/**
 * Settings Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const settingsService = {
  // Business Settings
  getBusinessSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SETTINGS.BUSINESS);
  },

  updateBusinessSettings: async (businessData) => {
    return await apiClient.put(API_ENDPOINTS.SETTINGS.BUSINESS, businessData);
  },

  // Notification Settings
  getNotificationSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SETTINGS.NOTIFICATIONS);
  },

  updateNotificationSettings: async (notificationData) => {
    return await apiClient.put(API_ENDPOINTS.SETTINGS.NOTIFICATIONS, notificationData);
  },

  // Payment Settings
  getPaymentSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SETTINGS.PAYMENT);
  },

  updatePaymentSettings: async (paymentData) => {
    return await apiClient.put(API_ENDPOINTS.SETTINGS.PAYMENT, paymentData);
  },

  // API Settings
  getApiSettings: async () => {
    return await apiClient.get(API_ENDPOINTS.SETTINGS.API);
  },

  regenerateApiKey: async () => {
    return await apiClient.post(API_ENDPOINTS.SETTINGS.REGENERATE_API_KEY);
  },

  // Security/Password
  changePassword: async (currentPassword, newPassword) => {
    return await apiClient.post('/v1/auth/password/change', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  // MFA/2FA
  enableMFA: async (phoneNumber) => {
    return await apiClient.post('/v1/auth/mfa/enable', {
      phoneNumber,
    });
  },

  disableMFA: async () => {
    return await apiClient.post('/v1/auth/mfa/disable');
  },

  // Subscription
  getSubscriptionInfo: async () => {
    return await apiClient.get('/v1/subscription');
  },

  getPricingPlans: async () => {
    return await apiClient.get('/v1/pricing-plans');
  },

  upgradePlan: async (planId) => {
    return await apiClient.post('/v1/subscription/upgrade', { planId });
  },

  // Billing & Payments
  getBillingHistory: async (params = {}) => {
    return await apiClient.get('/v1/billing/history', { params });
  },

  getPaymentMethods: async () => {
    return await apiClient.get('/v1/payment-methods');
  },

  addPaymentMethod: async (cardData) => {
    return await apiClient.post('/v1/payment-methods', cardData);
  },

  deletePaymentMethod: async (methodId) => {
    return await apiClient.delete(`/v1/payment-methods/${methodId}`);
  },

  setDefaultPaymentMethod: async (methodId) => {
    return await apiClient.put(`/v1/payment-methods/${methodId}/default`);
  },
};

export default settingsService;
