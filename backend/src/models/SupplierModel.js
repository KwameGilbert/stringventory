import { BaseModel } from './BaseModel.js';
import { db } from '../config/database.js';

export class SupplierModelClass extends BaseModel {
  constructor() {
    super('suppliers', {
      timestamps: true,
      searchableFields: ['name', 'email', 'phone', 'contactPerson', 'city'],
      sortableFields: ['name', 'createdAt', 'updatedAt', 'rating'],
    });
  }

  /**
   * Find all suppliers with stats
   */
  async findAllWithStats(options = {}) {
    const q = options.trx || db;

    // Joint with purchases to get totalOrders and totalSpent
    let query = q('suppliers as s')
      .leftJoin('purchases as p', 's.id', 'p.supplierId')
      .select(
        's.*',
        db.raw('count(p.id) as totalOrders'),
        db.raw('coalesce(sum(p.totalAmount), 0) as totalSpent')
      )
      .groupBy('s.id');

    if (options.filters?.businessId) {
      query = query.where('s.businessId', options.filters.businessId);
    }

    if (options.filters?.status) {
      const isActive = options.filters.status === 'active';
      query = query.where('s.isActive', isActive);
    }

    if (options.search) {
      query = query.where((builder) => {
        builder
          .whereILike('s.name', `%${options.search}%`)
          .orWhereILike('s.email', `%${options.search}%`)
          .orWhereILike('s.contactPerson', `%${options.search}%`);
      });
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;

    const countResult = await q('suppliers as s')
      .where('s.businessId', options.filters.businessId)
      .count('* as count');
    const total = parseInt(countResult[0]?.count || 0);

    const rawData = await query.offset(offset).limit(limit).orderBy('s.createdAt', 'desc');

    const data = rawData.map((s) => ({
      ...s,
      totalOrders: parseInt(s.totalOrders),
      totalSpent: parseFloat(s.totalSpent),
      status: s.isActive ? 'active' : 'inactive',
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
   * Find supplier by ID with stats
   */
  async findByIdWithStats(id, trx = null) {
    const q = trx || db;
    const s = await q('suppliers as s')
      .leftJoin('purchases as p', 's.id', 'p.supplierId')
      .select(
        's.*',
        db.raw('count(p.id) as totalOrders'),
        db.raw('coalesce(sum(p.totalAmount), 0) as totalSpent')
      )
      .where('s.id', id)
      .groupBy('s.id')
      .first();

    if (s) {
      return {
        ...s,
        totalOrders: parseInt(s.totalOrders),
        totalSpent: parseFloat(s.totalSpent),
        status: s.isActive ? 'active' : 'inactive',
        isActive: undefined,
      };
    }
    return null;
  }
}

export const SupplierModel = new SupplierModelClass();
export default SupplierModel;
