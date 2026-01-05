/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  // ============================================
  // TIER 1: Base tables with no foreign keys
  // ============================================

  // ROLES
  await knex.schema.createTable('roles', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
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

  // DISCOUNTS
  await knex.schema.createTable('discounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.enum('type', ['percentage', 'fixed']).notNullable();
    table.integer('discountValue').notNullable();
    table.enum('scope', ['all', 'selected']).notNullable();
    table.timestamp('startDate').notNullable();
    table.timestamp('endDate').notNullable();
    table.boolean('isActive').defaultTo(true);
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

  // MESSAGES
  await knex.schema.createTable('messages', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('message').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // SYSTEM SETTINGS
  await knex.schema.createTable('systemSettings', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').unique().notNullable();
    table.string('value').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ============================================
  // TIER 2: Tables that depend on TIER 1
  // ============================================

  // USERS (depends on: roles)
  await knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('id').inTable('roles').notNullable();
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

  // PRODUCTS (depends on: categories, suppliers)
  await knex.schema.createTable('products', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('productCode').unique().notNullable();
    table.string('name').notNullable();
    table.uuid('categoryId').references('id').inTable('categories').notNullable();
    table.text('description');
    table.string('unitOfMeasure');
    table.integer('reorderThreshold').defaultTo(0);
    table.boolean('isActive').defaultTo(true);
    table.uuid('supplierId').references('id').inTable('suppliers').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // BATCHES (depends on: suppliers)
  await knex.schema.createTable('batches', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('batchNumber').unique().notNullable();
    table.string('waybillNumber');
    table.uuid('supplierId').references('id').inTable('suppliers').notNullable();
    table.date('receivedDate').notNullable();
    table.text('notes');
    table.enum('status', ['open', 'closed']).defaultTo('open');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // EXPENSES (depends on: expenseCategories)
  await knex.schema.createTable('expenses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('expenseCategoryId').references('id').inTable('expenseCategories').notNullable();
    table.string('name').notNullable();
    table.decimal('amount').notNullable();
    table.enum('status', ['pending', 'paid', 'cancelled']).defaultTo('pending');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ============================================
  // TIER 3: Tables that depend on TIER 2
  // ============================================

  // ACTIVITY LOGS (depends on: users)
  await knex.schema.createTable('activityLogs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('id').inTable('users').notNullable();
    table.string('action').notNullable();
    table.string('entityType');
    table.uuid('entityId');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // ORDERS (depends on: customers, users)
  await knex.schema.createTable('orders', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('orderNumber').unique().notNullable();
    table.uuid('customerId').references('id').inTable('customers').notNullable();
    table.date('orderDate').notNullable();
    table.enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']).defaultTo('pending');
    table.enum('paymentMethod', ['cash', 'card', 'online']).notNullable();
    table.decimal('subtotal').notNullable();
    table.decimal('discountTotal').defaultTo(0);
    table.decimal('totalAmount').notNullable();
    table.uuid('createdById').references('id').inTable('users').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // INVENTORY ENTRIES (depends on: products, batches)
  await knex.schema.createTable('inventoryEntries', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('productId').references('id').inTable('products').notNullable();
    table.uuid('batchId').references('id').inTable('batches').notNullable();
    table.decimal('costPrice').notNullable();
    table.decimal('sellingPrice').notNullable();
    table.integer('quantityReceived').notNullable();
    table.date('expiryDate');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // MESSAGE RECIPIENTS (depends on: messages, users)
  await knex.schema.createTable('messageRecipients', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('messageId').references('id').inTable('messages').notNullable();
    table.uuid('userId').references('id').inTable('users').notNullable();
    table.enum('status', ['sent', 'failed']).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // NOTIFICATIONS (depends on: users)
  await knex.schema.createTable('notifications', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('id').inTable('users').notNullable();
    table.enum('type', ['order', 'inventory', 'expense', 'message']).notNullable();
    table.enum('status', ['unread', 'read']).notNullable();
    table.string('message').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ============================================
  // TIER 4: Tables that depend on TIER 3
  // ============================================

  // ORDER ITEMS (depends on: orders, products)
  await knex.schema.createTable('orderItems', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').notNullable();
    table.uuid('productId').references('id').inTable('products').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('unitPrice').notNullable();
    table.decimal('discount').defaultTo(0);
    table.decimal('totalAmount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ORDER PAYMENTS (depends on: orders)
  await knex.schema.createTable('orderPayments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').notNullable();
    table.enum('paymentMethod', ['cash', 'card', 'online']).notNullable();
    table.decimal('amount').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ORDER DISCOUNTS (depends on: orders, discounts)
  await knex.schema.createTable('orderDiscounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').notNullable();
    table.uuid('discountId').references('id').inTable('discounts').notNullable();
    table.decimal('discountValue').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // INVENTORY MOVEMENTS (depends on: inventoryEntries, orders)
  await knex.schema.createTable('inventoryMovements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('inventoryEntryId').references('id').inTable('inventoryEntries').notNullable();
    table.integer('quantity').notNullable();
    table.enum('movementType', ['in', 'out', 'adjustment']).notNullable();
    table.uuid('referenceId').references('id').inTable('orders');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  // Drop tables in reverse order to handle foreign key dependencies
  // TIER 4
  await knex.schema.dropTableIfExists('inventoryMovements');
  await knex.schema.dropTableIfExists('orderDiscounts');
  await knex.schema.dropTableIfExists('orderPayments');
  await knex.schema.dropTableIfExists('orderItems');

  // TIER 3
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('messageRecipients');
  await knex.schema.dropTableIfExists('inventoryEntries');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('activityLogs');

  // TIER 2
  await knex.schema.dropTableIfExists('expenses');
  await knex.schema.dropTableIfExists('batches');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('users');

  // TIER 1
  await knex.schema.dropTableIfExists('systemSettings');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('expenseCategories');
  await knex.schema.dropTableIfExists('discounts');
  await knex.schema.dropTableIfExists('customers');
  await knex.schema.dropTableIfExists('suppliers');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('roles');
};
