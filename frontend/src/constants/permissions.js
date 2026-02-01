export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  
  // Dashboard Widgets (Granular Control)
  VIEW_DASHBOARD_KPI: "VIEW_DASHBOARD_KPI",
  VIEW_DASHBOARD_SALES: "VIEW_DASHBOARD_SALES",
  VIEW_DASHBOARD_PRODUCTS: "VIEW_DASHBOARD_PRODUCTS",
  VIEW_DASHBOARD_CUSTOMERS: "VIEW_DASHBOARD_CUSTOMERS",
  VIEW_DASHBOARD_PAYMENTS: "VIEW_DASHBOARD_PAYMENTS",
  VIEW_DASHBOARD_QUICK_ACTIONS: "VIEW_DASHBOARD_QUICK_ACTIONS",

  // Specific KPI Cards
  VIEW_KPI_GROSS_REVENUE: "VIEW_KPI_GROSS_REVENUE",
  VIEW_KPI_DAILY_SALES: "VIEW_KPI_DAILY_SALES",
  VIEW_KPI_TOTAL_EXPENSES: "VIEW_KPI_TOTAL_EXPENSES",
  VIEW_KPI_TOTAL_REFUNDS: "VIEW_KPI_TOTAL_REFUNDS",
  VIEW_KPI_NET_REVENUE: "VIEW_KPI_NET_REVENUE",
  VIEW_KPI_TOTAL_SALES: "VIEW_KPI_TOTAL_SALES",
  VIEW_KPI_TOTAL_STOCK: "VIEW_KPI_TOTAL_STOCK",
  VIEW_KPI_INVENTORY_VALUE: "VIEW_KPI_INVENTORY_VALUE",
  VIEW_KPI_LOW_STOCK: "VIEW_KPI_LOW_STOCK",

  // Products
  VIEW_PRODUCTS: "VIEW_PRODUCTS",
  MANAGE_PRODUCTS: "MANAGE_PRODUCTS",

  // Sales (Previously Orders)
  VIEW_ORDERS: "VIEW_ORDERS",
  MANAGE_ORDERS: "MANAGE_ORDERS",

  // Inventory
  VIEW_INVENTORY: "VIEW_INVENTORY",
  MANAGE_INVENTORY: "MANAGE_INVENTORY",

  // Suppliers
  VIEW_SUPPLIERS: "VIEW_SUPPLIERS",
  MANAGE_SUPPLIERS: "MANAGE_SUPPLIERS",

  // Purchases
  VIEW_PURCHASES: "VIEW_PURCHASES",
  MANAGE_PURCHASES: "MANAGE_PURCHASES",

  // Customers
  VIEW_CUSTOMERS: "VIEW_CUSTOMERS",
  MANAGE_CUSTOMERS: "MANAGE_CUSTOMERS",

  // Expenses
  VIEW_EXPENSES: "VIEW_EXPENSES",
  MANAGE_EXPENSES: "MANAGE_EXPENSES",

  // Reports
  VIEW_REPORTS: "VIEW_REPORTS",

  // Users
  VIEW_USERS: "VIEW_USERS",
  MANAGE_USERS: "MANAGE_USERS",

  // Messaging
  VIEW_MESSAGING: "VIEW_MESSAGING",
  SEND_MESSAGES: "SEND_MESSAGES",

  // Notifications
  VIEW_NOTIFICATIONS: "VIEW_NOTIFICATIONS",
  MANAGE_NOTIFICATIONS: "MANAGE_NOTIFICATIONS",

  // Profile
  VIEW_PROFILE: "VIEW_PROFILE",
  EDIT_PROFILE: "EDIT_PROFILE",

  // Subscription & Billing
  VIEW_SUBSCRIPTION: "VIEW_SUBSCRIPTION",
  MANAGE_SUBSCRIPTION: "MANAGE_SUBSCRIPTION",
  VIEW_BILLING_HISTORY: "VIEW_BILLING_HISTORY",
  MANAGE_PAYMENT_METHODS: "MANAGE_PAYMENT_METHODS",

  // Settings
  VIEW_SETTINGS: "VIEW_SETTINGS",
  MANAGE_SETTINGS: "MANAGE_SETTINGS",
};

// Grouped for UI display
export const PERMISSION_GROUPS = [
  {
    category: "Dashboard Access",
    permissions: [
      { key: PERMISSIONS.VIEW_DASHBOARD, label: "View Dashboard Page" }
    ]
  },
  {
    category: "Dashboard KPI Cards",
    permissions: [
      { key: PERMISSIONS.VIEW_KPI_GROSS_REVENUE, label: "Show Gross Revenue" },
      { key: PERMISSIONS.VIEW_KPI_DAILY_SALES, label: "Show Daily Sales" },
      { key: PERMISSIONS.VIEW_KPI_TOTAL_EXPENSES, label: "Show Total Expenses" },
      { key: PERMISSIONS.VIEW_KPI_TOTAL_REFUNDS, label: "Show Refunds" },
      { key: PERMISSIONS.VIEW_KPI_NET_REVENUE, label: "Show Net Revenue" },
      { key: PERMISSIONS.VIEW_KPI_TOTAL_SALES, label: "Show Total Sales" },
      { key: PERMISSIONS.VIEW_KPI_TOTAL_STOCK, label: "Show Total Stock" },
      { key: PERMISSIONS.VIEW_KPI_INVENTORY_VALUE, label: "Show Inventory Value" },
      { key: PERMISSIONS.VIEW_KPI_LOW_STOCK, label: "Show Low Stock Alerts" },
    ]
  },
  {
    category: "Dashboard Charts & Lists",
    permissions: [
      { key: PERMISSIONS.VIEW_DASHBOARD_KPI, label: "View KPI Section" },
      { key: PERMISSIONS.VIEW_DASHBOARD_SALES, label: "View Sales & Expenses Chart" },
      { key: PERMISSIONS.VIEW_DASHBOARD_PAYMENTS, label: "View Payment Distribution" },
      { key: PERMISSIONS.VIEW_DASHBOARD_PRODUCTS, label: "View Top Products" },
      { key: PERMISSIONS.VIEW_DASHBOARD_CUSTOMERS, label: "View Top Customers" },
      { key: PERMISSIONS.VIEW_DASHBOARD_QUICK_ACTIONS, label: "View Quick Action Lists" },
    ]
  },
  {
    category: "Products",
    permissions: [
      { key: PERMISSIONS.VIEW_PRODUCTS, label: "View Products" },
      { key: PERMISSIONS.MANAGE_PRODUCTS, label: "Manage Products" }
    ]
  },
  {
    category: "Sales",
    permissions: [
      { key: PERMISSIONS.VIEW_ORDERS, label: "View Sales" },
      { key: PERMISSIONS.MANAGE_ORDERS, label: "Manage Sales" }
    ]
  },
  {
    category: "Inventory",
    permissions: [
      { key: PERMISSIONS.VIEW_INVENTORY, label: "View Inventory" },
      { key: PERMISSIONS.MANAGE_INVENTORY, label: "Manage Inventory" }
    ]
  },
  {
    category: "Suppliers",
    permissions: [
      { key: PERMISSIONS.VIEW_SUPPLIERS, label: "View Suppliers" },
      { key: PERMISSIONS.MANAGE_SUPPLIERS, label: "Manage Suppliers" }
    ]
  },
  {
    category: "Purchases",
    permissions: [
      { key: PERMISSIONS.VIEW_PURCHASES, label: "View Purchases" },
      { key: PERMISSIONS.MANAGE_PURCHASES, label: "Manage Purchases" }
    ]
  },
  {
    category: "Customers",
    permissions: [
      { key: PERMISSIONS.VIEW_CUSTOMERS, label: "View Customers" },
      { key: PERMISSIONS.MANAGE_CUSTOMERS, label: "Manage Customers" }
    ]
  },
  {
    category: "Expenses",
    permissions: [
      { key: PERMISSIONS.VIEW_EXPENSES, label: "View Expenses" },
      { key: PERMISSIONS.MANAGE_EXPENSES, label: "Manage Expenses" }
    ]
  },
  {
    category: "Messaging",
    permissions: [
      { key: PERMISSIONS.VIEW_MESSAGING, label: "Access Messaging" },
      { key: PERMISSIONS.SEND_MESSAGES, label: "Send Messages" }
    ]
  },
  {
    category: "Notifications",
    permissions: [
      { key: PERMISSIONS.VIEW_NOTIFICATIONS, label: "View Notifications" },
      { key: PERMISSIONS.MANAGE_NOTIFICATIONS, label: "Manage Notifications" }
    ]
  },
  {
    category: "Profile",
    permissions: [
      { key: PERMISSIONS.VIEW_PROFILE, label: "View Profile" },
      { key: PERMISSIONS.EDIT_PROFILE, label: "Edit Profile" }
    ]
  },
  {
    category: "Subscription & Billing",
    permissions: [
      { key: PERMISSIONS.VIEW_SUBSCRIPTION, label: "View Subscription Plans" },
      { key: PERMISSIONS.MANAGE_SUBSCRIPTION, label: "Upgrade/Downgrade Plans" },
      { key: PERMISSIONS.VIEW_BILLING_HISTORY, label: "View Billing History" },
      { key: PERMISSIONS.MANAGE_PAYMENT_METHODS, label: "Manage Payment Methods" }
    ]
  },
  {
    category: "Reports",
    permissions: [
      { key: PERMISSIONS.VIEW_REPORTS, label: "View Reports" }
    ]
  },
  {
    category: "User Management",
    permissions: [
      { key: PERMISSIONS.VIEW_USERS, label: "View Users" },
      { key: PERMISSIONS.MANAGE_USERS, label: "Manage Users" }
    ]
  },
  {
    category: "System Settings",
    permissions: [
      { key: PERMISSIONS.VIEW_SETTINGS, label: "View Settings" },
      { key: PERMISSIONS.MANAGE_SETTINGS, label: "Manage Settings" }
    ]
  }
];
