import { BaseModel } from './BaseModel.js';
import { db } from '../config/database.js';

export class CustomerModelClass extends BaseModel {
  constructor() {
    super('customers', {
      timestamps: true,
      searchableFields: ['firstName', 'lastName', 'email', 'phone', 'businessName'],
      sortableFields: ['firstName', 'lastName', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Find all customers with stats
   */
  async findAllWithStats(options = {}) {
    const q = options.trx || db;

    let query = q('customers as c')
      .leftJoin('orders as o', 'c.id', 'o.customerId')
      .select(
        'c.*',
        db.raw('count(o.id) as totalOrders'),
        db.raw('coalesce(sum(o.totalAmount), 0) as totalSpent')
      )
      .groupBy('c.id');

    if (options.filters?.businessId) {
      query = query.where('c.businessId', options.filters.businessId);
    }

    if (options.filters?.status) {
      const isActive = options.filters.status === 'active';
      query = query.where('c.isActive', isActive);
    }

    if (options.search) {
      query = query.where((builder) => {
        builder
          .whereILike('c.firstName', `%${options.search}%`)
          .orWhereILike('c.lastName', `%${options.search}%`)
          .orWhereILike('c.businessName', `%${options.search}%`)
          .orWhereILike('c.email', `%${options.search}%`);
      });
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;

    const countResult = await q('customers as c')
      .where('c.businessId', options.filters.businessId)
      .count('* as count');
    const total = parseInt(countResult[0]?.count || 0);

    const rawData = await query.offset(offset).limit(limit).orderBy('c.createdAt', 'desc');

    const data = rawData.map((c) => ({
      ...c,
      totalOrders: parseInt(c.totalOrders),
      totalSpent: parseFloat(c.totalSpent),
      status: c.isActive ? 'active' : 'inactive',
      isActive: undefined,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find customer by ID with stats
   */
  async findByIdWithStats(id, trx = null) {
    const q = trx || db;
    const c = await q('customers as c')
      .leftJoin('orders as o', 'c.id', 'o.customerId')
      .select(
        'c.*',
        db.raw('count(o.id) as totalOrders'),
        db.raw('coalesce(sum(o.totalAmount), 0) as totalSpent')
      )
      .where('c.id', id)
      .groupBy('c.id')
      .first();

    if (c) {
      return {
        ...c,
        totalOrders: parseInt(c.totalOrders),
        totalSpent: parseFloat(c.totalSpent),
        status: c.isActive ? 'active' : 'inactive',
        isActive: undefined,
      };
    }
    return null;
  }
}

export const CustomerModel = new CustomerModelClass();
export default CustomerModel;
