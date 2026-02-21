import { BaseModel } from './BaseModel.js';
import { db } from '../config/database.js';

export class OrderModelClass extends BaseModel {
  constructor() {
    super('orders', {
      timestamps: true,
      searchableFields: ['orderNumber', 'shippingAddress', 'notes'],
      sortableFields: ['orderDate', 'totalAmount', 'createdAt'],
    });
  }

  /**
   * Find orders with customer names
   */
  async findAllWithDetails(options = {}) {
    const q = options.trx || db;

    let query = q('orders as o')
      .join('customers as c', 'o.customerId', 'c.id')
      .select(
        'o.id',
        'o.orderNumber',
        'o.customerId',
        db.raw('concat(c."firstName", \' \', c."lastName") as customerName'),
        'o.orderDate as date',
        'o.expectedDeliveryDate as dueDate',
        'o.subtotal',
        'o.taxAmount as tax',
        'o.totalAmount as total',
        'o.status',
        'o.paymentStatus',
        'o.createdAt',
        db.raw('(SELECT count(*) FROM "orderItems" WHERE "orderId" = o.id) as itemCount')
      );

    if (options.filters?.businessId) {
      query = query.where('o.businessId', options.filters.businessId);
    }

    if (options.filters?.status) {
      query = query.where('o.status', options.filters.status);
    }

    if (options.search) {
      query = query.where((builder) => {
        builder
          .whereILike('o.orderNumber', `%${options.search}%`)
          .orWhereILike('c.firstName', `%${options.search}%`)
          .orWhereILike('c.lastName', `%${options.search}%`);
      });
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;

    const countQuery = q('orders as o').where('o.businessId', options.filters.businessId);
    const [{ count }] = await countQuery.count('* as count');
    const total = parseInt(count);

    const data = await query.offset(offset).limit(limit).orderBy('o.createdAt', 'desc');

    return {
      data: data.map((o) => ({
        ...o,
        itemCount: parseInt(o.itemCount),
        subtotal: parseFloat(o.subtotal),
        tax: parseFloat(o.tax),
        total: parseFloat(o.total),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find order by ID with items and customer details
   */
  async findByIdWithDetails(id, trx = null) {
    const q = trx || db;
    const order = await q('orders as o')
      .join('customers as c', 'o.customerId', 'c.id')
      .select(
        'o.*',
        db.raw('concat(c."firstName", \' \', c."lastName") as customerName'),
        'c.email as customerEmail',
        'c.phone as customerPhone'
      )
      .where('o.id', id)
      .first();

    if (!order) return null;

    const items = await q('orderItems as oi')
      .join('products as p', 'oi.productId', 'p.id')
      .select(
        'oi.id',
        'oi.productId',
        'p.name as productName',
        'p.sku',
        'oi.quantity',
        'oi.unitPrice',
        db.raw('oi.quantity * oi.unitPrice as subtotal'),
        'oi.discount',
        'oi.totalAmount as total'
      )
      .where('oi.orderId', id);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      date: order.orderDate,
      dueDate: order.expectedDeliveryDate,
      deliveryDate: order.actualDeliveryDate,
      items: items.map((i) => ({
        ...i,
        unitPrice: parseFloat(i.unitPrice),
        subtotal: parseFloat(i.subtotal),
        discount: parseFloat(i.discount),
        total: parseFloat(i.total),
      })),
      subtotal: parseFloat(order.subtotal),
      discount: parseFloat(order.discountTotal),
      tax: parseFloat(order.taxAmount),
      shippingCost: parseFloat(order.shippingCost),
      total: parseFloat(order.totalAmount),
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Create order with items
   */
  async createWithItems(data, userId) {
    return await db.transaction(async (trx) => {
      // 1. Calculate totals
      let subtotal = 0;
      let discountTotal = 0;

      for (const item of data.items) {
        subtotal += item.quantity * item.unitPrice;
        discountTotal += item.discount || 0;
      }

      const shippingCost = data.shippingCost || 0;
      const taxAmount = data.tax || 0;
      const totalAmount = subtotal - discountTotal + shippingCost + taxAmount;

      // Generate order number if not provided (Simplified)
      const countResult = await trx('orders').count('* as count');
      const orderNumber = `ORD-${String(parseInt(countResult[0].count) + 1).padStart(3, '0')}`;

      // 2. Insert order
      const [order] = await trx('orders')
        .insert({
          orderNumber,
          customerId: data.customerId,
          orderDate: trx.fn.now(),
          expectedDeliveryDate: data.dueDate,
          subtotal,
          discountTotal,
          shippingCost,
          taxAmount,
          totalAmount,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
          createdById: userId,
          businessId: data.businessId,
          status: 'pending',
          paymentStatus: 'unpaid',
        })
        .returning('*');

      // 3. Insert items
      const orderItems = data.items.map((i) => ({
        orderId: order.id,
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discount: i.discount || 0,
        totalAmount: i.quantity * i.unitPrice - (i.discount || 0),
      }));

      await trx('orderItems').insert(orderItems);

      return order;
    });
  }

  /**
   * Create refund
   */
  async createRefund(orderId, refundData, businessId) {
    return await db.transaction(async (trx) => {
      const order = await trx('orders').where({ id: orderId, businessId }).first();
      if (!order) throw new Error('Order not found');

      // 1. Create refund record
      const [refund] = await trx('refunds')
        .insert({
          orderId,
          businessId,
          amount: refundData.amount,
          refundType: refundData.refundType,
          reason: refundData.reason,
          notes: refundData.notes,
          status: 'processed',
        })
        .returning('*');

      // 2. Create refund items
      if (refundData.items && refundData.items.length > 0) {
        const items = refundData.items.map((i) => ({
          refundId: refund.id,
          orderItemId: i.orderItemId,
          quantity: i.quantity,
        }));
        await trx('refundItems').insert(items);
      }

      // 3. Update order payment status if necessary (Simplified)
      if (refundData.refundType === 'full') {
        // Logic to mark as refunded or similar
      }

      return refund;
    });
  }
}

export const OrderModel = new OrderModelClass();
export default OrderModel;
