/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async (knex) => {
  // Clear existing role-related data
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('users').update({ roleId: null }); // Unlink users from roles temporarily
  await knex('roles').del();

  // 1. Create permissions
  const permissions = [
    { key: 'VIEW_DASHBOARD', description: 'Can view administrative dashboard' },
    { key: 'MANAGE_USERS', description: 'Can create, edit and delete users' },
    { key: 'VIEW_REPORTS', description: 'Can view business reports' },
    { key: 'MANAGE_INVENTORY', description: 'Can manage stock and products' },
    { key: 'MANAGE_SALES', description: 'Can process sales and returns' },
    { key: 'MANAGE_SETTINGS', description: 'Can modify business settings' },
  ];

  const createdPermissions = await knex('permissions').insert(permissions).returning('*');
  const permMap = createdPermissions.reduce((acc, p) => {
    acc[p.key] = p.id;
    return acc;
  }, {});

  // 2. Create roles
  const roles = [
    { name: 'admin', description: 'Standard administrator' },
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
  const rolePermissions = [
    // CEO gets everything
    ...Object.values(permMap).map((permId) => ({ roleId: roleMap['ceo'], permissionId: permId })),

    // Admin gets most things
    { roleId: roleMap['admin'], permissionId: permMap['VIEW_DASHBOARD'] },
    { roleId: roleMap['admin'], permissionId: permMap['MANAGE_USERS'] },
    { roleId: roleMap['admin'], permissionId: permMap['VIEW_REPORTS'] },
    { roleId: roleMap['admin'], permissionId: permMap['MANAGE_INVENTORY'] },

    // Manager
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_DASHBOARD'] },
    { roleId: roleMap['manager'], permissionId: permMap['VIEW_REPORTS'] },
    { roleId: roleMap['manager'], permissionId: permMap['MANAGE_INVENTORY'] },

    // Sales Person
    { roleId: roleMap['sales person'], permissionId: permMap['MANAGE_SALES'] },
  ];

  await knex('role_permissions').insert(rolePermissions);

  console.log('✅ Roles and Permissions seeded successfully!');
};
