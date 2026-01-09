# Unified Payments Table Guide

## Overview
The `payments` table is a unified ledger that handles ALL financial transactions in the system, including:
- Sales/Order payments
- Inventory purchases
- Operating expenses
- Refunds
- Manual adjustments
- Opening balances

## 💡 **Signed Amount Convention**

**This table uses SIGNED amounts for intuitive accounting:**

- **Positive (+)**: Money coming IN (increases your cash/balance)
  - Customer pays for order: `+150.00`
  - Opening cash balance: `+10000.00`
  
- **Negative (-)**: Money going OUT (decreases your cash/balance)
  - Pay supplier for inventory: `-5000.00`
  - Pay operating expense: `-250.00`
  - Issue refund to customer: `-75.00`

**Benefits:**
- ✅ Simple cash flow: `SELECT SUM(amount) FROM payments`
- ✅ Intuitive: positive = good/cash in, negative = cash out
- ✅ Industry standard (matches bank statements, accounting software)
- ✅ Fewer calculation errors

## Table Schema

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `transactionType` | ENUM | Type of transaction (sale, purchase, expense, refund, adjustment, opening_balance) |
| `paymentMethod` | ENUM | Method used (cash, card, momo, bank_transfer, cheque, other) |
| `amount` | DECIMAL(15,2) | **SIGNED** amount: Positive (+) = money in, Negative (-) = money out |
| `status` | ENUM | Transaction status (pending, completed, failed, cancelled) |
| `referenceId` | UUID | ID of the related entity (order, batch, expense, etc.) |
| `referenceType` | STRING | Type of reference ('order', 'batch', 'expense', 'adjustment') |
| `description` | TEXT | Additional notes or description |
| `transactionReference` | STRING | External reference (bank ID, cheque number, etc.) |
| `processedById` | UUID | User who processed this payment (FK to users) |
| `paymentDate` | TIMESTAMP | When the payment was made |
| `createdAt` | TIMESTAMP | When the record was created |
| `updatedAt` | TIMESTAMP | When the record was last updated |

## Usage Examples

### 1. Recording a Sale Payment (Order)
```javascript
await knex('payments').insert({
  transactionType: 'sale',
  paymentMethod: 'cash',
  amount: 150.00, // POSITIVE: Money coming in
  status: 'completed',
  referenceId: orderId,
  referenceType: 'order',
  description: 'Payment for Order #ORD-001',
  processedById: userId,
  paymentDate: knex.fn.now()
});
```

### 2. Recording an Inventory Purchase
```javascript
await knex('payments').insert({
  transactionType: 'purchase',
  paymentMethod: 'bank_transfer',
  amount: -5000.00, // NEGATIVE: Money going out to supplier
  status: 'completed',
  referenceId: batchId,
  referenceType: 'batch',
  description: 'Payment for Batch #BAT-2024-001',
  transactionReference: 'TXN123456789', // Bank transaction ID
  processedById: userId,
  paymentDate: knex.fn.now()
});
```

### 3. Recording an Expense
```javascript
await knex('payments').insert({
  transactionType: 'expense',
  paymentMethod: 'cash',
  amount: -250.00, // NEGATIVE: Money going out for expense
  status: 'completed',
  referenceId: expenseId,
  referenceType: 'expense',
  description: 'Office supplies - January 2024',
  processedById: userId,
  paymentDate: knex.fn.now()
});
```

### 4. Recording a Refund
```javascript
await knex('payments').insert({
  transactionType: 'refund',
  paymentMethod: 'cash',
  amount: -75.00, // NEGATIVE: Money going out as refund
  status: 'completed',
  referenceId: orderId,
  referenceType: 'order',
  description: 'Refund for returned items - Order #ORD-001',
  processedById: userId,
  paymentDate: knex.fn.now()
});
```

### 5. Recording a Manual Adjustment
```javascript
// Correction - reducing cash (error in your favor)
await knex('payments').insert({
  transactionType: 'adjustment',
  paymentMethod: 'cash',
  amount: -100.00, // NEGATIVE: Reducing cash
  status: 'completed',
  referenceId: null,
  referenceType: 'adjustment',
  description: 'Correction for cash register discrepancy on 2024-01-08',
  processedById: userId,
  paymentDate: knex.fn.now()
});

// Adding found money
await knex('payments').insert({
  transactionType: 'adjustment',
  paymentMethod: 'cash',
  amount: 50.00, // POSITIVE: Adding to cash
  status: 'completed',
  referenceId: null,
  referenceType: 'adjustment',
  description: 'Found cash in register - unaccounted sale',
  processedById: userId,
  paymentDate: knex.fn.now()
});
```

### 6. Recording Opening Balance
```javascript
await knex('payments').insert({
  transactionType: 'opening_balance',
  paymentMethod: 'cash',
  amount: 10000.00, // POSITIVE: Starting cash on hand
  status: 'completed',
  referenceId: null,
  referenceType: 'opening_balance',
  description: 'Cash on hand - January 1, 2024',
  processedById: userId,
  paymentDate: '2024-01-01'
});
```

## Common Queries

### Get Net Cash Flow for a Period (Simple!)
```javascript
// With signed amounts, this is super simple
const result = await knex('payments')
  .where('status', 'completed')
  .whereBetween('paymentDate', [startDate, endDate])
  .sum('amount as netCashFlow');

// netCashFlow will be:
// Positive = You made money
// Negative = You spent more than you earned
```

### Get Total Revenue (Money Coming In)
```javascript
const revenue = await knex('payments')
  .where('status', 'completed')
  .where('amount', '>', 0) // Only positive amounts
  .whereBetween('paymentDate', [startDate, endDate])
  .sum('amount as totalRevenue');
```

### Get Total Expenses + Purchases (Money Going Out)
```javascript
const expenses = await knex('payments')
  .where('status', 'completed')
  .where('amount', '<', 0) // Only negative amounts
  .whereBetween('paymentDate', [startDate, endDate])
  .sum('amount as totalExpenses');

// Note: totalExpenses will be negative (-5000.00)
// To display as positive: Math.abs(totalExpenses)
```

### Get Cash Flow Summary by Transaction Type
```javascript
const cashFlow = await knex('payments')
  .select('transactionType')
  .sum('amount as total')
  .count('* as count')
  .where('status', 'completed')
  .whereBetween('paymentDate', [startDate, endDate])
  .groupBy('transactionType');

// Example result:
// [
//   { transactionType: 'sale', total: 15000.00, count: 50 },
//   { transactionType: 'purchase', total: -8000.00, count: 10 },
//   { transactionType: 'expense', total: -2500.00, count: 15 }
// ]
```

### Get Current Cash Balance
```javascript
const cashBalance = await knex('payments')
  .where('paymentMethod', 'cash')
  .where('status', 'completed')
  .sum('amount as balance');

// This gives you current cash on hand!
// Positive = Cash available
// Negative = Cash deficit (shouldn't happen, but possible with errors)
```

### Get All Payments for a Specific Order
```javascript
const orderPayments = await knex('payments')
  .where('referenceType', 'order')
  .where('referenceId', orderId)
  .whereIn('transactionType', ['sale', 'refund'])
  .orderBy('paymentDate', 'desc');

// Calculate net payment for order:
const netPayment = orderPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
```

### Get Payment Methods Breakdown
```javascript
const methodBreakdown = await knex('payments')
  .select('paymentMethod')
  .sum('amount as total')
  .count('* as count')
  .where('status', 'completed')
  .whereBetween('paymentDate', [startDate, endDate])
  .groupBy('paymentMethod');

// Shows net flow per payment method
```

### Get Daily Cash Movements
```javascript
const dailyMovements = await knex('payments')
  .select(knex.raw('DATE(paymentDate) as date'))
  .sum('amount as netFlow')
  .where('status', 'completed')
  .groupBy(knex.raw('DATE(paymentDate)'))
  .orderBy('date', 'desc');

// Shows daily net cash flow
```

### Get Pending Payments
```javascript
const pendingPayments = await knex('payments')
  .where('status', 'pending')
  .orderBy('paymentDate', 'desc');
```

### Income Statement (Profit/Loss)
```javascript
// Simple profit calculation
const income = await knex('payments')
  .where('status', 'completed')
  .where('transactionType', 'sale')
  .whereBetween('paymentDate', [startDate, endDate])
  .sum('amount as revenue');

const expenses = await knex('payments')
  .where('status', 'completed')
  .whereIn('transactionType', ['purchase', 'expense'])
  .whereBetween('paymentDate', [startDate, endDate])
  .sum('amount as costs');

const profit = parseFloat(income[0].revenue || 0) + parseFloat(expenses[0].costs || 0);
// Note: expenses is already negative, so adding gives profit!
```

## Best Practices

1. **Use Correct Signs**: 
   - Money IN (sales, positive adjustments) = Positive amounts
   - Money OUT (purchases, expenses, refunds) = Negative amounts
2. **Always Set Transaction Type**: Ensure `transactionType` accurately reflects the nature of the payment
3. **Link to References**: Always populate `referenceId` and `referenceType` when applicable
4. **Track Who Processed**: Always set `processedById` for audit trails
5. **Add Descriptions**: Use the `description` field for clarity, especially for adjustments
6. **Use External References**: Store bank transaction IDs, cheque numbers in `transactionReference`
7. **Set Proper Status**: Use 'pending' for transactions that need approval, 'completed' for finalized ones

## Transaction Types Explained

| Type | When to Use | Amount Sign | Example |
|------|-------------|-------------|---------|
| `sale` | Customer pays for an order | **Positive (+)** | `+150.00` |
| `purchase` | You pay supplier for inventory | **Negative (-)** | `-5000.00` |
| `expense` | Operating expenses paid | **Negative (-)** | `-250.00` |
| `refund` | Returning money to customer | **Negative (-)** | `-75.00` |
| `adjustment` | Manual corrections to cash/accounts | **+ or -** | `+50.00` or `-100.00` |
| `opening_balance` | Initial balance when starting system | **+ or -** | `+10000.00` |

### Amount Sign Quick Reference

```
💰 MONEY COMING IN (Positive +)
├── Customer pays for order        → sale: +150.00
├── Found unrecorded cash          → adjustment: +50.00
└── Opening cash balance           → opening_balance: +10000.00

💸 MONEY GOING OUT (Negative -)
├── Pay supplier for inventory     → purchase: -5000.00
├── Pay operating expense          → expense: -250.00
├── Issue customer refund          → refund: -75.00
└── Correct cash overage           → adjustment: -100.00
```

## Audit Trail

Every payment record includes:
- Who processed it (`processedById`)
- When it was created (`createdAt`)
- When it was last modified (`updatedAt`)
- The actual payment date (`paymentDate`)

This provides a complete audit trail for all financial transactions.
