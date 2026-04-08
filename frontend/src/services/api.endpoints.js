/**
 * API Endpoints Configuration
 * Centralized endpoint paths for all API calls
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stringventory-api.onrender.com';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/v1/auth/register',
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    REFRESH_TOKEN: '/v1/auth/refresh',
    FORGOT_PASSWORD: '/v1/auth/password/forgot',
    RESET_PASSWORD: '/v1/auth/password/reset',
    VERIFY_EMAIL: (email, token) =>
      `/v1/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
  },

  // User Management
  USERS: {
    LIST: '/v1/users',
    GET: (id) => `/v1/users/${id}`,
    CREATE: '/v1/users',
    UPDATE: (id) => `/v1/users/${id}`,
    DELETE: (id) => `/v1/users/${id}`,
    RESEND_VERIFICATION: (id) => `/v1/users/${id}/resend-verification`,
    RESET_PASSWORD: (id) => `/v1/auth/password/change`,
  },

  // Roles
  ROLES: {
    LIST: '/v1/roles',
    GET: (id) => `/v1/roles/${id}`,
  },

  // Products
  PRODUCTS: {
    LIST: '/v1/products',
    GET: (id) => `/v1/products/${id}`,
    CREATE: '/v1/products',
    UPDATE: (id) => `/v1/products/${id}`,
    DELETE: (id) => `/v1/products/${id}`,
    LOW_STOCK: '/v1/products/low-stock',
    EXPIRING: '/v1/products/expiring',
  },

  // Unit of Measurements
  UNIT_OF_MEASUREMENTS: {
    LIST: '/v1/units-of-measure',
  },

  // Categories
  CATEGORIES: {
    LIST: '/v1/categories',
    GET: (id) => `/v1/categories/${id}`,
    CREATE: '/v1/categories',
    UPDATE: (id) => `/v1/categories/${id}`,
    DELETE: (id) => `/v1/categories/${id}`,
  },

  // Inventory
  INVENTORY: {
    LIST: '/v1/inventory',
    GET_BY_PRODUCT: (productId) => `/v1/inventory/product/${productId}`,
    CREATE: '/v1/inventory',
    ADD: '/inventory/add',
    UPDATE: (id) => `/v1/inventory/${id}`,
    ADJUST: '/v1/inventory/adjust',
    TRANSFER: '/v1/inventory/transfer',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/v1/customers',
    GET: (id) => `/v1/customers/${id}`,
    CREATE: '/v1/customers',
    UPDATE: (id) => `/v1/customers/${id}`,
    DELETE: (id) => `/v1/customers/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: '/v1/orders',
    GET: (id) => `/v1/orders/${id}`,
    CREATE: '/v1/orders',
    UPDATE: (id) => `/v1/orders/${id}`,
    DELETE: (id) => `/v1/orders/${id}`,
    CREATE_REFUND: (id) => `/v1/orders/${id}/refunds`,
    FULFILL: (id) => `/v1/orders/${id}/fulfill`,
  },

  // Refunds
  REFUNDS: {
    LIST: '/v1/refunds',
    GET: (id) => `/v1/refunds/${id}`,
    CREATE: '/v1/refunds',
    UPDATE_STATUS: (id) => `/v1/refunds/${id}/status`,
  },

  // Transactions
  TRANSACTIONS: {
    LIST: '/v1/transactions',
    GET: (id) => `/v1/transactions/${id}`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/v1/suppliers',
    GET: (id) => `/v1/suppliers/${id}`,
    CREATE: '/v1/suppliers',
    UPDATE: (id) => `/v1/suppliers/${id}`,
    DELETE: (id) => `/v1/suppliers/${id}`,
  },

  // Purchases
  PURCHASES: {
    LIST: '/v1/purchases',
    GET: (id) => `/v1/purchases/${id}`,
    CREATE: '/v1/purchases',
    UPDATE: (id) => `/v1/purchases/${id}`,
    DELETE: (id) => `/v1/purchases/${id}`,
    APPROVE: (id) => `/v1/purchases/${id}/approve`,
  },

  // Expenses
  EXPENSES: {
    LIST: '/v1/expenses',
    GET: (id) => `/v1/expenses/${id}`,
    CREATE: '/v1/expenses',
    UPDATE: (id) => `/v1/expenses/${id}`,
    DELETE: (id) => `/v1/expenses/${id}`,
    CATEGORIES: '/v1/expense-categories',
    CREATE_CATEGORY: '/v1/expense-categories',
    UPDATE_CATEGORY: (id) => `/v1/expense-categories/${id}`,
    DELETE_CATEGORY: (id) => `/v1/expense-categories/${id}`,
  },

  // Sales
  SALES: {
    LIST: '/sales',
    GET: (id) => `/sales/${id}`,
    CREATE: '/sales',
    UPDATE: (id) => `/sales/${id}`,
    DELETE: (id) => `/sales/${id}`,
  },

  // Reports & Analytics
  ANALYTICS: {
    DASHBOARD: '/v1/analytics/dashboard',
    SALES_REPORT: '/v1/analytics/sales-report',
    INVENTORY_REPORT: '/v1/analytics/inventory-report',
    FINANCIAL_REPORT: '/v1/analytics/financial-report',
    CUSTOMER_REPORT: '/v1/analytics/customer-report',
    EXPENSE_REPORT: '/v1/analytics/expense-report',
    EXPORT: (type) => `/v1/analytics/export/${type}`,
  },

  // Messaging
  MESSAGING: {
    MESSAGES_LIST: '/v1/messaging/messages',
    MESSAGE_GET: (id) => `/v1/messaging/messages/${id}`,
    MESSAGE_SEND: '/v1/messaging/messages',
    BULK_SEND: '/v1/messaging/bulk-messages',
    TEMPLATES: '/v1/messaging/templates',
    CREATE_TEMPLATE: '/v1/messaging/templates',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/v1/notifications',
    MARK_AS_READ: (id) => `/v1/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/v1/notifications/read-all',
    DELETE: (id) => `/v1/notifications/${id}`,
  },

  // Settings
  SETTINGS: {
    BUSINESS: '/v1/settings/business',
    NOTIFICATIONS: '/v1/settings/notifications',
    PAYMENT: '/v1/settings/payment',
    CURRENCY: '/v1/settings/currency',
    CURRENCY_HISTORY: '/v1/settings/currency/history',
    FETCH_LATEST_RATES: '/v1/settings/currency/fetch-rates',
    API: '/v1/settings/api',
    REGENERATE_API_KEY: '/v1/settings/api/regenerate-key',
  },

  // Superadmin - Businesses
  SUPERADMIN: {
    BUSINESSES: {
      LIST: '/superadmin/businesses',
      GET: (id) => `/superadmin/businesses/${id}`,
      CREATE: '/superadmin/businesses',
      UPDATE: (id) => `/superadmin/businesses/${id}`,
      DELETE: (id) => `/superadmin/businesses/${id}`,
      SUSPEND: (id) => `/superadmin/businesses/${id}/suspend`,
      REACTIVATE: (id) => `/superadmin/businesses/${id}/reactivate`,
    },
    PRICING_PLANS: {
      LIST: '/superadmin/pricing-plans',
      GET: (id) => `/superadmin/pricing-plans/${id}`,
      CREATE: '/superadmin/pricing-plans',
      UPDATE: (id) => `/superadmin/pricing-plans/${id}`,
      DELETE: (id) => `/superadmin/pricing-plans/${id}`,
    },
    ANALYTICS: {
      PLATFORM: '/superadmin/analytics/platform',
    },
  },
};

export { BASE_URL };
