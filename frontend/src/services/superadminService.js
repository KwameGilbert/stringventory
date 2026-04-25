/**
 * Superadmin API Service - FULLY MOCKED FOR FRONTEND DEV
 */

const mockBusinesses = [
  {
    id: '1',
    name: 'NC Avenue Wholesale',
    email: 'ceo@ncavenue.com',
    status: 'active',
    subscription_plan: 'enterprise',
    mrr: 1500,
    current_usage: { total_users: 15 },
    usage_limits: { maxUsers: 50 },
    created_at: '2026-01-15T10:00:00Z',
    business_type: 'Wholesale'
  },
  {
    id: '2',
    name: 'NexaRetail Group',
    email: 'admin@nexaretail.io',
    status: 'active',
    subscription_plan: 'pro',
    mrr: 450,
    current_usage: { total_users: 8 },
    usage_limits: { maxUsers: 20 },
    created_at: '2026-02-20T14:30:00Z',
    business_type: 'Retail'
  },
  {
    id: '3',
    name: 'QuickStock Ltd',
    email: 'info@quickstock.com',
    status: 'suspended',
    subscription_plan: 'starter',
    mrr: 99,
    current_usage: { total_users: 2 },
    usage_limits: { maxUsers: 5 },
    created_at: '2026-03-05T09:15:00Z',
    business_type: 'E-commerce'
  },
  {
    id: '4',
    name: 'Global Logistix',
    email: 'billing@globallogistix.net',
    status: 'active',
    subscription_plan: 'enterprise',
    mrr: 1500,
    current_usage: { total_users: 22 },
    usage_limits: { maxUsers: 100 },
    created_at: '2026-03-12T11:45:00Z',
    business_type: 'Logistics'
  },
  {
    id: '5',
    name: 'Zion Tech Solutions',
    email: 'ops@ziontech.com',
    status: 'active',
    subscription_plan: 'pro',
    mrr: 450,
    current_usage: { total_users: 6 },
    usage_limits: { maxUsers: 20 },
    created_at: '2026-04-10T16:20:00Z',
    business_type: 'Technology'
  }
];

export const superadminService = {
  getBusinesses: async (params = {}) => {
    console.log('Mock: Fetching businesses', params);
    return Promise.resolve({ 
      data: mockBusinesses,
      total: mockBusinesses.length 
    });
  },

  getBusinessById: async (businessId) => {
    const business = mockBusinesses.find(b => b.id === businessId);
    return Promise.resolve({ data: business || mockBusinesses[0] });
  },

  createBusiness: async (payload) => {
    console.log('Mock: Creating business', payload);
    return Promise.resolve({ data: { ...payload, id: Math.random().toString() } });
  },

  updateBusiness: async (businessId, payload) => {
    console.log('Mock: Updating business', businessId, payload);
    return Promise.resolve({ data: { ...payload, id: businessId } });
  },

  deleteBusiness: async (businessId) => {
    console.log('Mock: Deleting business', businessId);
    return Promise.resolve({ data: { success: true } });
  },

  suspendBusiness: async (businessId) => {
    console.log('Mock: Suspending business', businessId);
    return Promise.resolve({ data: { success: true } });
  },

  reactivateBusiness: async (businessId) => {
    console.log('Mock: Reactivating business', businessId);
    return Promise.resolve({ data: { success: true } });
  },

  getPricingPlanById: async (planId) => {
    const plans = [
      { 
        id: '1', 
        name: 'Starter', 
        description: 'Perfect for small businesses getting started.',
        priceMonthly: 99, 
        priceYearly: 990,
        trialDays: 14,
        features: ['Up to 5 users', 'Basic Analytics', 'Manual CSV Exports', 'Email Support'], 
        featureFlags: ['basic_inventory', 'standard_reports'],
        limits: { maxUsers: 5, maxProducts: 500, maxOrdersPerMonth: 100, maxStorageMB: 512, maxLocations: 1 },
        active_businesses: 45,
        color: 'blue'
      },
      { 
        id: '2', 
        name: 'Pro', 
        description: 'Advanced features for growing teams.',
        priceMonthly: 450, 
        priceYearly: 4500,
        trialDays: 30,
        features: ['Up to 20 users', 'Advanced Analytics', 'API Access', 'Email & SMS Alerts', 'Multi-location'], 
        featureFlags: ['advanced_inventory', 'advanced_reports', 'api_access', 'multi_warehouse'],
        limits: { maxUsers: 20, maxProducts: 5000, maxOrdersPerMonth: 2000, maxStorageMB: 5120, maxLocations: 5 },
        active_businesses: 120,
        color: 'emerald'
      },
      { 
        id: '3', 
        name: 'Enterprise', 
        description: 'Unrestricted access for large scale operations.',
        priceMonthly: 1500, 
        priceYearly: 15000,
        trialDays: 30,
        features: ['Unlimited users', 'Custom Analytics', 'Priority Support', 'Dedicated Success Manager', 'SSO/SAML'], 
        featureFlags: ['unlimited_everything', 'priority_support', 'sso_auth', 'custom_integration'],
        limits: { maxUsers: -1, maxProducts: -1, maxOrdersPerMonth: -1, maxStorageMB: -1, maxLocations: -1 },
        active_businesses: 28,
        color: 'purple'
      }
    ];
    const plan = plans.find(p => p.id === planId) || plans[0];
    return Promise.resolve({ data: plan });
  },

  getPricingPlans: async (params = {}) => {
    return Promise.resolve({
      data: [
        { 
          id: '1', 
          name: 'Starter', 
          price: 99, 
          features: ['Up to 5 users', 'Basic Analytics', 'Manual CSV Exports'], 
          active_businesses: 45,
          color: 'blue'
        },
        { 
          id: '2', 
          name: 'Pro', 
          price: 450, 
          features: ['Up to 20 users', 'Advanced Analytics', 'API Access', 'Email Alerts'], 
          active_businesses: 120,
          color: 'emerald'
        },
        { 
          id: '3', 
          name: 'Enterprise', 
          price: 1500, 
          features: ['Unlimited users', 'Custom Analytics', 'Priority Support', 'Dedicated Success Manager'], 
          active_businesses: 28,
          color: 'purple'
        }
      ]
    });
  },

  getPlatformAnalytics: async (params = {}) => {
    return Promise.resolve({
      data: {
        analytics: {
          totalBusinesses: 193,
          activeSubscriptions: 185,
          monthlyRecurringRevenue: 42500,
          totalUsers: 1450,
          businessesChange: 15,
          subscriptionsChange: 12,
          mrrChange: 25,
          usersChange: 18,
          revenueTrends: [
            { month: 'Oct', revenue: 28000, subscriptions: 140 },
            { month: 'Nov', revenue: 31000, subscriptions: 152 },
            { month: 'Dec', revenue: 35000, subscriptions: 165 },
            { month: 'Jan', revenue: 38500, subscriptions: 172 },
            { month: 'Feb', revenue: 40500, subscriptions: 178 },
            { month: 'Mar', revenue: 42500, subscriptions: 185 }
          ],
          planDistribution: [
            { plan: 'Starter', count: 45, percentage: 24, revenue: 4455, color: 'bg-blue-500' },
            { plan: 'Pro', count: 120, percentage: 65, revenue: 54000, color: 'bg-emerald-500' },
            { plan: 'Enterprise', count: 28, percentage: 11, revenue: 42000, color: 'bg-purple-500' }
          ],
          recentActivity: [
            { id: 1, type: 'signup', business: 'Zion Tech Solutions', plan: 'Pro', time: '2 mins ago' },
            { id: 2, type: 'upgrade', business: 'QuickStock Ltd', plan: 'Enterprise', time: '45 mins ago' },
            { id: 3, type: 'payment', business: 'NC Avenue Wholesale', amount: 1500, time: '2 hours ago' },
            { id: 4, type: 'signup', business: 'Spark Retail', plan: 'Starter', time: '5 hours ago' },
            { id: 5, type: 'cancellation', business: 'OldShop Inc', time: '1 day ago' }
          ]
        },
        currency: 'USD'
      }
    });
  },

  getPlanComparison: async () => {
    return Promise.resolve({
      data: [
        {
          category: "Stock Management",
          features: [
            { name: "Product Limit", starter: "500", pro: "5000", enterprise: "Unlimited" },
            { name: "Bulk Import/Export", starter: true, pro: true, enterprise: true },
            { name: "Low Stock Alerts", starter: true, pro: true, enterprise: true },
            { name: "Barcode Generation", starter: false, pro: true, enterprise: true },
            { name: "Multi-location", starter: "1 Store", pro: "5 Stores", enterprise: "Unlimited" },
          ]
        },
        {
          category: "Sales & CRM",
          features: [
            { name: "Point of Sale (POS)", starter: true, pro: true, enterprise: true },
            { name: "Customer Profiles", starter: "Basic", pro: "Advanced", enterprise: "Enterprise" },
            { name: "Bulk Discounts", starter: false, pro: true, enterprise: true },
          ]
        },
        {
          category: "Analytics & Reports",
          features: [
            { name: "Sales Reports", starter: "Basic", pro: "Detailed", enterprise: "Custom" },
            { name: "Inventory Forecasting", starter: false, pro: true, enterprise: true },
            { name: "Tax Management", starter: "Basic", pro: "Multi-Tax", enterprise: "Custom" },
          ]
        }
      ]
    });
  },

  getSettings: async () => {
    console.log('Mock: Fetching platform settings');
    return Promise.resolve({
      data: {
        general: {
          platformName: 'StringVentory',
          platformEmail: 'admin@stringventory.com',
          supportEmail: 'support@stringventory.com',
          companyName: 'StringTech Solutions',
          maintenanceMode: false,
        },
        appearance: {
          primaryColor: 'emerald',
          themeMode: 'light',
          density: 'comfortable',
        },
        notifications: {
          emailNotifications: true,
          newBusinessNotification: true,
          paymentNotification: true,
          systemAlerts: true,
          emailProvider: 'smtp',
          smtpConfig: {
            host: 'smtp.mailtrap.io',
            port: '587',
            user: 'user_123',
            senderName: 'StringVentory Admin',
            senderEmail: 'noreply@stringventory.com',
          }
        },
        billing: {
          currency: 'USD',
          taxRate: 15.0,
          invoicePrefix: 'SV-',
          enableTrials: true,
          trialDays: 14,
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 30,
          passwordExpiry: 90,
          loginAttempts: 5,
        },
        integrations: {
          apiKeys: [
            { id: '1', name: 'Frontend API', key: 'pk_live_****************', status: 'active', createdAt: '2026-01-01' }
          ],
          webhooks: [
            { id: '1', url: 'https://hooks.slack.com/services/...', event: 'business.signup', status: 'active' }
          ]
        }
      }
    });
  },

  updateSettings: async (payload) => {
    console.log('Mock: Updating platform settings', payload);
    return Promise.resolve({ data: payload });
  }
};

export default superadminService;
