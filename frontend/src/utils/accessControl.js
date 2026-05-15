export const ROLES = {
  SUPERADMIN: 'Superadmin',
  CEO: 'CEO',
  MANAGER: 'Manager',
  SALES: 'Sales',
};

export const normalizeRole = (roleValue) => {
  const raw = String(roleValue || '').trim().toLowerCase();

  if (['superadmin', 'super_admin'].includes(raw)) {
    return ROLES.SUPERADMIN;
  }

  if (['ceo', 'owner', 'admin', 'administrator'].includes(raw)) {
    return ROLES.CEO;
  }

  if (['manager', 'management'].includes(raw)) {
    return ROLES.MANAGER;
  }

  if (['sales', 'salesperson', 'sales_person', 'sales rep', 'sales_rep'].includes(raw)) {
    return ROLES.SALES;
  }

  return ROLES.SALES;
};

export const canManageUsers = (roleValue) => normalizeRole(roleValue) === ROLES.CEO;

export const canManageCatalog = (roleValue) => {
  const role = normalizeRole(roleValue);
  return role === ROLES.CEO || role === ROLES.MANAGER;
};

export const canViewOnlyCatalog = (roleValue) => normalizeRole(roleValue) === ROLES.SALES;

export const getRoleMenuItems = (roleValue) => {
  const role = normalizeRole(roleValue);

  if (role === ROLES.SALES) {
    return ['dashboard', 'categories', 'products', 'sales', 'customers', 'profile', 'notifications'];
  }

  return [
    'dashboard',
    'categories',
    'products',
    'purchases',
    'inventory',
    'suppliers',
    'sales',
    'customers',
    'expense-categories',
    'expenses',
    'refunds',
    'transactions',
    'reports',
    'activity-logs',
    'users',
    'messaging',
    'settings',
    'profile',
    'notifications',
  ];
};

