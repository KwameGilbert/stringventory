import { BaseModel } from './BaseModel.js';
import { db } from '../config/database.js';

export class CategoryModelClass extends BaseModel {
  constructor() {
    super('categories', {
      timestamps: true,
      searchableFields: ['name', 'description'],
      sortableFields: ['name', 'createdAt'],
    });
  }

  /**
   * Find all categories with product counts
   */
  async findAllWithCounts(options = {}) {
    const q = options.trx || db;

    let query = q('categories as c')
      .leftJoin('products as p', 'c.id', 'p.categoryId')
      .select('c.*', db.raw('count(p.id) as productCount'))
      .groupBy('c.id');

    if (options.filters?.businessId) {
      query = query.where('c.businessId', options.filters.businessId);
    }

    if (options.search) {
      query = query.where((builder) => {
        builder
          .whereILike('c.name', `%${options.search}%`)
          .orWhereILike('c.description', `%${options.search}%`);
      });
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;

    const countResult = await q('categories as c')
      .where('c.businessId', options.filters.businessId)
      .count('* as count');
    const total = parseInt(countResult[0]?.count || 0);

    const rawData = await query.offset(offset).limit(limit).orderBy('c.createdAt', 'desc');

    const data = rawData.map((c) => ({
      ...c,
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
}

export const CategoryModel = new CategoryModelClass();
export default CategoryModel;
