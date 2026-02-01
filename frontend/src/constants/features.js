// Feature flags mapped to UI components and routes
export const FEATURES = {
  // Core modules
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  
  // Advanced features
  USERS: 'users',
  SETTINGS: 'settings',
  MULTI_LOCATION: 'multi_location',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  ADVANCED_REPORTS: 'advanced_reports',
  API_ACCESS: 'api_access',
  BULK_OPERATIONS: 'bulk_operations',
  
  // Enterprise features
  CUSTOM_BRANDING: 'custom_branding',
  CUSTOM_REPORTS: 'custom_reports',
  WEBHOOKS: 'webhooks',
  AUDIT_LOGS: 'audit_logs',
  DATA_EXPORT_API: 'data_export_api',
  
  // Report types
  BASIC_REPORTS: 'basic_reports',
  STANDARD_REPORTS: 'standard_reports'
};

// Map features to minimum required plan
export const FEATURE_PLAN_MAPPING = {
  [FEATURES.DASHBOARD]: 'free_trial',
  [FEATURES.PRODUCTS]: 'free_trial',
  [FEATURES.ORDERS]: 'free_trial',
  [FEATURES.CUSTOMERS]: 'free_trial',
  [FEATURES.INVENTORY]: 'free_trial',
  [FEATURES.BASIC_REPORTS]: 'free_trial',
  
  [FEATURES.SUPPLIERS]: 'starter',
  [FEATURES.PURCHASES]: 'starter',
  [FEATURES.EXPENSES]: 'starter',
  [FEATURES.CATEGORIES]: 'starter',
  [FEATURES.STANDARD_REPORTS]: 'starter',
  
  [FEATURES.USERS]: 'professional',
  [FEATURES.SETTINGS]: 'professional',
  [FEATURES.MULTI_LOCATION]: 'professional',
  [FEATURES.ADVANCED_ANALYTICS]: 'professional',
  [FEATURES.ADVANCED_REPORTS]: 'professional',
  [FEATURES.API_ACCESS]: 'professional',
  [FEATURES.BULK_OPERATIONS]: 'professional',
  
  [FEATURES.CUSTOM_BRANDING]: 'enterprise',
  [FEATURES.CUSTOM_REPORTS]: 'enterprise',
  [FEATURES.WEBHOOKS]: 'enterprise',
  [FEATURES.AUDIT_LOGS]: 'enterprise',
  [FEATURES.DATA_EXPORT_API]: 'enterprise'
};

// User roles for platform and businesses
export const USER_ROLES = {
  // Platform level
  SUPERADMIN: 'superadmin',
  
  // Business level
  BUSINESS_ADMIN: 'business_admin',
  MANAGER: 'manager',
  SALES: 'sales',
  WAREHOUSE: 'warehouse',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer'
};

// Default role definitions with permissions
export const DEFAULT_ROLES = [
  {
    id: 'business_admin',
    name: 'Business Admin',
    description: 'Full access to all business features',
    level: 'business',
    permissions: ['*'], // All permissions
    isDefault: true,
    isSystemRole: true
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manager with access to most features',
    level: 'business',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PRODUCTS', 'MANAGE_PRODUCTS',
      'VIEW_ORDERS', 'MANAGE_ORDERS',
      'VIEW_INVENTORY', 'MANAGE_INVENTORY',
      'VIEW_CUSTOMERS', 'MANAGE_CUSTOMERS',
      'VIEW_SUPPLIERS', 'MANAGE_SUPPLIERS',
      'VIEW_PURCHASES', 'MANAGE_PURCHASES',
      'VIEW_EXPENSES', 'MANAGE_EXPENSES',
      'VIEW_REPORTS',
      'VIEW_MESSAGING'
    ],
    isDefault: true,
    isSystemRole: true
  },
  {
    id: 'sales',
    name: 'Sales Person',
    description: 'Focused on sales and customer management',
    level: 'business',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PRODUCTS',
      'VIEW_ORDERS', 'MANAGE_ORDERS',
      'VIEW_CUSTOMERS', 'MANAGE_CUSTOMERS',
      'VIEW_INVENTORY',
      'VIEW_MESSAGING'
    ],
    isDefault: true,
    isSystemRole: true
  },
  {
    id: 'warehouse',
    name: 'Warehouse Manager',
    description: 'Manages inventory, products, and purchases',
    level: 'business',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PRODUCTS', 'MANAGE_PRODUCTS',
      'VIEW_INVENTORY', 'MANAGE_INVENTORY',
      'VIEW_SUPPLIERS',
      'VIEW_PURCHASES', 'MANAGE_PURCHASES',
      'VIEW_REPORTS'
    ],
    isDefault: true,
    isSystemRole: true
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Manages finances, expenses, and reports',
    level: 'business',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_ORDERS',
      'VIEW_EXPENSES', 'MANAGE_EXPENSES',
      'VIEW_PURCHASES',
      'VIEW_REPORTS',
      'VIEW_CUSTOMERS'
    ],
    isDefault: true,
    isSystemRole: true
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to reports and data',
    level: 'business',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PRODUCTS',
      'VIEW_ORDERS',
      'VIEW_INVENTORY',
      'VIEW_CUSTOMERS',
      'VIEW_SUPPLIERS',
      'VIEW_PURCHASES',
      'VIEW_EXPENSES',
      'VIEW_REPORTS'
    ],
    isDefault: true,
    isSystemRole: true
  }
];

// Business status
export const BUSINESS_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
  PENDING: 'pending'
};

// Subscription status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};
