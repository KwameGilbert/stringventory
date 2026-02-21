/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.table('suppliers', (table) => {
    table.string('city', 100);
    table.string('state', 100);
    table.string('postalCode', 20);
    table.string('country', 100);
    table.string('contactPerson', 200);
    table.string('contactTitle', 100);
    table.string('taxId', 100);
    table.string('paymentTerms', 100);
    table.integer('leadTime');
    table.integer('minOrderQuantity');
    table.decimal('rating', 3, 2);
    table.text('notes');
  });

  await knex.schema.table('inventoryEntries', (table) => {
    table.string('warehouseLocation', 100);
    table.string('reference', 100);
    table.text('notes');
  });

  await knex.schema.table('inventoryMovements', (table) => {
    table.string('fromWarehouse', 100);
    table.string('toWarehouse', 100);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.table('suppliers', (table) => {
    table.dropColumns([
      'city',
      'state',
      'postalCode',
      'country',
      'contactPerson',
      'contactTitle',
      'taxId',
      'paymentTerms',
      'leadTime',
      'minOrderQuantity',
      'rating',
      'notes',
    ]);
  });

  await knex.schema.table('inventoryEntries', (table) => {
    table.dropColumns(['warehouseLocation', 'reference', 'notes']);
  });

  await knex.schema.table('inventoryMovements', (table) => {
    table.dropColumns(['fromWarehouse', 'toWarehouse']);
  });
};
