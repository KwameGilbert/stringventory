# Inventory Management & P/L Reporting Guide
## Standard Costing with Quantity Tracking

## Overview
Your system uses **Standard Costing** where:
- ✅ **Product cost** is maintained in `products.costPrice`
- ✅ **Each purchase updates** the product's cost price
- ✅ **Quantities tracked per batch** in `inventoryEntries`
- ✅ **Sales use current product cost** for COGS calculations

---

## 1. How the System Works

### Purchase Flow

#### Step 1: Receive New Inventory
```javascript
// Example: Purchase 100 units of Product A at $50 each

// 1. Create purchase record
INSERT INTO purchases (waybillNumber, purchaseDate, totalAmount, createdById)
VALUES ('PUR-2024-001', '2024-01-15', 5000.00, 'user-uuid');

// 2. Add purchase items
INSERT INTO purchaseItems (purchaseId, productId, supplierId, quantity, unitCost, totalCost)
VALUES ('purchase-uuid', 'product-a-uuid', 'supplier-uuid', 100, 50.00, 5000.00);

// 3. Update product's cost price (IMPORTANT!)
UPDATE products 
SET costPrice = 50.00,      -- ✅ New cost overwrites old cost
    updatedAt = NOW()
WHERE id = 'product-a-uuid';

// 4. Create inventory entry for quantity tracking
INSERT INTO inventoryEntries (
  productId, 
  batchId, 
  costPrice,          -- Store for reference (but won't use for COGS)
  sellingPrice,
  quantityReceived,
  currentQuantity     -- ✅ This tracks remaining stock
)
VALUES (
  'product-a-uuid',
  'batch-uuid',
  50.00,
  75.00,
  100,
  100                 -- ✅ Starts equal to quantityReceived
);
```

#### Step 2: When Cost Changes with New Purchase
```javascript
// Later purchase: 50 more units at NEW cost $55 each

// 1. Create new purchase
INSERT INTO purchases (waybillNumber, purchaseDate, totalAmount, createdById)
VALUES ('PUR-2024-002', '2024-01-20', 2750.00, 'user-uuid');

// 2. Add purchase items
INSERT INTO purchaseItems (purchaseId, productId, supplierId, quantity, unitCost, totalCost)
VALUES ('purchase-uuid-2', 'product-a-uuid', 'supplier-uuid', 50, 55.00, 2750.00);

// 3. UPDATE product cost to new price
UPDATE products 
SET costPrice = 55.00,      -- ✅ Updated to latest cost
    updatedAt = NOW()
WHERE id = 'product-a-uuid';

// 4. Create new inventory entry
INSERT INTO inventoryEntries (
  productId, 
  batchId,
  costPrice,
  sellingPrice,
  quantityReceived,
  currentQuantity
)
VALUES (
  'product-a-uuid',
  'batch-uuid-2',
  55.00,
  75.00,
  50,
  50
);
```

**Result:**
- Product A now has cost = $55 ✅
- Total available: 100 units (from batch 1) + 50 units (from batch 2) = 150 units
- All future sales will use $55 as COGS ✅

---

### Sales Flow

#### Making a Sale
```javascript
// Customer orders 30 units

// 1. Get current product cost for COGS
SELECT costPrice, retailPrice FROM products WHERE id = 'product-a-uuid';
// Result: costPrice = $55 (latest cost)

// 2. Create order
INSERT INTO orders (orderNumber, customerId, orderDate, totalAmount, createdById)
VALUES ('ORD-2024-001', 'customer-uuid', '2024-01-25', 2250.00, 'user-uuid');

// 3. Create order item (using current product cost)
INSERT INTO orderItems (
  orderId, 
  productId, 
  quantity, 
  unitPrice,        -- Selling price
  totalAmount
)
VALUES (
  'order-uuid',
  'product-a-uuid',
  30,
  75.00,            -- Selling price
  2250.00           -- 30 × $75
);

// 4. Reduce inventory quantities (oldest first for quantity tracking)
-- Find oldest batch with stock
SELECT id, currentQuantity FROM inventoryEntries
WHERE productId = 'product-a-uuid' 
  AND currentQuantity > 0
ORDER BY createdAt ASC
LIMIT 1;

-- Reduce from oldest batch first
UPDATE inventoryEntries
SET currentQuantity = currentQuantity - 30
WHERE id = 'oldest-batch-id';

// COGS Calculation (for P&L):
// COGS = quantity × products.costPrice
// COGS = 30 × $55 = $1,650
// Profit = Revenue - COGS = $2,250 - $1,650 = $600
```

---

## 2. View Products by Waybill Number

### Get Purchase Details
```sql
-- Summary
SELECT 
  p.waybillNumber,
  p.purchaseDate,
  p.invoiceNumber,
  p.subtotal,
  p.totalAmount,
  p.status,
  COUNT(DISTINCT pi.productId) AS totalProducts,
  SUM(pi.quantity) AS totalUnits
FROM purchases p
LEFT JOIN purchaseItems pi ON p.id = pi.purchaseId
WHERE p.waybillNumber = 'PUR-2024-001'
GROUP BY p.id;
```

### Get All Products in Purchase
```sql
SELECT 
  p.waybillNumber,
  p.purchaseDate,
  prod.name AS productName,
  prod.productCode,
  prod.sku,
  s.name AS supplierName,
  pi.quantity,
  pi.unitCost,
  pi.totalCost,
  c.name AS category
FROM purchases p
JOIN purchaseItems pi ON p.id = pi.purchaseId
JOIN products prod ON pi.productId = prod.id
JOIN suppliers s ON pi.supplierId = s.id
JOIN categories c ON prod.categoryId = c.id
WHERE p.waybillNumber = 'PUR-2024-001'
ORDER BY prod.name;
```

---

## 3. Profit & Loss (P&L) Reporting

### Daily P&L
```sql
SELECT 
  DATE(o.orderDate) AS date,
  
  -- Revenue
  SUM(o.totalAmount) AS revenue,
  
  -- COGS (using current product cost at time of query)
  SUM(oi.quantity * p.costPrice) AS cogs,
  
  -- Gross Profit
  SUM(o.totalAmount) - SUM(oi.quantity * p.costPrice) AS grossProfit,
  
  -- Gross Margin %
  ((SUM(o.totalAmount) - SUM(oi.quantity * p.costPrice)) / SUM(o.totalAmount) * 100) AS grossMarginPct,
  
  -- Operating Expenses
  (SELECT SUM(amount) 
   FROM expenses 
   WHERE DATE(createdAt) = DATE(o.orderDate) 
   AND status = 'paid') AS operatingExpenses,
  
  -- Net Profit
  SUM(o.totalAmount) - SUM(oi.quantity * p.costPrice) - 
    COALESCE((SELECT SUM(amount) FROM expenses WHERE DATE(createdAt) = DATE(o.orderDate)), 0) AS netProfit
  
FROM orders o
JOIN orderItems oi ON o.id = oi.orderId
JOIN products p ON oi.productId = p.id
WHERE o.status IN ('paid', 'delivered')
  AND DATE(o.orderDate) = '2024-01-25'
GROUP BY DATE(o.orderDate);
```

### Monthly P&L
```sql
SELECT 
  DATE_FORMAT(o.orderDate, '%Y-%m') AS month,
  SUM(o.totalAmount) AS revenue,
  SUM(oi.quantity * p.costPrice) AS cogs,
  SUM(o.totalAmount - (oi.quantity * p.costPrice)) AS grossProfit,
  ((SUM(o.totalAmount - (oi.quantity * p.costPrice)) / SUM(o.totalAmount)) * 100) AS marginPct
FROM orders o
JOIN orderItems oi ON o.id = oi.orderId
JOIN products p ON oi.productId = p.id
WHERE o.status IN ('paid', 'delivered')
  AND o.orderDate BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY DATE_FORMAT(o.orderDate, '%Y-%m')
ORDER BY month;
```

### Product-Level Profitability
```sql
SELECT 
  p.name AS product,
  p.sku,
  p.costPrice AS currentCost,
  p.retailPrice AS currentPrice,
  SUM(oi.quantity) AS unitsSold,
  AVG(oi.unitPrice) AS avgSellingPrice,
  SUM(oi.totalAmount) AS revenue,
  SUM(oi.quantity * p.costPrice) AS totalCost,
  SUM(oi.totalAmount - (oi.quantity * p.costPrice)) AS profit,
  ((SUM(oi.totalAmount - (oi.quantity * p.costPrice)) / SUM(oi.totalAmount)) * 100) AS profitMarginPct
FROM orderItems oi
JOIN products p ON oi.productId = p.id
JOIN orders o ON oi.orderId = o.id
WHERE o.status IN ('paid', 'delivered')
  AND o.orderDate BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY p.id, p.name, p.sku, p.costPrice, p.retailPrice
ORDER BY profit DESC;
```

---

## 4. Inventory Management

### Current Stock Levels
```sql
SELECT 
  p.name AS product,
  p.sku,
  p.costPrice AS currentCost,
  p.retailPrice AS sellingPrice,
  SUM(ie.currentQuantity) AS unitsInStock,
  SUM(ie.currentQuantity * p.costPrice) AS inventoryValue,
  p.reorderThreshold,
  CASE 
    WHEN SUM(ie.currentQuantity) < p.reorderThreshold THEN 'LOW STOCK'
    WHEN SUM(ie.currentQuantity) = 0 THEN 'OUT OF STOCK'
    ELSE 'OK'
  END AS stockStatus
FROM products p
LEFT JOIN inventoryEntries ie ON p.id = ie.productId
WHERE p.isActive = true
GROUP BY p.id, p.name, p.sku, p.costPrice, p.retailPrice, p.reorderThreshold
ORDER BY stockStatus DESC, inventoryValue DESC;
```

### Stock by Batch (for expiry tracking)
```sql
SELECT 
  p.name AS product,
  b.batchNumber,
  ie.expiryDate,
  ie.currentQuantity,
  ie.currentQuantity * p.costPrice AS batchValue,
  DATEDIFF(ie.expiryDate, CURDATE()) AS daysUntilExpiry,
  CASE 
    WHEN ie.expiryDate < CURDATE() THEN 'EXPIRED'
    WHEN DATEDIFF(ie.expiryDate, CURDATE()) <= 30 THEN 'EXPIRING SOON'
    ELSE 'OK'
  END AS expiryStatus
FROM inventoryEntries ie
JOIN products p ON ie.productId = p.id
JOIN batches b ON ie.batchId = b.id
WHERE ie.currentQuantity > 0
  AND ie.expiryDate IS NOT NULL
ORDER BY ie.expiryDate ASC;
```

---

## 5. Important Business Logic

### When to Update Product Cost

**Option 1: Always Update (Simple)**
```javascript
// Every purchase updates the product cost
UPDATE products SET costPrice = newCost WHERE id = productId;
```

**Option 2: Weighted Average (More Accurate)**
```javascript
// Calculate weighted average cost
const currentStock = await getCurrentStock(productId);
const currentCost = await getProductCost(productId);
const newQuantity = purchaseQuantity;
const newCost = purchaseCost;

const totalQuantity = currentStock + newQuantity;
const weightedAvgCost = (
  (currentStock * currentCost) + (newQuantity * newCost)
) / totalQuantity;

await updateProductCost(productId, weightedAvgCost);
```

**Option 3: Last Purchase Cost (What you described)**
```javascript
// Just use the latest purchase cost
UPDATE products 
SET costPrice = (SELECT unitCost FROM purchaseItems WHERE productId = ? ORDER BY createdAt DESC LIMIT 1)
WHERE id = productId;
```

### Reducing Inventory Quantities

**Simple FIFO for Quantities (Oldest First)**
```javascript
async function reduceInventory(productId, quantityToReduce) {
  let remaining = quantityToReduce;
  
  // Get oldest batches first
  const batches = await db('inventoryEntries')
    .where({ productId })
    .where('currentQuantity', '>', 0)
    .orderBy('createdAt', 'asc');
  
  for (const batch of batches) {
    if (remaining <= 0) break;
    
    const toReduce = Math.min(batch.currentQuantity, remaining);
    
    await db('inventoryEntries')
      .where({ id: batch.id })
      .decrement('currentQuantity', toReduce);
    
    remaining -= toReduce;
  }
  
  if (remaining > 0) {
    throw new Error('Insufficient inventory');
  }
}
```

---

## 6. Example Scenarios

### Scenario: Cost Updates Over Time

**January 1:** Purchase 100 units @ $50
```
Product A cost: $50
Inventory: 100 units
```

**January 15:** Sell 30 units @ $75
```
COGS: 30 × $50 = $1,500
Revenue: 30 × $75 = $2,250
Profit: $750
Remaining: 70 units
```

**January 20:** Purchase 50 units @ $55 (cost increased!)
```
Product A cost: $55 ✅ (updated)
Inventory: 70 + 50 = 120 units
```

**January 25:** Sell 40 units @ $75
```
COGS: 40 × $55 = $2,200 ✅ (uses NEW cost)
Revenue: 40 × $75 = $3,000
Profit: $800
Remaining: 80 units (30 from batch 1, 50 from batch 2)
```

**P&L for January:**
```
Total Revenue: $2,250 + $3,000 = $5,250
Total COGS: $1,500 + $2,200 = $3,700
Gross Profit: $1,550
```

---

## Summary

✅ **Your System:**
- Simple standard costing
- Product cost updated with each purchase
- Quantities tracked per batch
- COGS = quantity × current product cost
- Easy to implement and maintain

✅ **You Can:**
- View all purchases by waybill number
- Track quantities per batch
- Calculate accurate P&L by any period
- Manage inventory with expiry dates
- See product profitability

✅ **Best For:**
- Products with stable pricing
- Simpler accounting requirements
- Faster implementation
- Less complex queries

This is a **production-ready, maintainable solution** for most inventory management needs! 🎉
