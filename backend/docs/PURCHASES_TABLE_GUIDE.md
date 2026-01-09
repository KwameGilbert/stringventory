# Purchases & Purchase Items Guide

## Overview
The purchase system uses a **header-detail structure** where:
- **`purchases`** table: Header table storing overall purchase information (one record per purchase transaction)
- **`purchaseItems`** table: Detail table storing individual products (multiple records per purchase)

### **Key Design:**
- **Batch at Header Level**: One batch for the entire shipment/purchase
- **Supplier at Item Level**: Each product can be from a different supplier

This allows you to:
- Purchase **multiple products from different suppliers** in a single transaction
- Assign one **batch** to the entire shipment for inventory tracking

## Key Features

✅ **Multiple Products Per Purchase**: Buy many products in one transaction  
✅ **Multiple Suppliers Per Purchase**: Each product can have its own supplier  
✅ **Batch Assignment**: Optionally assign entire purchase to a batch  
✅ **Flexible Pricing**: Set unit cost and optional selling price per product  
✅ **Expiry Tracking**: Track expiry dates for each product item  
✅ **Status Management**: pending → received → partial → cancelled  
✅ **Payment Integration**: Links to payments table  

## Table Schemas

### Purchases Table (Header)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `purchaseNumber` | STRING | Yes | Unique reference (PUR-2024-001) |
| `purchaseDate` | DATE | Yes | Date of purchase (defaults to today) |
| `batchId` | UUID | No | Optional batch for entire shipment |
| `subtotal` | DECIMAL | Yes | Sum of all item costs |
| `discount` | DECIMAL | Yes | Any discount applied (default 0) |
| `totalAmount` | DECIMAL | Yes | subtotal - discount |
| `invoiceNumber` | STRING | No | Invoice/receipt number |
| `notes` | TEXT | No | General notes |
| `status` | ENUM | Yes | pending/received/partial/cancelled |
| `receivedDate` | DATE | No | When fully received |
| `createdById` | UUID | Yes | User who created |
| `createdAt` | TIMESTAMP | Yes | Created timestamp |
| `updatedAt` | TIMESTAMP | Yes | Updated timestamp |

### Purchase Items Table (Detail)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary key |
| `purchaseId` | UUID | Yes | Link to purchases table |
| `productId` | UUID | Yes | Link to products table |
| `supplierId` | UUID | **Yes** | **Supplier for this product** |
| `quantity` | INTEGER | Yes | Quantity of this product |
| `unitCost` | DECIMAL | Yes | Cost per unit |
| `totalCost` | DECIMAL | Yes | quantity × unitCost |
| `sellingPrice` | DECIMAL | No | Optional price override |
| `expiryDate` | DATE | No | For perishable items |
| `notes` | TEXT | No | Item-specific notes |
| `createdAt` | TIMESTAMP | Yes | Created timestamp |
| `updatedAt` | TIMESTAMP | Yes | Updated timestamp |

## Usage Examples

### 1. Creating a Purchase with Multiple Products from Different Suppliers

```javascript
const trx = await knex.transaction();

try {
  // 1. Create purchase header (no supplier here - it's per item!)
  const [purchaseId] = await trx('purchases').insert({
    purchaseNumber: 'PUR-2024-001',
    purchaseDate: '2024-01-09',
    batchId: batchId, // Optional - one batch for the whole shipment
    subtotal: 7500.00,
    discount: 0,
    totalAmount: 7500.00,
    invoiceNumber: 'MIXED-INV-2024-123', // Could be multiple invoices
    status: 'received',
    receivedDate: '2024-01-09',
    createdById: userId
  });

  // 2. Add purchase items - each with its own supplier!
  await trx('purchaseItems').insert([
    {
      purchaseId: purchaseId,
      productId: productId1,
      supplierId: supplierA, // Product 1 from Supplier A
      quantity: 100,
      unitCost: 50.00,
      totalCost: 5000.00,
      sellingPrice: 75.00,
      expiryDate: null
    },
    {
      purchaseId: purchaseId,
      productId: productId2,
      supplierId: supplierB, // Product 2 from Supplier B (different!)
      quantity: 50,
      unitCost: 30.00,
      totalCost: 1500.00,
      sellingPrice: 45.00,
      expiryDate: null
    },
    {
      purchaseId: purchaseId,
      productId: productId3,
      supplierId: supplierA, // Product 3 also from Supplier A
      quantity: 200,
      unitCost: 5.00,
      totalCost: 1000.00,
      sellingPrice: 8.00,
      expiryDate: '2024-02-09' // Perishable
    }
  ]);

  // 3. Create payment record
  await trx('payments').insert({
    transactionType: 'purchase',
    paymentMethod: 'bank_transfer',
    amount: -7500.00, // Negative for money out
    status: 'completed',
    referenceId: purchaseId,
    referenceType: 'purchase',
    description: 'Payment for Purchase #PUR-2024-001',
    processedById: userId
  });

  await trx.commit();
} catch (error) {
  await trx.rollback();
  throw error;
}
```

### 2. Creating a Pending Purchase Order

```javascript
// Purchase ordered but not yet received
const [purchaseId] = await knex('purchases').insert({
  purchaseNumber: 'PUR-2024-002',
  purchaseDate: '2024-01-09',
  supplierId: supplierId,
  subtotal: 2500.00,
  totalAmount: 2500.00,
  status: 'pending', // Not received yet
  receivedDate: null,
  createdById: userId
});

await knex('purchaseItems').insert([
  {
    purchaseId: purchaseId,
    productId: productId1,
    quantity: 50,
    unitCost: 50.00,
    totalCost: 2500.00
  }
]);
```

### 3. Updating Purchase Status When Received

```javascript
await knex('purchases')
  .where('id', purchaseId)
  .update({
    status: 'received',
    receivedDate: knex.fn.now(),
    updatedAt: knex.fn.now()
  });
```

## Common Queries

### Get Purchase with All Items (JOIN)

```javascript
const purchase = await knex('purchases as p')
  .leftJoin('suppliers as s', 'p.supplierId', 's.id')
  .leftJoin('batches as b', 'p.batchId', 'b.id')
  .leftJoin('users as u', 'p.createdById', 'u.id')
  .select(
    'p.*',
    's.name as supplierName',
    'b.batchNumber',
    'u.firstName',
    'u.lastName'
  )
  .where('p.id', purchaseId)
  .first();

const items = await knex('purchaseItems as pi')
  .join('products as pr', 'pi.productId', 'pr.id')
  .select(
    'pi.*',
    'pr.name as productName',
    'pr.productCode'
  )
  .where('pi.purchaseId', purchaseId);

purchase.items = items;
```

### Get All Purchases for a Period

```javascript
const purchases = await knex('purchases')
  .whereBetween('purchaseDate', [startDate, endDate])
  .orderBy('purchaseDate', 'desc');
```

### Get Purchases by Supplier

```javascript
const supplierPurchases = await knex('purchases as p')
  .join('suppliers as s', 'p.supplierId', 's.id')
  .select('p.*', 's.name as supplierName')
  .where('p.supplierId', supplierId)
  .orderBy('p.purchaseDate', 'desc');
```

### Get Pending Purchase Orders

```javascript
const pending = await knex('purchases')
  .where('status', 'pending')
  .orderBy('purchaseDate', 'asc');
```

### Get Total Purchase Cost for Period

```javascript
const totalCost = await knex('purchases')
  .whereBetween('purchaseDate', [startDate, endDate])
  .sum('totalAmount as total');
```

### Get Items Expiring Soon

```javascript
const expiringSoon = await knex('purchaseItems as pi')
  .join('purchases as p', 'pi.purchaseId', 'p.id')
  .join('products as pr', 'pi.productId', 'pr.id')
  .select('pi.*', 'pr.name as productName', 'p.purchaseNumber')
  .whereNotNull('pi.expiryDate')
  .where('pi.expiryDate', '<=', knex.raw('CURRENT_DATE + INTERVAL 7 DAY'))
  .where('p.status', 'received')
  .orderBy('pi.expiryDate', 'asc');
```

### Get Purchase Statistics by Product

```javascript
const productStats = await knex('purchaseItems as pi')
  .join('products as pr', 'pi.productId', 'pr.id')
  .select('pr.name as productName')
  .sum('pi.quantity as totalQuantity')
  .sum('pi.totalCost as totalSpent')
  .avg('pi.unitCost as avgUnitCost')
  .count('pi.id as purchaseCount')
  .groupBy('pr.id', 'pr.name')
  .orderBy('totalSpent', 'desc');
```

### Calculate Potential Profit

```javascript
const profitAnalysis = await knex('purchaseItems as pi')
  .join('products as pr', 'pi.productId', 'pr.id')
  .select(
    'pr.name as productName',
    'pi.quantity',
    'pi.unitCost',
    knex.raw('COALESCE(pi.sellingPrice, pr.retailPrice) as sellingPrice'),
    knex.raw('(COALESCE(pi.sellingPrice, pr.retailPrice) - pi.unitCost) * pi.quantity as potentialProfit')
  )
  .where('pi.purchaseId', purchaseId);
```

### Get Supplier Performance

```javascript
const supplierStats = await knex('purchases as p')
  .join('suppliers as s', 'p.supplierId', 's.id')
  .select('s.name as supplierName')
  .sum('p.totalAmount as totalPurchased')
  .count('p.id as purchaseCount')
  .avg('p.totalAmount as avgPurchaseValue')
  .groupBy('s.id', 's.name')
  .orderBy('totalPurchased', 'desc');
```

## Integration with Other Tables

### With Batches

```javascript
// Create batch first, then link purchase
const [batchId] = await knex('batches').insert({
  batchNumber: 'BAT-2024-001',
  supplierId: supplierId,
  receivedDate: purchaseDate,
  status: 'open'
});

await knex('purchases').insert({
  purchaseNumber: 'PUR-2024-001',
  batchId: batchId, // Link to batch
  // ... other fields
});
```

### With Inventory Entries

```javascript
// After receiving purchase, update inventory
const items = await knex('purchaseItems').where('purchaseId', purchaseId);

for (const item of items) {
  await knex('inventoryEntries').insert({
    productId: item.productId,
    batchId: purchase.batchId,
    costPrice: item.unitCost,
    sellingPrice: item.sellingPrice || product.retailPrice,
    quantityReceived: item.quantity,
    expiryDate: item.expiryDate
  });
}
```

### With Payments

```javascript
// Always create payment when creating purchase
await knex('payments').insert({
  transactionType: 'purchase',
  paymentMethod: 'cash',
  amount: -purchase.totalAmount, // Negative!
  referenceId: purchaseId,
  referenceType: 'purchase',
  processedById: userId
});
```

## Best Practices

1. **Use Transactions**: Always wrap purchase + items + payment creation in a transaction

2. **Calculate Totals Correctly**:
   ```javascript
   const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
   const totalAmount = subtotal - discount;
   ```

3. **Unique Purchase Numbers**: Generate sequentially (PUR-YYYY-XXX)

4. **Batch Assignment**: Use batches to group related inventory from same shipment

5. **Selling Price Override**: Use `purchaseItems.sellingPrice` to override product retail price when needed

6. **Expiry Dates**: Always set for perishable items

7. **Status Management**:
   - `pending`: Ordered, not yet received
   - `partial`: Some items received (implement custom logic)
   - `received`: All items received
   - `cancelled`: Purchase cancelled

8. **Link to Payments**: Always create corresponding payment record

9. **Update Inventory**: When status changes to 'received', create inventory entries

10. **Validation**: Ensure `purchaseItems.totalCost = quantity × unitCost` and `purchases.subtotal = SUM(items.totalCost)`

## Complete Workflow Example

```javascript
async function createPurchase(purchaseData, items) {
  const trx = await knex.transaction();
  
  try {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      item.totalCost = item.quantity * item.unitCost;
      return sum + item.totalCost;
    }, 0);
    
    const totalAmount = subtotal - (purchaseData.discount || 0);
    
    // 1. Create purchase header
    const [purchaseId] = await trx('purchases').insert({
      purchaseNumber: await generatePurchaseNumber(trx),
      purchaseDate: purchaseData.purchaseDate || knex.fn.now(),
      supplierId: purchaseData.supplierId,
      batchId: purchaseData.batchId,
      subtotal: subtotal,
      discount: purchaseData.discount || 0,
      totalAmount: totalAmount,
      invoiceNumber: purchaseData.invoiceNumber,
      notes: purchaseData.notes,
      status: purchaseData.status || 'pending',
      receivedDate: purchaseData.receivedDate,
      createdById: purchaseData.userId
    });
    
    // 2. Create purchase items
    const itemsToInsert = items.map(item => ({
      purchaseId: purchaseId,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      totalCost: item.totalCost,
      sellingPrice: item.sellingPrice,
      expiryDate: item.expiryDate,
      notes: item.notes
    }));
    
    await trx('purchaseItems').insert(itemsToInsert);
    
    // 3. Create payment if paid
    if (purchaseData.paymentMethod) {
      await trx('payments').insert({
        transactionType: 'purchase',
        paymentMethod: purchaseData.paymentMethod,
        amount: -totalAmount, // Negative for money out
        status: 'completed',
        referenceId: purchaseId,
        referenceType: 'purchase',
        description: `Payment for Purchase #${purchaseData.purchaseNumber}`,
        processedById: purchaseData.userId
      });
    }
    
    // 4. Update inventory if received
    if (purchaseData.status === 'received') {
      for (const item of itemsToInsert) {
        await trx('inventoryEntries').insert({
          productId: item.productId,
          batchId: purchaseData.batchId,
          costPrice: item.unitCost,
          sellingPrice: item.sellingPrice,
          quantityReceived: item.quantity,
          expiryDate: item.expiryDate
        });
      }
    }
    
    await trx.commit();
    return purchaseId;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

// Helper function
async function generatePurchaseNumber(trx) {
  const year = new Date().getFullYear();
  const lastPurchase = await trx('purchases')
    .where('purchaseNumber', 'like', `PUR-${year}-%`)
    .orderBy('purchaseNumber', 'desc')
    .first();
  
  const nextNum = lastPurchase 
    ? parseInt(lastPurchase.purchaseNumber.split('-')[2]) + 1 
    : 1;
  
  return `PUR-${year}-${String(nextNum).padStart(3, '0')}`;
}
```
