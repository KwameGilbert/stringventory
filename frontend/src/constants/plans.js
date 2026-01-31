export const PLAN_TYPES = {
  FREE_TRIAL: 'free_trial',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const PRICING_PLANS = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    slug: 'free_trial',
    description: 'Try StringVentory free for 14 days',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 14,
    popular: false,
    color: 'gray',
    features: [
      '2 users',
      '50 products',
      '100 orders per month',
      '500MB storage',
      'Basic reports',
      'Email support'
    ],
    limits: {
      maxUsers: 2,
      maxProducts: 50,
      maxOrdersPerMonth: 100,
      maxStorageMB: 500,
      maxLocations: 1,
      maxCategories: 10,
      maxSuppliers: 5,
      maxCustomers: 100
    },
    featureFlags: [
      'dashboard',
      'products',
      'orders',
      'customers',
      'inventory',
      'basic_reports'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for small businesses',
    priceMonthly: 49,
    priceYearly: 470,
    popular: false,
    color: 'emerald',
    features: [
      '5 users',
      '500 products',
      '1,000 orders per month',
      '5GB storage',
      'All Free Trial features',
      'Suppliers & Purchases',
      'Expense tracking',
      'Standard reports',
      'Priority email support'
    ],
    limits: {
      maxUsers: 5,
      maxProducts: 500,
      maxOrdersPerMonth: 1000,
      maxStorageMB: 5120,
      maxLocations: 1,
      maxCategories: 50,
      maxSuppliers: 25,
      maxCustomers: 1000
    },
    featureFlags: [
      'dashboard',
      'products',
      'orders',
      'customers',
      'inventory',
      'suppliers',
      'purchases',
      'expenses',
      'categories',
      'standard_reports'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    slug: 'professional',
    description: 'For growing businesses',
    priceMonthly: 149,
    priceYearly: 1430,
    popular: true,
    color: 'purple',
    features: [
      '15 users',
      '5,000 products',
      '10,000 orders per month',
      '50GB storage',
      'All Starter features',
      'Multi-location support',
      'User management',
      'Advanced analytics',
      'API access',
      'Bulk operations',
      'Priority support'
    ],
    limits: {
      maxUsers: 15,
      maxProducts: 5000,
      maxOrdersPerMonth: 10000,
      maxStorageMB: 51200,
      maxLocations: 5,
      maxCategories: -1, // Unlimited
      maxSuppliers: 100,
      maxCustomers: 10000
    },
    featureFlags: [
      'dashboard',
      'products',
      'orders',
      'customers',
      'inventory',
      'suppliers',
      'purchases',
      'expenses',
      'categories',
      'users',
      'settings',
      'multi_location',
      'advanced_analytics',
      'advanced_reports',
      'api_access',
      'bulk_operations'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large organizations',
    priceMonthly: 499,
    priceYearly: 4790,
    popular: false,
    color: 'amber',
    features: [
      'Unlimited users',
      'Unlimited products',
      'Unlimited orders',
      'Unlimited storage',
      'All Professional features',
      'Custom branding',
      'Custom reports',
      'Webhook integrations',
      'Audit logs',
      'Data export API',
      'Dedicated account manager',
      '24/7 priority support'
    ],
    limits: {
      maxUsers: -1,
      maxProducts: -1,
      maxOrdersPerMonth: -1,
      maxStorageMB: -1,
      maxLocations: -1,
      maxCategories: -1,
      maxSuppliers: -1,
      maxCustomers: -1
    },
    featureFlags: [
      'dashboard',
      'products',
      'orders',
      'customers',
      'inventory',
      'suppliers',
      'purchases',
      'expenses',
      'categories',
      'users',
      'settings',
      'multi_location',
      'advanced_analytics',
      'advanced_reports',
      'api_access',
      'bulk_operations',
      'custom_branding',
      'custom_reports',
      'webhooks',
      'audit_logs',
      'data_export_api'
    ]
  }
];

export const getPlanById = (planId) => {
  return PRICING_PLANS.find(plan => plan.id === planId);
};

export const getPlanFeatures = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.featureFlags : [];
};

export const getPlanLimits = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.limits : {};
};

export const getPlanColor = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.color : 'gray';
};
