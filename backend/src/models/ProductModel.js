import { BaseModel } from './BaseModel.js';
import { db } from '../config/database.js';

export class ProductModelClass extends BaseModel {
  constructor() {
    super('products', {
      timestamps: true,
      searchableFields: ['name', 'productCode', 'sku', 'barcode', 'description'],
      sortableFields: ['name', 'retailPrice', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * Find products with category details
   */
  async findAllWithDetails(options = {}) {
    const q = options.trx || db;

    let query = q('products as p')
      .leftJoin('categories as c', 'p.categoryId', 'c.id')
      .leftJoin('unitOfMeasurements as uom', 'p.unitOfMeasurementId', 'uom.id')
      .select(
        'p.id',
        'p.name',
        'p.sku',
        'p.description',
        'p.categoryId',
        'c.name as categoryName',
        'p.retailPrice as price',
        'p.costPrice as cost',
        'p.quantity',
        'p.reorderThreshold as reorderLevel',
        'p.reorderQuantity',
        'uom.name as unit',
        'p.isActive',
        'p.image',
        'p.barcode',
        'p.supplierId',
        'p.createdAt',
        'p.updatedAt'
      );

    if (options.filters?.businessId) {
      query = query.where('p.businessId', options.filters.businessId);
    }

    if (options.filters?.category) {
      query = query.where('c.name', options.filters.category);
    }

    if (options.filters?.status) {
      const isActive = options.filters.status === 'active';
      query = query.where('p.isActive', isActive);
    }

    if (options.search) {
      query = query.where((builder) => {
        builder
          .whereILike('p.name', `%${options.search}%`)
          .orWhereILike('p.productCode', `%${options.search}%`)
          .orWhereILike('p.sku', `%${options.search}%`);
      });
    }

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;

    const countQuery = query.clone().clearSelect().count('* as count');
    const [{ count }] = await countQuery;

    const rawData = await query.offset(offset).limit(limit).orderBy('p.createdAt', 'desc');

    const data = rawData.map((p) => ({
      ...p,
      status: p.isActive ? 'active' : 'inactive',
      isActive: undefined,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / limit),
      },
    };
  }

  /**
   * Find product by ID with details
   */
  async findByIdWithDetails(id, trx = null) {
    const q = trx || db;
    const p = await q('products as p')
      .leftJoin('categories as c', 'p.categoryId', 'c.id')
      .leftJoin('unitOfMeasurements as uom', 'p.unitOfMeasurementId', 'uom.id')
      .select(
        'p.id',
        'p.name',
        'p.sku',
        'p.description',
        'p.categoryId',
        'c.name as categoryName',
        'p.retailPrice as price',
        'p.costPrice as cost',
        'p.quantity',
        'p.reorderThreshold as reorderLevel',
        'p.reorderQuantity',
        'uom.name as unit',
        'p.isActive',
        'p.image',
        'p.barcode',
        'p.supplierId',
        'p.createdAt',
        'p.updatedAt'
      )
      .where('p.id', id)
      .first();

    if (p) {
      return {
        ...p,
        status: p.isActive ? 'active' : 'inactive',
        isActive: undefined,
      };
    }
    return null;
  }

  /**
   * Get low stock products
   */
  async getLowStock(businessId, limit = 20) {
    const rawData = await db('products as p')
      .where('p.businessId', businessId)
      .whereRaw('p.quantity <= p.reorderThreshold')
      .select(
        'p.id',
        'p.name',
        'p.sku',
        'p.quantity',
        'p.reorderThreshold as reorderLevel',
        'p.reorderQuantity'
      )
      .limit(limit)
      .orderBy('p.quantity', 'asc');

    return rawData.map((p) => ({
      ...p,
      status: 'warning',
    }));
  }

  /**
   * Get expiring products
   */
  async getExpiringStock(businessId, days = 30) {
    // Expiring stock is in 'inventoryEntries' table
    return db('inventoryEntries as ie')
      .join('products as p', 'ie.productId', 'p.id')
      .where('p.businessId', businessId)
      .whereNotNull('ie.expiryDate')
      .whereRaw("ie.expiryDate <= CURRENT_DATE + interval '? days'", [days])
      .select(
        'p.id',
        'p.name',
        'p.sku',
        'ie.currentQuantity as quantity',
        'ie.expiryDate',
        db.raw('ie.expiryDate - CURRENT_DATE as daysUntilExpiry')
      )
      .orderBy('ie.expiryDate', 'asc');
  }
}

export const ProductModel = new ProductModelClass();
export default ProductModel;
