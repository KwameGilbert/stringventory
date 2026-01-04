/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

// ROLES 
  await knex.schema.createTable('roles', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

// USERS
  await knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('roles.id').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').unique().notNullable();
    table.string('phone');
    table.string('password').notNullable();
    table.boolean('isActive').defaultTo(true);
    table.boolean('mfaEnabled').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// ACTIVITY LOGS
  await knex.schema.createTable('activityLogs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('users.id').notNullable();
    table.string('action').notNullable();
    table.string('entityType');
    table.uuid('entityId');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

// CATEGORIES
  await knex.schema.createTable('categories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.text('description');
    table.string('image');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// PRODUCTS
  await knex.schema.createTable('products', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('productCode').unique().notNullable();
    table.string('name').notNullable();
    table.uuid('categoryId').references('categories.id').notNullable();
    table.text('description');
    table.string('unitOfMeasure');
    table.integer('reorderThreshold').defaultTo(0);
    table.boolean('isActive').defaultTo(true);
    table.uuid('supplierId').references('suppliers.id').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// SUPPLIERS
  await knex.schema.createTable('suppliers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.string('phone');
    table.string('email');
    table.text('address');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// BATCHES
  await knex.schema.createTable('batches', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('batchNumber').unique().notNullable();
    table.string('waybillNumber');
    table.uuid('supplierId').references('suppliers.id').notNullable();
    table.date('receivedDate').notNullable();
    table.text('notes');
    table.enum('status', ['open', 'closed']).defaultTo('open');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// INVENTORY ENTRIES
  await knex.schema.createTable('inventoryEntries', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('productId').references('products.id').notNullable();
    table.uuid('batchId').references('batches.id').notNullable();
    table.numeric('costPrice').notNullable();
    table.numeric('sellingPrice').notNullable();
    table.integer('quantityReceived').notNullable();
    table.date('expiryDate');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// INVENTORY MOVEMENTS
  await knex.schema.createTable('inventoryMovements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('inventoryEntryId').references('inventoryEntries.id').notNullable();
    table.integer('quantity').notNullable();
    table.enum('movementType', ['IN', 'OUT', 'ADJUSTMENT']).notNullable();
    table.uuid('referenceId').references('orders.id').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// CUSTOMERS
  await knex.schema.createTable('customers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('customerName').notNullable();
    table.string('businessName');
    table.string('phone');
    table.string('email');
    table.text('address');
    table.boolean('isActive').defaultTo(true).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// ORDERS
  await knex.schema.createTable('orders', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('orderNumber').unique().notNullable();
    table.uuid('customerId').references('customers.id').notNullable();
    table.date('orderDate').notNullable();
    table.enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']).defaultTo('pending');
    table.enum('paymentMethod', ['cash', 'card', 'online']).notNullable();
    table.numeric('subtotal').notNullable();
    table.numeric('discountTotal').defaultTo(0);
    table.numeric('totalAmount').notNullable();
    table.uuid('createdById').references('users.id').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// ORDER ITEMS
  await knex.schema.createTable('orderItems', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('orders.id').notNullable();
    table.uuid('productId').references('products.id').notNullable();
    table.integer('quantity').notNullable();
    table.numeric('unitPrice').notNullable();
    table.numeric('discount').defaultTo(0);
    table.numeric('totalAmount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// ORDER PAYMENTS
  await knex.schema.createTable('orderPayments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('orders.id').notNullable();
    table.enum('paymentMethod', ['cash', 'card', 'online']).notNullable();
    table.numeric('amount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// DISCOUNTS
  await knex.schema.createTable('discounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.enum('type', ['percentage', 'fixed']).notNullable();
    table.numeric('discountValue').notNullable();
    table.enum('scope', ['all', 'selected']).notNullable();
    table.timestamp('startDate').notNullable();
    table.timestamp('endDate').notNullable();
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// ORDER DISCOUNTS
  await knex.schema.createTable('orderDiscounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('orders.id').notNullable();
    table.uuid('discountId').references('discounts.id').notNullable();
    table.numeric('discountValue').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// EXPENSE CATEGORIES
  await knex.schema.createTable('expenseCategories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

// EXPENSES
  await knex.schema.createTable('expenses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('expenseCategoryId').references('expenseCategories.id').notNullable();
    table.string('name').notNullable();
    table.numeric('amount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
