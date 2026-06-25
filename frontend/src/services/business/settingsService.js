/**
 * Settings Management API Service
 * Handles business profile, notification, payment, and currency configurations
 */

import { apiClient, API_ENDPOINTS } from "../api/client";

export const settingsService = {
  // Business Settings
  getBusinessSettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.BUSINESS);
  },

  updateBusinessSettings: async (businessData) => {
    return apiClient.put(API_ENDPOINTS.SETTINGS.BUSINESS, businessData);
  },

  // Notification Settings
  getNotificationSettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.NOTIFICATIONS);
  },

  updateNotificationSettings: async (notificationData) => {
    return apiClient.put(API_ENDPOINTS.SETTINGS.NOTIFICATIONS, notificationData);
  },

  // Payment Settings
  getPaymentSettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.PAYMENT);
  },

  // API Settings
  getApiSettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.API);
  },

  regenerateApiKey: async () => {
    return apiClient.post(API_ENDPOINTS.SETTINGS.REGENERATE_API_KEY);
  },

  // Currency Settings
  getCurrencySettings: async () => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.CURRENCY);
  },

  updateCurrencySettings: async (currencyData) => {
    return apiClient.put(API_ENDPOINTS.SETTINGS.CURRENCY, currencyData);
  },

  getCurrencyHistory: async (params = {}) => {
    return apiClient.get(API_ENDPOINTS.SETTINGS.CURRENCY_HISTORY, { params });
  },

  fetchLatestRates: async () => {
    return apiClient.post(API_ENDPOINTS.SETTINGS.FETCH_LATEST_RATES);
  },

  // Subscription Info
  getSubscriptionInfo: async () => {
    return apiClient.get('/v1/settings/subscription'); // Manually added if missing in endpoints
  },
};

export default settingsService;
