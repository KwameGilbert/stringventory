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
    table.string('name', 100).unique().notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // PERMISSIONS
  await knex.schema.createTable('permissions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key', 100).unique().notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // ROLE PERMISSIONS
  await knex.schema.createTable('role_permissions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('permission_id').references('id').inTable('permissions').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // PRODUCT CATEGORIES
  await knex.schema.createTable('categories', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.text('description');
    table.string('image', 500);
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // PRODUCT SUPPLIERS
  await knex.schema.createTable('suppliers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 200).unique().notNullable();
    table.string('phone', 50);
    table.string('email', 255);
    table.text('address');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // PAYMENT METHODS
  await knex.schema.createTable('paymentMethods', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.text('description');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // CUSTOMERS
  await knex.schema.createTable('customers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('customerName', 200).notNullable();
    table.string('businessName', 200);
    table.string('phone', 50);
    table.string('email', 255);
    table.text('address');
    table.boolean('isActive').defaultTo(true).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // DISCOUNTS
  await knex.schema.createTable('discounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.enum('type', ['percentage', 'fixed']).notNullable();
    table.decimal('discountValue', 10, 2).notNullable();
    table.decimal('maxDiscountValue', 15, 2).notNullable();
    table.integer('numberOfTimes').notNullable();
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
    table.string('name', 100).unique().notNullable();
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // SYSTEM SETTINGS
  await knex.schema.createTable('systemSettings', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.text('value').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
 
  // ============================================
  // TIER 2: Tables that depend on TIER 1
  // ============================================

  // USERS (depends on: roles)
  await knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('id').inTable('roles').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.string('firstName', 100).notNullable();
    table.string('lastName', 100).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('phone', 50);
    table.string('password', 255).notNullable();
    table.boolean('isActive').defaultTo(true);
    table.boolean('mfaEnabled').defaultTo(false);
    table.boolean('emailVerified').defaultTo(false);
    table.timestamp('lastLoginAt');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  }); 

  // UNITS OF MEASUREMENT
  await knex.schema.createTable('unitOfMeasurements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).unique().notNullable();
    table.string('abbreviation', 20); // e.g., 'kg', 'lbs', 'pcs'
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // PRODUCTS (depends on: categories, suppliers, unitOfMeasurements)
  await knex.schema.createTable('products', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('productCode', 100).unique().notNullable();
    table.string('sku', 100).unique(); // Stock Keeping Unit
    table.string('barcode', 100).unique(); // Barcode/UPC/EAN
    table.string('name', 200).notNullable();
    table.uuid('categoryId').references('id').inTable('categories').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.text('description');
    table.uuid('unitOfMeasurementId').references('id').inTable('unitOfMeasurements').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.decimal('costPrice', 15, 2).notNullable();
    table.decimal('retailPrice', 15, 2).notNullable();
    table.string('image', 500); 
    table.json('images'); 
    table.integer('reorderThreshold').defaultTo(0);
    table.boolean('isActive').defaultTo(true);
    table.uuid('supplierId').references('id').inTable('suppliers').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // BATCHES (depends on: suppliers, products)
  await knex.schema.createTable('batches', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('batchNumber', 100).unique().notNullable();
    table.string('waybillNumber', 100);
    table.uuid('supplierId').references('id').inTable('suppliers').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('receivedDate').notNullable();
    table.text('notes');
    table.enum('status', ['open', 'closed']).defaultTo('open');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // EXPENSES (depends on: expenseCategories)
  await knex.schema.createTable('expenses', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('expenseCategoryId').references('id').inTable('expenseCategories').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.string('name', 200).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.uuid('paymentMethodId').references('id').inTable('paymentMethods').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.enum('status', ['pending', 'paid', 'cancelled']).defaultTo('pending');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ============================================
  // TIER 3: Tables that depend on TIER 2
  // ============================================

  // USER PERMISSIONS (depends on: users, permissions)
  await knex.schema.createTable('user_permissions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('permissionId').references('id').inTable('permissions').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ACTIVITY LOGS (depends on: users)
  await knex.schema.createTable('activityLogs', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.string('action', 100).notNullable();
    table.string('entityType', 100);
    table.uuid('entityId');
    table.json('metadata'); 
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  // BULK MESSAGES (depends on: users)
  await knex.schema.createTable('bulkMessages', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('subject', 500).notNullable();
    table.text('content').notNullable();
    table.enum('type', ['sms', 'email']).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ORDERS (depends on: customers, users)
  await knex.schema.createTable('orders', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('orderNumber', 100).unique().notNullable();
    table.uuid('customerId').references('id').inTable('customers').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.date('orderDate').notNullable();
    table.enum('status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']).defaultTo('pending');
    table.uuid('paymentMethodId').references('id').inTable('paymentMethods').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.decimal('subtotal', 15, 2).notNullable();
    table.decimal('discountTotal', 15, 2).defaultTo(0);
    table.decimal('shippingCost', 15, 2).defaultTo(0);
    table.decimal('totalAmount', 15, 2).notNullable();
    table.text('shippingAddress'); 
    table.date('expectedDeliveryDate');
    table.date('actualDeliveryDate');
    table.text('notes'); 
    table.uuid('createdById').references('id').inTable('users').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // PURCHASES - Header table for purchase transactions (depends on: batches, users)
  await knex.schema.createTable('purchases', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('waybillNumber', 100).unique().notNullable(); // e.g., PUR-2024-001
    table.date('purchaseDate').notNullable().defaultTo(knex.fn.now());
    table.uuid('batchId').references('id').inTable('batches').onDelete('SET NULL').onUpdate('CASCADE').nullable(); 
    table.decimal('subtotal', 15, 2).notNullable(); // Sum of all items
    table.decimal('discount', 15, 2).defaultTo(0); // Any discount applied
    table.decimal('totalAmount', 15, 2).notNullable(); // subtotal - discount
    table.string('invoiceNumber', 100).nullable(); // Invoice/receipt number
    table.text('notes').nullable();
    table.enum('status', ['pending', 'received', 'partial', 'cancelled']).defaultTo('pending');
    table.date('receivedDate').nullable(); 
    table.uuid('createdById').references('id').inTable('users').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
 
    // Indexes
    table.index(['purchaseDate']);
    table.index(['batchId']);
    table.index(['status']);
  });

  // DISCOUNT PRODUCTS (depends on: discounts, products)
  await knex.schema.createTable('discountProducts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('discount_id').references('id').inTable('discounts').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // INVENTORY ENTRIES (depends on: products, batches)
  await knex.schema.createTable('inventoryEntries', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('productId').references('id').inTable('products').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.uuid('batchId').references('id').inTable('batches').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.decimal('costPrice', 15, 2).notNullable();
    table.decimal('sellingPrice', 15, 2).notNullable();
    table.integer('quantityReceived').notNullable(); // Original quantity received
    table.integer('currentQuantity').notNullable(); // Remaining quantity (for FIFO tracking)
    table.date('expiryDate');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes for FIFO queries (oldest first)
    table.index(['productId', 'createdAt']);
    table.index(['currentQuantity']); // For finding available inventory
  });

  // MESSAGE RECIPIENTS (depends on: messages, users)
  await knex.schema.createTable('messageRecipients', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('messageId').references('id').inTable('messages').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.enum('status', ['sent', 'failed']).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // NOTIFICATIONS (depends on: users)
  await knex.schema.createTable('notifications', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.enum('type', ['order', 'inventory', 'expense', 'message']).notNullable();
    table.enum('status', ['unread', 'read']).notNullable();
    table.text('message').notNullable();
    table.json('metadata'); // Additional notification data
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // ============================================
  // TIER 4: Tables that depend on TIER 3
  // ============================================

  // ORDER ITEMS (depends on: orders, products)
  await knex.schema.createTable('orderItems', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('productId').references('id').inTable('products').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('unitPrice', 15, 2).notNullable(); // Selling price
    table.decimal('discount', 15, 2).defaultTo(0);
    table.decimal('totalAmount', 15, 2).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // TRANSACTIONS - Unified table for all financial transactions (depends on: users)
  // SIGNED AMOUNTS: Positive (+) = Money IN, Negative (-) = Money OUT
  await knex.schema.createTable('transactions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Transaction classification
    table.enum('transactionType', [
      'sale',           // Payment received from customer (amount: positive)
      'purchase',       // Payment made to supplier for inventory (amount: negative)
      'expense',        // Payment made for operating expense (amount: negative)
      'refund',         // Refund issued to customer (amount: negative)
      'adjustment',     // Manual adjustment (amount: positive or negative)
      'opening_balance' // Opening balance entry (amount: positive or negative)
    ]).notNullable();
    
    // Payment details
    table.uuid('paymentMethodId').references('id').inTable('paymentMethods').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.decimal('amount', 15, 2).notNullable(); // SIGNED: Positive = money in, Negative = money out
    table.enum('status', ['pending', 'completed', 'failed', 'cancelled']).defaultTo('completed');
    
    // Reference to related entity (flexible reference)
    table.uuid('referenceId').nullable(); // Can reference orders, batches, expenses, etc.
    table.string('referenceType', 50).nullable(); // e.g., 'order', 'batch', 'expense', 'adjustment'
    
    // Additional information
    table.text('description').nullable(); // For adjustments or additional notes
    table.string('transactionReference', 200).nullable(); // External reference (e.g., bank transaction ID, cheque number)
    
    // Who processed this payment
    table.uuid('processedById').references('id').inTable('users').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    
    // Timestamps
    table.timestamp('paymentDate').defaultTo(knex.fn.now());
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes for better query performance
    table.index(['transactionType']);
    table.index(['referenceId', 'referenceType']);
    table.index(['paymentDate']);
  });

  // ORDER DISCOUNTS (depends on: orders, discounts)
  await knex.schema.createTable('orderDiscounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('orderId').references('id').inTable('orders').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('discountId').references('id').inTable('discounts').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.decimal('discountValue', 15, 2).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  // PURCHASE ITEMS - Detail table for products in each purchase (depends on: purchases, products, suppliers)
  await knex.schema.createTable('purchaseItems', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('purchaseId').references('id').inTable('purchases').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    table.uuid('productId').references('id').inTable('products').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.uuid('supplierId').references('id').inTable('suppliers').onDelete('RESTRICT').onUpdate('CASCADE').notNullable(); // Each product has its own supplier
    
    // Quantity and pricing per product
    table.integer('quantity').notNullable();
    table.decimal('unitCost', 15, 2).notNullable(); // Cost per unit for this product
    table.decimal('totalCost', 15, 2).notNullable(); // quantity * unitCost
    
    // Optional selling price override (otherwise use product's retail price)
    table.decimal('sellingPrice', 15, 2).nullable();
    
    // Perishable item tracking
    table.date('expiryDate').nullable(); // For items with expiration dates
    
    // Item-specific notes
    table.text('notes').nullable();
    
    // Timestamps
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['purchaseId']);
    table.index(['productId']);
    table.index(['supplierId']);
  });

  // INVENTORY MOVEMENTS (depends on: inventoryEntries, orders)
  await knex.schema.createTable('inventoryMovements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('inventoryEntryId').references('id').inTable('inventoryEntries').onDelete('RESTRICT').onUpdate('CASCADE').notNullable();
    table.integer('quantity').notNullable();
    table.enum('movementType', ['in', 'out', 'adjustment']).notNullable();
    table.uuid('referenceId').nullable(); // Flexible reference - no FK constraint
    table.string('referenceType', 50).nullable(); // e.g., 'order', 'adjustment', 'damage', 'return'
    table.text('notes').nullable(); // Reason for movement
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
  await knex.schema.dropTableIfExists('purchaseItems');
  await knex.schema.dropTableIfExists('orderDiscounts');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('orderItems');

  // TIER 3
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('messageRecipients');
  await knex.schema.dropTableIfExists('inventoryEntries');
  await knex.schema.dropTableIfExists('discountProducts');
  await knex.schema.dropTableIfExists('purchases');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('activityLogs');
  await knex.schema.dropTableIfExists('user_permissions');

  // TIER 2
  await knex.schema.dropTableIfExists('expenses');
  await knex.schema.dropTableIfExists('batches');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('unitOfMeasurements');
  await knex.schema.dropTableIfExists('users');

  // TIER 1
  await knex.schema.dropTableIfExists('systemSettings');
  await knex.schema.dropTableIfExists('expenseCategories');
  await knex.schema.dropTableIfExists('discounts');
  await knex.schema.dropTableIfExists('customers');
  await knex.schema.dropTableIfExists('paymentMethods');
  await knex.schema.dropTableIfExists('suppliers');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
};
