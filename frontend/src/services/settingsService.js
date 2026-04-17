/**
 * Settings Management API Service - MOCKED FOR FRONTEND DEV
 */

export const settingsService = {
  // Business Settings
  getBusinessSettings: async () => {
    return Promise.resolve({
      data: {
        name: 'StringVentory Global',
        email: 'support@stringventory.com',
        phone: '+1 234 567 890',
        address: '123 Cloud Avenue, Tech City',
        currency: 'USD',
        timezone: 'UTC'
      }
    });
  },

  updateBusinessSettings: async (businessData) => {
    console.log('Mock: Updating business settings', businessData);
    return Promise.resolve({ data: businessData });
  },

  // Notification Settings
  getNotificationSettings: async () => {
    return Promise.resolve({
      data: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        lowStockAlerts: true,
        subscriptionReminders: true,
        lowStockThreshold: 10,
        expiryAlertDays: 30,
        dashboardRefresh: 5
      }
    });
  },

  updateNotificationSettings: async (notificationData) => {
    console.log('Mock: Updating notification settings', notificationData);
    return Promise.resolve({ data: notificationData });
  },

  // Payment Settings
  getPaymentSettings: async () => {
    return Promise.resolve({
      data: {
        gateway: 'stripe',
        currency: 'USD',
        payoutFrequency: 'weekly',
        autoTax: true
      }
    });
  },

  // API Settings
  getApiSettings: async () => {
    return Promise.resolve({
      data: {
        apiKey: 'sk_test_51MzS2...vF8y',
        webhookUrl: 'https://api.stringventory.com/hooks/v1',
        environment: 'production'
      }
    });
  },

  // Currency Settings
  getCurrencySettings: async () => {
    return Promise.resolve({
      data: {
        currency: 'USD',
        currentCurrency: 'USD',
        rates: {
          GHS: 12.5,
          NGN: 1560.0,
          KES: 132.0,
          ZAR: 18.5
        }
      }
    });
  },

  updateCurrencySettings: async (currencyData) => {
    console.log('Mock: Updating currency settings', currencyData);
    return Promise.resolve({ data: currencyData });
  },

  getCurrencyHistory: async (params = {}) => {
    return Promise.resolve({
      data: [
        { date: '2026-04-10', rate: 12.1 },
        { date: '2026-04-12', rate: 12.3 },
        { date: '2026-04-15', rate: 12.5 }
      ]
    });
  },

  // Subscription Info
  getSubscriptionInfo: async () => {
    return Promise.resolve({
      data: {
        plan: 'Platform Admin',
        status: 'active',
        nextBilling: '2026-05-01',
        usage: {
          businesses: 193,
          users: 1450
        }
      }
    });
  },
};

export default settingsService;
