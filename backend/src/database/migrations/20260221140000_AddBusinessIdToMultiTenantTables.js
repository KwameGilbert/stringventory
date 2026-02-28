/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  const tables = [
    'categories',
    'suppliers',
    'paymentMethods',
    'customers',
    'discounts',
    'expenseCategories',
    'unitOfMeasurements',
    'products',
    'batches',
    'expenses',
    'bulkMessages',
    'orders',
    'purchases',
    'inventoryEntries',
    'notifications',
    'transactions',
  ];

  for (const tableName of tables) {
    await knex.schema.table(tableName, (table) => {
      table
        .uuid('businessId')
        .references('id')
        .inTable('businesses')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .index();

      if (tableName === 'products') {
        table.integer('quantity').defaultTo(0);
      }
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  const tables = [
    'categories',
    'suppliers',
    'paymentMethods',
    'customers',
    'discounts',
    'expenseCategories',
    'unitOfMeasurements',
    'products',
    'batches',
    'expenses',
    'bulkMessages',
    'orders',
    'purchases',
    'inventoryEntries',
    'notifications',
    'transactions',
  ];

  for (const tableName of tables) {
    await knex.schema.table(tableName, (table) => {
      table.dropColumn('businessId');
    });
  }
};
