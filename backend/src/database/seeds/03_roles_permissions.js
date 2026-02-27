/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async (knex) => {
  // Clear existing role-related data
  await knex('user_permissions').del();
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('users').update({ roleId: null }); // Unlink users from roles temporarily
  await knex('roles').del();

  // 1. Create permissions – full set matching API documentation
  const permissions = [
    // Dashboard
    { key: 'VIEW_DASHBOARD', description: 'Can view the main dashboard' },
    { key: 'VIEW_DASHBOARD_KPI', description: 'Can view dashboard KPI cards' },
    { key: 'VIEW_DASHBOARD_SALES', description: 'Can view dashboard sales chart' },
    { key: 'VIEW_DASHBOARD_PRODUCTS', description: 'Can view dashboard product stats' },
    { key: 'VIEW_DASHBOARD_CUSTOMERS', description: 'Can view dashboard customer stats' },
    { key: 'VIEW_DASHBOARD_PAYMENTS', description: 'Can view dashboard payment stats' },
    { key: 'VIEW_DASHBOARD_QUICK_ACTIONS', description: 'Can use dashboard quick actions' },
    // KPI
    { key: 'VIEW_KPI_GROSS_REVENUE', description: 'Can view gross revenue KPI' },
    { key: 'VIEW_KPI_DAILY_SALES', description: 'Can view daily sales KPI' },
    { key: 'VIEW_KPI_TOTAL_EXPENSES', description: 'Can view total expenses KPI' },
    { key: 'VIEW_KPI_TOTAL_REFUNDS', description: 'Can view total refunds KPI' },
    { key: 'VIEW_KPI_NET_REVENUE', description: 'Can view net revenue KPI' },
    { key: 'VIEW_KPI_TOTAL_SALES', description: 'Can view total sales KPI' },
    { key: 'VIEW_KPI_TOTAL_STOCK', description: 'Can view total stock KPI' },
    { key: 'VIEW_KPI_INVENTORY_VALUE', description: 'Can view inventory value KPI' },
    { key: 'VIEW_KPI_LOW_STOCK', description: 'Can view low stock KPI' },
    // Products
    { key: 'VIEW_PRODUCTS', description: 'Can view products' },
    { key: 'MANAGE_PRODUCTS', description: 'Can create, update and delete products & categories' },
    // Orders
    { key: 'VIEW_ORDERS', description: 'Can view orders' },
    { key: 'MANAGE_ORDERS', description: 'Can create, update and delete orders' },
    // Inventory
    { key: 'VIEW_INVENTORY', description: 'Can view inventory' },
    { key: 'MANAGE_INVENTORY', description: 'Can add, adjust and transfer inventory' },
    // Suppliers
    { key: 'VIEW_SUPPLIERS', description: 'Can view suppliers' },
    { key: 'MANAGE_SUPPLIERS', description: 'Can create, update and delete suppliers' },
    // Purchases
    { key: 'VIEW_PURCHASES', description: 'Can view purchase orders' },
    { key: 'MANAGE_PURCHASES', description: 'Can create and update purchase orders' },
    // Customers
    { key: 'VIEW_CUSTOMERS', description: 'Can view customers' },
    { key: 'MANAGE_CUSTOMERS', description: 'Can create, update and delete customers' },
    // Expenses
    { key: 'VIEW_EXPENSES', description: 'Can view expenses' },
    { key: 'MANAGE_EXPENSES', description: 'Can create, update and delete expenses' },
    // Sales
    { key: 'MANAGE_SALES', description: 'Can process sales and returns' },
    // Reports
    { key: 'VIEW_REPORTS', description: 'Can view reports and analytics' },
    // Users
    { key: 'VIEW_USERS', description: 'Can view user list' },
    { key: 'MANAGE_USERS', description: 'Can create, edit and delete users' },
    // Messaging
    { key: 'VIEW_MESSAGING', description: 'Can view messages' },
    { key: 'SEND_MESSAGES', description: 'Can send messages' },
    // Notifications
    { key: 'VIEW_NOTIFICATIONS', description: 'Can view notifications' },
    { key: 'MANAGE_NOTIFICATIONS', description: 'Can manage notification settings' },
    // Profile
    { key: 'VIEW_PROFILE', description: 'Can view own profile' },
    { key: 'EDIT_PROFILE', description: 'Can edit own profile' },
    // Subscription
    { key: 'VIEW_SUBSCRIPTION', description: 'Can view subscription details' },
    { key: 'MANAGE_SUBSCRIPTION', description: 'Can manage subscription' },
    // Billing
    { key: 'VIEW_BILLING_HISTORY', description: 'Can view billing history' },
    { key: 'MANAGE_PAYMENT_METHODS', description: 'Can manage payment methods' },
    // Settings
    { key: 'VIEW_SETTINGS', description: 'Can view system settings' },
    { key: 'MANAGE_SETTINGS', description: 'Can modify system settings' },
  ];

  const createdPermissions = await knex('permissions').insert(permissions).returning('*');
  const permMap = createdPermissions.reduce((acc, p) => {
    acc[p.key] = p.id;
    return acc;
  }, {});

  // 2. Create roles
  const roles = [
    { name: 'admin', description: 'Standard administrator with full permissions' },
    { name: 'ceo', description: 'Business owner with full access' },
    { name: 'sales person', description: 'Staff handling sales daily' },
    { name: 'manager', description: 'Operational manager' },
  ];

  const createdRoles = await knex('roles').insert(roles).returning('*');
  const roleMap = createdRoles.reduce((acc, r) => {
    acc[r.name] = r.id;
    return acc;
  }, {});

  // 3. Link permissions to roles
  const allPermIds = Object.values(permMap);

  const rolePermissions = [
    // CEO gets ALL permissions
    ...allPermIds.map((permId) => ({ roleId: roleMap['ceo'], permissionId: permId })),

    // Admin gets ALL permissions
    ...allPermIds.map((permId) => ({ roleId: roleMap['admin'], permissionId: permId })),

    // Manager gets a broad operational subset
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD_KPI'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD_SALES'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD_PRODUCTS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD_CUSTOMERS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_PRODUCTS'] },
    { roleId: roleMap['manager'], permissionId: permMap['MANAGE_PRODUCTS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_ORDERS'] },
    { roleId: roleMap['manager'], permissionId: permMap['MANAGE_ORDERS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_INVENTORY'] },
    { roleId: roleMap['manager'], permissionId: permMap['MANAGE_INVENTORY'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_SUPPLIERS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_CUSTOMERS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_EXPENSES'] },
    { roleId: roleMap['manager'], permissionId: permMap['MANAGE_SALES'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_REPORTS'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_PROFILE'] },
    { roleId: roleMap['manager'], permissionId: permMap['EDIT_PROFILE'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_NOTIFICATIONS'] },

    // Sales Person gets a focused sales subset
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_DASHBOARD'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_DASHBOARD_SALES'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_PRODUCTS'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_ORDERS'] },
    { roleId: roleMap['sales person'], permissionId: permMap['MANAGE_ORDERS'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_CUSTOMERS'] },
    { roleId: roleMap['sales person'], permissionId: permMap['MANAGE_CUSTOMERS'] },
    { roleId: roleMap['sales person'], permissionId: permMap['MANAGE_SALES'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_INVENTORY'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_PROFILE'] },
    { roleId: roleMap['sales person'], permissionId: permMap['EDIT_PROFILE'] },
    { roleId: roleMap['sales person'], permissionId: permMap['VIEW_NOTIFICATIONS'] },
  ];

  await knex('role_permissions').insert(rolePermissions);

  console.log('✅ Roles and Permissions seeded successfully!');
};
