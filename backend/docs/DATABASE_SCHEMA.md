# Database Schema Documentation

**Generated from migration:** `20260104093227_InitialSchema.js`  
**Last Updated:** January 9, 2026

## Table of Contents

- [Overview](#overview)
- [Tier 1: Base Tables](#tier-1-base-tables)
- [Tier 2: Dependent Tables](#tier-2-dependent-tables)
- [Tier 3: Complex Dependencies](#tier-3-complex-dependencies)
- [Tier 4: Junction & Detail Tables](#tier-4-junction--detail-tables)
- [Field Type Reference](#field-type-reference)

---

## Overview

This document describes the database schema for the Stringventory application. Tables are organized in tiers based on their dependencies.

**Key:**

- 🔑 = Primary Key
- 🔗 = Foreign Key
- ⚡ = Unique Constraint
- ✅ = Default Value
- 📊 = Indexed Field

---

## Tier 1: Base Tables

_Tables with no foreign key dependencies_

### 1. `roles`

User role definitions for access control.

| Field         | Type        | Constraints      | Description                          |
| ------------- | ----------- | ---------------- | ------------------------------------ |
| id 🔑         | UUID        | Primary Key      | Auto-generated UUID                  |
| name ⚡       | String(100) | Unique, Not Null | Role name (e.g., "admin", "manager") |
| description   | Text        | Nullable         | Role description                     |
| created_at ✅ | Timestamp   | Default: now()   | Creation timestamp                   |
| updated_at ✅ | Timestamp   | Default: now()   | Last update timestamp                |

---

### 2. `permissions`

System permissions that can be assigned to roles or users.

| Field         | Type        | Constraints      | Description                            |
| ------------- | ----------- | ---------------- | -------------------------------------- |
| id 🔑         | UUID        | Primary Key      | Auto-generated UUID                    |
| key ⚡        | String(100) | Unique, Not Null | Permission key (e.g., "orders.create") |
| description   | Text        | Nullable         | Permission description                 |
| created_at ✅ | Timestamp   | Default: now()   | Creation timestamp                     |
| updated_at ✅ | Timestamp   | Default: now()   | Last update timestamp                  |

---

### 3. `role_permissions`

Junction table linking roles to permissions.

| Field            | Type      | Constraints                   | Description             |
| ---------------- | --------- | ----------------------------- | ----------------------- |
| id 🔑            | UUID      | Primary Key                   | Auto-generated UUID     |
| role_id 🔗       | UUID      | FK → roles.id, Not Null       | Reference to role       |
| permission_id 🔗 | UUID      | FK → permissions.id, Not Null | Reference to permission |
| created_at ✅    | Timestamp | Default: now()                | Creation timestamp      |
| updated_at ✅    | Timestamp | Default: now()                | Last update timestamp   |

**Foreign Keys:**

- `role_id` → `roles.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `permission_id` → `permissions.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

---

### 4. `categories`

Product category definitions.

| Field        | Type        | Constraints      | Description           |
| ------------ | ----------- | ---------------- | --------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID   |
| name ⚡      | String(100) | Unique, Not Null | Category name         |
| description  | Text        | Nullable         | Category description  |
| image        | String(500) | Nullable         | Category image URL    |
| isActive ✅  | Boolean     | Default: true    | Active status         |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp |

---

### 5. `suppliers`

Supplier/vendor information.

| Field        | Type        | Constraints      | Description           |
| ------------ | ----------- | ---------------- | --------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID   |
| name ⚡      | String(200) | Unique, Not Null | Supplier name         |
| phone        | String(50)  | Nullable         | Contact phone number  |
| email        | String(255) | Nullable         | Contact email         |
| address      | Text        | Nullable         | Physical address      |
| isActive ✅  | Boolean     | Default: true    | Active status         |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp |

---

### 6. `paymentMethods`

Available payment methods (cash, card, etc.).

| Field        | Type        | Constraints      | Description           |
| ------------ | ----------- | ---------------- | --------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID   |
| name ⚡      | String(100) | Unique, Not Null | Payment method name   |
| description  | Text        | Nullable         | Method description    |
| isActive ✅  | Boolean     | Default: true    | Active status         |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp |

---

### 7. `customers`

Customer information.

| Field        | Type        | Constraints             | Description           |
| ------------ | ----------- | ----------------------- | --------------------- |
| id 🔑        | UUID        | Primary Key             | Auto-generated UUID   |
| customerName | String(200) | Not Null                | Customer's full name  |
| businessName | String(200) | Nullable                | Business/company name |
| phone        | String(50)  | Nullable                | Contact phone number  |
| email        | String(255) | Nullable                | Contact email         |
| address      | Text        | Nullable                | Physical address      |
| isActive ✅  | Boolean     | Default: true, Not Null | Active status         |
| createdAt ✅ | Timestamp   | Default: now()          | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()          | Last update timestamp |

---

### 8. `discounts`

Discount/promotion definitions.

| Field            | Type          | Constraints      | Description                  |
| ---------------- | ------------- | ---------------- | ---------------------------- |
| id 🔑            | UUID          | Primary Key      | Auto-generated UUID          |
| name ⚡          | String(100)   | Unique, Not Null | Discount name                |
| type             | Enum          | Not Null         | 'percentage' or 'fixed'      |
| discountValue    | Decimal(10,2) | Not Null         | Discount amount/percentage   |
| maxDiscountValue | Decimal(15,2) | Not Null         | Maximum discount cap         |
| numberOfTimes    | Integer       | Not Null         | Usage limit                  |
| scope            | Enum          | Not Null         | 'all' or 'selected' products |
| startDate        | Timestamp     | Not Null         | Start date/time              |
| endDate          | Timestamp     | Not Null         | End date/time                |
| isActive ✅      | Boolean       | Default: true    | Active status                |
| createdAt ✅     | Timestamp     | Default: now()   | Creation timestamp           |
| updatedAt ✅     | Timestamp     | Default: now()   | Last update timestamp        |

**Enums:**

- `type`: `['percentage', 'fixed']`
- `scope`: `['all', 'selected']`

---

### 9. `expenseCategories`

Categories for business expenses.

| Field        | Type        | Constraints      | Description           |
| ------------ | ----------- | ---------------- | --------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID   |
| name ⚡      | String(100) | Unique, Not Null | Category name         |
| isActive ✅  | Boolean     | Default: true    | Active status         |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp |

---

### 10. `systemSettings`

Application configuration settings.

| Field        | Type        | Constraints      | Description           |
| ------------ | ----------- | ---------------- | --------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID   |
| name ⚡      | String(100) | Unique, Not Null | Setting name/key      |
| value        | Text        | Nullable         | Setting value         |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp |

---

## Tier 2: Dependent Tables

_Tables that depend on Tier 1 tables_

### 11. `users`

System user accounts.

| Field            | Type        | Constraints             | Description               |
| ---------------- | ----------- | ----------------------- | ------------------------- |
| id 🔑            | UUID        | Primary Key             | Auto-generated UUID       |
| role_id 🔗       | UUID        | FK → roles.id, Not Null | User's role               |
| firstName        | String(100) | Not Null                | First name                |
| lastName         | String(100) | Not Null                | Last name                 |
| email ⚡         | String(255) | Unique, Not Null        | Email address             |
| phone            | String(50)  | Nullable                | Phone number              |
| password         | String(255) | Not Null                | Hashed password           |
| isActive ✅      | Boolean     | Default: true           | Account active status     |
| mfaEnabled ✅    | Boolean     | Default: false          | MFA enabled flag          |
| emailVerified ✅ | Boolean     | Default: false          | Email verification status |
| lastLoginAt      | Timestamp   | Nullable                | Last login timestamp      |
| createdAt ✅     | Timestamp   | Default: now()          | Creation timestamp        |
| updatedAt ✅     | Timestamp   | Default: now()          | Last update timestamp     |

**Foreign Keys:**

- `role_id` → `roles.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

---

### 12. `unitOfMeasurements`

Units of measurement for products (kg, pcs, liters, etc.).

| Field        | Type        | Constraints      | Description                   |
| ------------ | ----------- | ---------------- | ----------------------------- |
| id 🔑        | UUID        | Primary Key      | Auto-generated UUID           |
| name ⚡      | String(100) | Unique, Not Null | Full name (e.g., "Kilograms") |
| abbreviation | String(20)  | Nullable         | Short form (e.g., "kg")       |
| isActive ✅  | Boolean     | Default: true    | Active status                 |
| createdAt ✅ | Timestamp   | Default: now()   | Creation timestamp            |
| updatedAt ✅ | Timestamp   | Default: now()   | Last update timestamp         |

---

### 13. `products`

Product catalog.

| Field                  | Type          | Constraints                          | Description                    |
| ---------------------- | ------------- | ------------------------------------ | ------------------------------ |
| id 🔑                  | UUID          | Primary Key                          | Auto-generated UUID            |
| productCode ⚡         | String(100)   | Unique, Not Null                     | Internal product code          |
| sku ⚡                 | String(100)   | Unique, Nullable                     | Stock Keeping Unit             |
| barcode ⚡             | String(100)   | Unique, Nullable                     | Barcode/UPC/EAN                |
| name                   | String(200)   | Not Null                             | Product name                   |
| categoryId 🔗          | UUID          | FK → categories.id, Not Null         | Product category               |
| description            | Text          | Nullable                             | Product description            |
| unitOfMeasurementId 🔗 | UUID          | FK → unitOfMeasurements.id, Not Null | Unit of measurement            |
| costPrice              | Decimal(15,2) | Not Null                             | Purchase cost price            |
| retailPrice            | Decimal(15,2) | Not Null                             | Selling price                  |
| image                  | String(500)   | Nullable                             | Primary product image URL      |
| images                 | JSON          | Nullable                             | Array of additional image URLs |
| reorderThreshold ✅    | Integer       | Default: 0                           | Low stock alert level          |
| isActive ✅            | Boolean       | Default: true                        | Active status                  |
| supplierId 🔗          | UUID          | FK → suppliers.id, Not Null          | Default supplier               |
| createdAt ✅           | Timestamp     | Default: now()                       | Creation timestamp             |
| updatedAt ✅           | Timestamp     | Default: now()                       | Last update timestamp          |

**Foreign Keys:**

- `categoryId` → `categories.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `unitOfMeasurementId` → `unitOfMeasurements.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `supplierId` → `suppliers.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

---

### 14. `batches`

Inventory batch/shipment tracking.

| Field          | Type        | Constraints                 | Description             |
| -------------- | ----------- | --------------------------- | ----------------------- |
| id 🔑          | UUID        | Primary Key                 | Auto-generated UUID     |
| batchNumber ⚡ | String(100) | Unique, Not Null            | Batch identifier        |
| waybillNumber  | String(100) | Nullable                    | Shipping waybill number |
| supplierId 🔗  | UUID        | FK → suppliers.id, Not Null | Batch supplier          |
| receivedDate   | Date        | Not Null                    | Date received           |
| notes          | Text        | Nullable                    | Additional notes        |
| status ✅      | Enum        | Default: 'open'             | 'open' or 'closed'      |
| createdAt ✅   | Timestamp   | Default: now()              | Creation timestamp      |
| updatedAt ✅   | Timestamp   | Default: now()              | Last update timestamp   |

**Foreign Keys:**

- `supplierId` → `suppliers.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `status`: `['open', 'closed']`

---

### 15. `expenses`

Business expense records.

| Field                | Type          | Constraints                         | Description              |
| -------------------- | ------------- | ----------------------------------- | ------------------------ |
| id 🔑                | UUID          | Primary Key                         | Auto-generated UUID      |
| expenseCategoryId 🔗 | UUID          | FK → expenseCategories.id, Not Null | Expense category         |
| name                 | String(200)   | Not Null                            | Expense name/description |
| amount               | Decimal(15,2) | Not Null                            | Expense amount           |
| paymentMethodId 🔗   | UUID          | FK → paymentMethods.id, Not Null    | Payment method used      |
| status ✅            | Enum          | Default: 'pending'                  | Payment status           |
| createdAt ✅         | Timestamp     | Default: now()                      | Creation timestamp       |
| updatedAt ✅         | Timestamp     | Default: now()                      | Last update timestamp    |

**Foreign Keys:**

- `expenseCategoryId` → `expenseCategories.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `paymentMethodId` → `paymentMethods.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `status`: `['pending', 'paid', 'cancelled']`

---

## Tier 3: Complex Dependencies

_Tables that depend on Tier 2 tables_

### 16. `user_permissions`

Direct permissions assigned to specific users (overrides role permissions).

| Field           | Type      | Constraints                   | Description           |
| --------------- | --------- | ----------------------------- | --------------------- |
| id 🔑           | UUID      | Primary Key                   | Auto-generated UUID   |
| userId 🔗       | UUID      | FK → users.id, Not Null       | User reference        |
| permissionId 🔗 | UUID      | FK → permissions.id, Not Null | Permission reference  |
| createdAt ✅    | Timestamp | Default: now()                | Creation timestamp    |
| updated_at ✅   | Timestamp | Default: now()                | Last update timestamp |

**Foreign Keys:**

- `userId` → `users.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `permissionId` → `permissions.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

---

### 17. `activityLogs`

Audit trail for user actions.

| Field        | Type        | Constraints             | Description               |
| ------------ | ----------- | ----------------------- | ------------------------- |
| id 🔑        | UUID        | Primary Key             | Auto-generated UUID       |
| userId 🔗    | UUID        | FK → users.id, Not Null | User who performed action |
| action       | String(100) | Not Null                | Action performed          |
| entityType   | String(100) | Nullable                | Type of entity affected   |
| entityId     | UUID        | Nullable                | ID of entity affected     |
| metadata     | JSON        | Nullable                | Additional action data    |
| createdAt ✅ | Timestamp   | Default: now()          | Action timestamp          |

**Foreign Keys:**

- `userId` → `users.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

---

### 18. `bulkMessages`

Bulk messaging records (SMS/Email campaigns).

| Field        | Type        | Constraints    | Description           |
| ------------ | ----------- | -------------- | --------------------- |
| id 🔑        | UUID        | Primary Key    | Auto-generated UUID   |
| subject      | String(500) | Not Null       | Message subject       |
| content      | Text        | Not Null       | Message body          |
| type         | Enum        | Not Null       | 'sms' or 'email'      |
| createdAt ✅ | Timestamp   | Default: now() | Creation timestamp    |
| updatedAt ✅ | Timestamp   | Default: now() | Last update timestamp |

**Enums:**

- `type`: `['sms', 'email']`

---

### 19. `orders`

Customer order headers.

| Field                | Type          | Constraints                      | Description                        |
| -------------------- | ------------- | -------------------------------- | ---------------------------------- |
| id 🔑                | UUID          | Primary Key                      | Auto-generated UUID                |
| orderNumber ⚡       | String(100)   | Unique, Not Null                 | Order number                       |
| customerId 🔗        | UUID          | FK → customers.id, Not Null      | Customer reference                 |
| orderDate            | Date          | Not Null                         | Order date                         |
| status ✅            | Enum          | Default: 'pending'               | Order status                       |
| paymentMethodId 🔗   | UUID          | FK → paymentMethods.id, Not Null | Payment method                     |
| subtotal             | Decimal(15,2) | Not Null                         | Subtotal before discounts/shipping |
| discountTotal ✅     | Decimal(15,2) | Default: 0                       | Total discounts applied            |
| shippingCost ✅      | Decimal(15,2) | Default: 0                       | Shipping/delivery cost             |
| totalAmount          | Decimal(15,2) | Not Null                         | Final total amount                 |
| shippingAddress      | Text          | Nullable                         | Delivery address                   |
| expectedDeliveryDate | Date          | Nullable                         | Expected delivery date             |
| actualDeliveryDate   | Date          | Nullable                         | Actual delivery date               |
| notes                | Text          | Nullable                         | Order notes                        |
| createdById 🔗       | UUID          | FK → users.id, Not Null          | User who created order             |
| createdAt ✅         | Timestamp     | Default: now()                   | Creation timestamp                 |
| updatedAt ✅         | Timestamp     | Default: now()                   | Last update timestamp              |

**Foreign Keys:**

- `customerId` → `customers.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `paymentMethodId` → `paymentMethods.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `createdById` → `users.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `status`: `['pending', 'paid', 'shipped', 'delivered', 'cancelled']`

---

### 20. `purchases`

Purchase order headers (inventory purchases).

| Field               | Type          | Constraints               | Description                        |
| ------------------- | ------------- | ------------------------- | ---------------------------------- |
| id 🔑               | UUID          | Primary Key               | Auto-generated UUID                |
| waybillNumber ⚡ 📊 | String(100)   | Unique, Not Null          | Purchase/waybill number            |
| purchaseDate 📊 ✅  | Date          | Default: now(), Not Null  | Purchase date                      |
| batchId 🔗 📊       | UUID          | FK → batches.id, Nullable | Associated batch                   |
| subtotal            | Decimal(15,2) | Not Null                  | Sum of all items                   |
| discount ✅         | Decimal(15,2) | Default: 0                | Discount applied                   |
| totalAmount         | Decimal(15,2) | Not Null                  | Final amount (subtotal - discount) |
| invoiceNumber       | String(100)   | Nullable                  | Supplier invoice number            |
| notes               | Text          | Nullable                  | Purchase notes                     |
| status 📊 ✅        | Enum          | Default: 'pending'        | Purchase status                    |
| receivedDate        | Date          | Nullable                  | Date goods received                |
| createdById 🔗      | UUID          | FK → users.id, Not Null   | User who created purchase          |
| createdAt ✅        | Timestamp     | Default: now()            | Creation timestamp                 |
| updatedAt ✅        | Timestamp     | Default: now()            | Last update timestamp              |

**Foreign Keys:**

- `batchId` → `batches.id` (ON DELETE SET NULL, ON UPDATE CASCADE)
- `createdById` → `users.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `status`: `['pending', 'received', 'partial', 'cancelled']`

**Indexes:**

- `purchaseDate`
- `batchId`
- `status`

---

### 21. `discountProducts`

Products eligible for specific discounts.

| Field          | Type      | Constraints                 | Description           |
| -------------- | --------- | --------------------------- | --------------------- |
| id 🔑          | UUID      | Primary Key                 | Auto-generated UUID   |
| discount_id 🔗 | UUID      | FK → discounts.id, Not Null | Discount reference    |
| product_id 🔗  | UUID      | FK → products.id, Not Null  | Product reference     |
| createdAt ✅   | Timestamp | Default: now()              | Creation timestamp    |
| updatedAt ✅   | Timestamp | Default: now()              | Last update timestamp |

**Foreign Keys:**

- `discount_id` → `discounts.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `product_id` → `products.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

---

### 22. `inventoryEntries`

FIFO inventory tracking entries.

| Field              | Type          | Constraints                | Description                     |
| ------------------ | ------------- | -------------------------- | ------------------------------- |
| id 🔑              | UUID          | Primary Key                | Auto-generated UUID             |
| productId 🔗 📊    | UUID          | FK → products.id, Not Null | Product reference               |
| batchId 🔗         | UUID          | FK → batches.id, Not Null  | Batch reference                 |
| costPrice          | Decimal(15,2) | Not Null                   | Cost per unit                   |
| sellingPrice       | Decimal(15,2) | Not Null                   | Selling price per unit          |
| quantityReceived   | Integer       | Not Null                   | Original quantity received      |
| currentQuantity 📊 | Integer       | Not Null                   | Remaining quantity (FIFO)       |
| expiryDate         | Date          | Nullable                   | Expiration date (if applicable) |
| createdAt ✅ 📊    | Timestamp     | Default: now()             | Creation timestamp              |
| updatedAt ✅       | Timestamp     | Default: now()             | Last update timestamp           |

**Foreign Keys:**

- `productId` → `products.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `batchId` → `batches.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Indexes:**

- `productId`, `createdAt` (for FIFO queries)
- `currentQuantity` (for finding available inventory)

---

### 23. `messageRecipients`

Recipients of bulk messages.

| Field        | Type      | Constraints                | Description           |
| ------------ | --------- | -------------------------- | --------------------- |
| id 🔑        | UUID      | Primary Key                | Auto-generated UUID   |
| messageId 🔗 | UUID      | FK → messages.id, Not Null | Message reference     |
| userId 🔗    | UUID      | FK → users.id, Not Null    | Recipient user        |
| status       | Enum      | Not Null                   | Delivery status       |
| createdAt ✅ | Timestamp | Default: now()             | Creation timestamp    |
| updatedAt ✅ | Timestamp | Default: now()             | Last update timestamp |

**Foreign Keys:**

- `messageId` → `messages.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `userId` → `users.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

**Enums:**

- `status`: `['sent', 'failed']`

**Note:** References `messages` table which doesn't exist in migration - possible schema issue.

---

### 24. `notifications`

User notifications.

| Field        | Type      | Constraints             | Description                  |
| ------------ | --------- | ----------------------- | ---------------------------- |
| id 🔑        | UUID      | Primary Key             | Auto-generated UUID          |
| userId 🔗    | UUID      | FK → users.id, Not Null | User receiving notification  |
| type         | Enum      | Not Null                | Notification type            |
| status       | Enum      | Not Null                | Read/unread status           |
| message      | Text      | Not Null                | Notification message         |
| metadata     | JSON      | Nullable                | Additional notification data |
| createdAt ✅ | Timestamp | Default: now()          | Creation timestamp           |
| updatedAt ✅ | Timestamp | Default: now()          | Last update timestamp        |

**Foreign Keys:**

- `userId` → `users.id` (ON DELETE CASCADE, ON UPDATE CASCADE)

**Enums:**

- `type`: `['order', 'inventory', 'expense', 'message']`
- `status`: `['unread', 'read']`

---

## Tier 4: Junction & Detail Tables

_Tables that depend on Tier 3 tables_

### 25. `orderItems`

Line items for orders.

| Field        | Type          | Constraints                | Description              |
| ------------ | ------------- | -------------------------- | ------------------------ |
| id 🔑        | UUID          | Primary Key                | Auto-generated UUID      |
| orderId 🔗   | UUID          | FK → orders.id, Not Null   | Order reference          |
| productId 🔗 | UUID          | FK → products.id, Not Null | Product reference        |
| quantity     | Integer       | Not Null                   | Quantity ordered         |
| unitPrice    | Decimal(15,2) | Not Null                   | Selling price per unit   |
| discount ✅  | Decimal(15,2) | Default: 0                 | Discount per item        |
| totalAmount  | Decimal(15,2) | Not Null                   | Total for this line item |
| createdAt ✅ | Timestamp     | Default: now()             | Creation timestamp       |
| updatedAt ✅ | Timestamp     | Default: now()             | Last update timestamp    |

**Foreign Keys:**

- `orderId` → `orders.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `productId` → `products.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

---

### 26. `transactions`

Unified financial transaction ledger.

**Amount Convention:**

- **Positive (+)** = Money IN (revenue, refunds received)
- **Negative (-)** = Money OUT (purchases, expenses, refunds issued)

| Field                | Type          | Constraints                      | Description                        |
| -------------------- | ------------- | -------------------------------- | ---------------------------------- |
| id 🔑                | UUID          | Primary Key                      | Auto-generated UUID                |
| transactionType 📊   | Enum          | Not Null                         | Type of transaction                |
| paymentMethodId 🔗   | UUID          | FK → paymentMethods.id, Not Null | Payment method used                |
| amount               | Decimal(15,2) | Not Null                         | Signed amount (+ in, - out)        |
| status ✅            | Enum          | Default: 'completed'             | Transaction status                 |
| referenceId 📊       | UUID          | Nullable                         | Related entity ID (no FK)          |
| referenceType 📊     | String(50)    | Nullable                         | Related entity type                |
| description          | Text          | Nullable                         | Transaction notes                  |
| transactionReference | String(200)   | Nullable                         | External reference (bank ID, etc.) |
| processedById 🔗     | UUID          | FK → users.id, Not Null          | User who processed                 |
| paymentDate 📊 ✅    | Timestamp     | Default: now()                   | Payment date/time                  |
| createdAt ✅         | Timestamp     | Default: now()                   | Creation timestamp                 |
| updatedAt ✅         | Timestamp     | Default: now()                   | Last update timestamp              |

**Foreign Keys:**

- `paymentMethodId` → `paymentMethods.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `processedById` → `users.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `transactionType`: `['sale', 'purchase', 'expense', 'refund', 'adjustment', 'opening_balance']`
- `status`: `['pending', 'completed', 'failed', 'cancelled']`

**Indexes:**

- `transactionType`
- `referenceId`, `referenceType`
- `paymentDate`

---

### 27. `orderDiscounts`

Discounts applied to orders.

| Field         | Type          | Constraints                 | Description                    |
| ------------- | ------------- | --------------------------- | ------------------------------ |
| id 🔑         | UUID          | Primary Key                 | Auto-generated UUID            |
| orderId 🔗    | UUID          | FK → orders.id, Not Null    | Order reference                |
| discountId 🔗 | UUID          | FK → discounts.id, Not Null | Discount reference             |
| discountValue | Decimal(15,2) | Not Null                    | Actual discount amount applied |
| createdAt ✅  | Timestamp     | Default: now()              | Creation timestamp             |
| updatedAt ✅  | Timestamp     | Default: now()              | Last update timestamp          |

**Foreign Keys:**

- `orderId` → `orders.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `discountId` → `discounts.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

---

### 28. `purchaseItems`

Line items for purchase orders.

| Field            | Type          | Constraints                 | Description                      |
| ---------------- | ------------- | --------------------------- | -------------------------------- |
| id 🔑            | UUID          | Primary Key                 | Auto-generated UUID              |
| purchaseId 🔗 📊 | UUID          | FK → purchases.id, Not Null | Purchase order reference         |
| productId 🔗 📊  | UUID          | FK → products.id, Not Null  | Product reference                |
| supplierId 🔗 📊 | UUID          | FK → suppliers.id, Not Null | Supplier for this item           |
| quantity         | Integer       | Not Null                    | Quantity purchased               |
| unitCost         | Decimal(15,2) | Not Null                    | Cost per unit                    |
| totalCost        | Decimal(15,2) | Not Null                    | Total cost (quantity × unitCost) |
| sellingPrice     | Decimal(15,2) | Nullable                    | Optional selling price override  |
| expiryDate       | Date          | Nullable                    | Expiration date (perishables)    |
| notes            | Text          | Nullable                    | Item-specific notes              |
| createdAt ✅     | Timestamp     | Default: now()              | Creation timestamp               |
| updatedAt ✅     | Timestamp     | Default: now()              | Last update timestamp            |

**Foreign Keys:**

- `purchaseId` → `purchases.id` (ON DELETE CASCADE, ON UPDATE CASCADE)
- `productId` → `products.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `supplierId` → `suppliers.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Indexes:**

- `purchaseId`
- `productId`
- `supplierId`

---

### 29. `inventoryMovements`

Tracks all inventory in/out/adjustment movements.

| Field               | Type       | Constraints                        | Description               |
| ------------------- | ---------- | ---------------------------------- | ------------------------- |
| id 🔑               | UUID       | Primary Key                        | Auto-generated UUID       |
| inventoryEntryId 🔗 | UUID       | FK → inventoryEntries.id, Not Null | Inventory entry affected  |
| quantity            | Integer    | Not Null                           | Quantity moved (+ or -)   |
| movementType        | Enum       | Not Null                           | Type of movement          |
| referenceId         | UUID       | Nullable                           | Related entity ID (no FK) |
| referenceType       | String(50) | Nullable                           | Related entity type       |
| notes               | Text       | Nullable                           | Reason/notes for movement |
| createdAt ✅        | Timestamp  | Default: now()                     | Movement timestamp        |
| updatedAt ✅        | Timestamp  | Default: now()                     | Last update timestamp     |

**Foreign Keys:**

- `inventoryEntryId` → `inventoryEntries.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Enums:**

- `movementType`: `['in', 'out', 'adjustment']`

---

## Field Type Reference

### Common Data Types

| Type         | Description                                  | Example Values                           |
| ------------ | -------------------------------------------- | ---------------------------------------- |
| UUID         | Universal Unique Identifier                  | `550e8400-e29b-41d4-a716-446655440000`   |
| String(n)    | Variable character string (max n)            | `"Product Name"`                         |
| Text         | Unlimited text                               | Long descriptions                        |
| Integer      | Whole number                                 | `42`, `-17`                              |
| Decimal(m,n) | Decimal with m total digits, n after decimal | `1234.56`                                |
| Boolean      | True/false                                   | `true`, `false`                          |
| Date         | Date only                                    | `2026-01-09`                             |
| Timestamp    | Date and time                                | `2026-01-09 17:05:13`                    |
| JSON         | JSON object/array                            | `{"key": "value"}`, `["item1", "item2"]` |
| Enum         | Restricted set of values                     | `'pending'`, `'completed'`               |

---

## Important Notes for Frontend Developers

### 1. **FIFO Inventory System**

- Products are tracked through `inventoryEntries` linked to `batches`
- When selling, use oldest inventory first (order by `createdAt` ASC)
- Check `currentQuantity` > 0 for available stock
- `inventoryMovements` logs all stock changes

### 2. **Transaction Sign Convention**

In the `transactions` table:

- **Positive amounts** = money coming in (sales, refunds received)
- **Negative amounts** = money going out (purchases, expenses, refunds issued)

### 3. **Flexible References**

Tables like `transactions` and `inventoryMovements` use flexible references:

- `referenceId` (UUID) + `referenceType` (string)
- No foreign key constraint - can reference any entity
- Common types: `'order'`, `'batch'`, `'expense'`, `'adjustment'`

### 4. **Naming Conventions**

The schema uses mixed naming conventions:

- **camelCase**: Most Tier 1 tables (`createdAt`, `isActive`, `categoryId`)
- **snake_case**: Auth-related tables (`role_id`, `created_at`)
- Be consistent with the actual database field names when making API calls

### 5. **Potential Schema Issues**

- `messageRecipients` table references `messages.id` but no `messages` table exists
- May need to reference `bulkMessages` instead or create separate `messages` table

### 6. **Cascade Behaviors**

Pay attention to `ON DELETE` behaviors:

- **CASCADE**: Child records deleted automatically
- **RESTRICT**: Cannot delete if child records exist
- **SET NULL**: Foreign key set to null on parent deletion

### 7. **Default Values**

Many fields have default values - you may not need to send them:

- Timestamps: Auto-populated
- Booleans: Typically `true` or `false` defaults
- UUIDs: Auto-generated
- Status fields: Usually default to initial state

---

**End of Database Schema Documentation**
