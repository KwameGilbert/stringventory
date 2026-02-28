/**
 * API Endpoints Configuration
 * Centralized endpoint paths for all API calls
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stringventory.onrender.com/v1/';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // User Management
  USERS: {
    LIST: '/admin/users',
    GET: (id) => `/admin/users/${id}`,
    CREATE: '/admin/users',
    UPDATE: (id) => `/admin/users/${id}`,
    DELETE: (id) => `/admin/users/${id}`,
    RESEND_VERIFICATION: (id) => `/admin/users/${id}/resend-verification`,
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    LOW_STOCK: '/products/low-stock',
    EXPIRING: '/products/expiring',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: (id) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },

  // Inventory
  INVENTORY: {
    LIST: '/inventory',
    GET_BY_PRODUCT: (productId) => `/inventory/product/${productId}`,
    ADD: '/inventory/add',
    ADJUST: '/inventory/adjust',
    TRANSFER: '/inventory/transfer',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    GET: (id) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id) => `/customers/${id}`,
    DELETE: (id) => `/customers/${id}`,
    ORDERS: (id) => `/customers/${id}/orders`,
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    GET: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id) => `/orders/${id}`,
    DELETE: (id) => `/orders/${id}`,
    CREATE_REFUND: (id) => `/orders/${id}/refund`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/suppliers',
    GET: (id) => `/suppliers/${id}`,
    CREATE: '/suppliers',
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
  },

  // Purchases
  PURCHASES: {
    LIST: '/purchases',
    GET: (id) => `/purchases/${id}`,
    CREATE: '/purchases',
    UPDATE: (id) => `/purchases/${id}`,
    DELETE: (id) => `/purchases/${id}`,
  },

  // Expenses
  EXPENSES: {
    LIST: '/expenses',
    GET: (id) => `/expenses/${id}`,
    CREATE: '/expenses',
    UPDATE: (id) => `/expenses/${id}`,
    DELETE: (id) => `/expenses/${id}`,
    CATEGORIES: '/expense-categories',
    CREATE_CATEGORY: '/expense-categories',
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
    DASHBOARD: '/analytics/dashboard',
    SALES_REPORT: '/analytics/sales-report',
    INVENTORY_REPORT: '/analytics/inventory-report',
    FINANCIAL_REPORT: '/analytics/financial-report',
    CUSTOMER_REPORT: '/analytics/customer-report',
    EXPENSE_REPORT: '/analytics/expense-report',
    EXPORT: (type) => `/analytics/export/${type}`,
  },

  // Messaging
  MESSAGING: {
    MESSAGES_LIST: '/messaging/messages',
    MESSAGE_GET: (id) => `/messaging/messages/${id}`,
    MESSAGE_SEND: '/messaging/messages',
    BULK_SEND: '/messaging/bulk-messages',
    TEMPLATES: '/messaging/templates',
    CREATE_TEMPLATE: '/messaging/templates',
  },

  // Settings
  SETTINGS: {
    BUSINESS: '/settings/business',
    NOTIFICATIONS: '/settings/notifications',
    PAYMENT: '/settings/payment',
    API: '/settings/api',
    REGENERATE_API_KEY: '/settings/api/regenerate-key',
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
