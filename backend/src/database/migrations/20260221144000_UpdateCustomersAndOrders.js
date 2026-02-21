/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // Update Customers table
  await knex.schema.table('customers', (table) => {
    table.string('firstName', 100);
    table.string('lastName', 100);
    table.string('customerType', 50).defaultTo('retail');
    table.string('city', 100);
    table.string('state', 100);
    table.string('postalCode', 20);
    table.string('country', 100).defaultTo('Ghana');
    table.string('taxId', 100);
    table.decimal('creditLimit', 15, 2).defaultTo(0);
    table.decimal('creditUsed', 15, 2).defaultTo(0);
    table.integer('loyaltyPoints').defaultTo(0);
    table.text('notes');
  });

  // Update Orders table
  await knex.schema.table('orders', (table) => {
    table.enum('paymentStatus', ['unpaid', 'paid', 'partially_paid']).defaultTo('unpaid');
    table.decimal('taxAmount', 15, 2).defaultTo(0);
  });

  // Create Refunds table
  await knex.schema.createTable('refunds', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').onDelete('CASCADE');
    table.uuid('businessId').references('id').inTable('businesses').onDelete('CASCADE');
    table.decimal('amount', 15, 2).notNullable();
    table.enum('refundType', ['full', 'partial']).defaultTo('full');
    table.string('reason', 255);
    table.enum('status', ['pending', 'processed', 'failed']).defaultTo('processed');
    table.text('notes');
    table.timestamp('processedAt').defaultTo(knex.fn.now());
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // Create Refund Items table
  await knex.schema.createTable('refundItems', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('refundId').references('id').inTable('refunds').onDelete('CASCADE');
    table.uuid('orderItemId').references('id').inTable('orderItems').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists('refundItems');
  await knex.schema.dropTableIfExists('refunds');

  await knex.schema.table('orders', (table) => {
    table.dropColumn('paymentStatus');
    table.dropColumn('taxAmount');
  });

  await knex.schema.table('customers', (table) => {
    table.dropColumns([
      'firstName',
      'lastName',
      'customerType',
      'city',
      'state',
      'postalCode',
      'country',
      'taxId',
      'creditLimit',
      'creditUsed',
      'loyaltyPoints',
      'notes',
    ]);
  });
};
