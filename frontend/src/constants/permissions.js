export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "VIEW_DASHBOARD",

  // Products
  VIEW_PRODUCTS: "VIEW_PRODUCTS",
  MANAGE_PRODUCTS: "MANAGE_PRODUCTS", // Create, Edit, Delete

  // Orders
  VIEW_ORDERS: "VIEW_ORDERS",
  MANAGE_ORDERS: "MANAGE_ORDERS",

  // Inventory
  VIEW_INVENTORY: "VIEW_INVENTORY",
  MANAGE_INVENTORY: "MANAGE_INVENTORY", // Add stock, adjust

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

  // Settings
  VIEW_SETTINGS: "VIEW_SETTINGS",
};

// Grouped for UI display
export const PERMISSION_GROUPS = [
  {
    category: "Dashboard",
    permissions: [
      { key: PERMISSIONS.VIEW_DASHBOARD, label: "View Dashboard" }
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
    category: "Orders",
    permissions: [
      { key: PERMISSIONS.VIEW_ORDERS, label: "View Orders" },
      { key: PERMISSIONS.MANAGE_ORDERS, label: "Manage Orders" }
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
      { key: PERMISSIONS.VIEW_MESSAGING, label: "Access Messaging" }
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
    category: "System",
    permissions: [
      { key: PERMISSIONS.VIEW_SETTINGS, label: "Access Settings" }
    ]
  }
];
