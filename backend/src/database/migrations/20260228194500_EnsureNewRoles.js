/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  const roles = [
    { name: 'ceo', description: 'Business owner with full access' },
    { name: 'manager', description: 'Operational manager with full access except user management' },
    { name: 'sales', description: 'Staff handling sales and viewing inventory' },
  ];

  for (const role of roles) {
    const existing = await knex('roles').where('name', role.name).first();
    if (!existing) {
      await knex('roles').insert(role);
    } else {
      await knex('roles').where('name', role.name).update({ description: role.description });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // We keep the roles as they might be in use
};
