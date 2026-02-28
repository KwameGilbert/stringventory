/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // 1. Ensure 'user' role exists if it's being used as default
  const existingUserRole = await knex('roles').where('name', 'user').first();
  if (!existingUserRole) {
    await knex('roles').insert({
      name: 'user',
      description: 'Standard application user',
    });
  }

  // 2. Migrate existing data from 'role' string column to 'roleId' UUID column
  const users = await knex('users').whereNotNull('role');

  for (const user of users) {
    if (!user.roleId && user.role) {
      const roleName = user.role.toLowerCase();
      let role = await knex('roles').where('name', roleName).first();

      // Fallback: If role name in column doesn't exist in roles table, map to 'user'
      if (!role) {
        role = await knex('roles').where('name', 'user').first();
      }

      if (role) {
        await knex('users').where('id', user.id).update({ roleId: role.id });
      }
    }
  }

  // 3. Drop 'role' column from 'users' table
  await knex.schema.table('users', (table) => {
    table.dropColumn('role');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // 1. Add 'role' column back
  await knex.schema.table('users', (table) => {
    table.string('role', 50).nullable();
  });

  // 2. Populate 'role' column from 'roles' table
  const usersWithRoles = await knex('users')
    .join('roles', 'users.roleId', 'roles.id')
    .select('users.id', 'roles.name');

  for (const item of usersWithRoles) {
    await knex('users').where('id', item.id).update({ role: item.name });
  }
};
