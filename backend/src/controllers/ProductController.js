import { db } from '../config/database.js';
import { ProductModel } from '../models/ProductModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

/**
 * Product Controller
 */
export class ProductController {
  /**
   * Get all products
   * GET /products
   */
  static getAllProducts = asyncHandler(async (req, res) => {
    const filters = {
      businessId: req.user.businessId,
      category: req.query.category,
      status: req.query.status,
    };

    const result = await ProductModel.findAllWithDetails({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      filters,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Products retrieved successfully'
    );
  });

  /**
   * Get product by ID
   * GET /products/:productId
   */
  static getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await ProductModel.findByIdWithDetails(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to view this product');
    }

    return ApiResponse.success(res, product, 'Product retrieved successfully');
  });

  /**
   * Create a new product
   * POST /products
   */
  static createProduct = asyncHandler(async (req, res) => {
    const { price, cost, reorderLevel, unit, ...otherData } = req.body;
    const productData = {
      ...otherData,
      retailPrice: price,
      costPrice: cost,
      reorderThreshold: reorderLevel,
      businessId: req.user.businessId,
      isActive: req.body.status === 'active' || req.body.status === undefined,
    };

    // Resolve UOM if provided
    if (unit) {
      const uom = await db('unitOfMeasurements')
        .where('name', unit)
        .orWhere('abbreviation', unit)
        .first();
      if (uom) {
        productData.unitOfMeasurementId = uom.id;
      }
    }

    // Check for existing product code/sku if provided
    if (productData.productCode) {
      const existingCode = await ProductModel.findFirst({
        productCode: productData.productCode,
        businessId: req.user.businessId,
      });

      if (existingCode) {
        throw new ConflictError('Product with this code already exists in your business');
      }
    }

    const product = await ProductModel.create(productData);

    const formattedResponse = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: parseFloat(product.retailPrice),
      quantity: product.quantity,
      status: product.isActive ? 'active' : 'inactive',
      createdAt: product.createdAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Product created successfully');
  });

  /**
   * Update product
   * PUT /products/:productId
   */
  static updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { price, cost, reorderLevel, unit, status, ...otherData } = req.body;

    const productData = { ...otherData };
    if (price !== undefined) productData.retailPrice = price;
    if (cost !== undefined) productData.costPrice = cost;
    if (reorderLevel !== undefined) productData.reorderThreshold = reorderLevel;
    if (status !== undefined) productData.isActive = status === 'active';

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to update this product');
    }

    // Resolve UOM if provided
    if (unit) {
      const uom = await db('unitOfMeasurements')
        .where('name', unit)
        .orWhere('abbreviation', unit)
        .first();
      if (uom) {
        productData.unitOfMeasurementId = uom.id;
      }
    }

    // Check conflict for code if updated
    if (productData.productCode && productData.productCode !== product.productCode) {
      const existing = await ProductModel.findFirst({
        productCode: productData.productCode,
        businessId: req.user.businessId,
      });
      if (existing) {
        throw new ConflictError('Product with this code already exists');
      }
    }

    const updated = await ProductModel.update(productId, productData);

    const formattedResponse = {
      id: updated.id,
      name: updated.name,
      price: parseFloat(updated.retailPrice),
      quantity: updated.quantity,
      updatedAt: updated.updatedAt,
    };

    return ApiResponse.success(res, formattedResponse, 'Product updated successfully');
  });

  /**
   * Delete product
   * DELETE /products/:productId
   */
  static deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to delete this product');
    }

    await ProductModel.delete(productId);

    return ApiResponse.success(res, null, 'Product deleted successfully');
  });

  /**
   * Get low stock products
   * GET /products/low-stock
   */
  static getLowStock = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const products = await ProductModel.getLowStock(req.user.businessId, limit);

    return ApiResponse.success(
      res,
      products,
      'Low stock products retrieved successfully',
      { pagination: { total: products.length } } // Simplified pagination as per example
    );
  });

  /**
   * Get expiring products
   * GET /products/expiring
   */
  static getExpiring = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const products = await ProductModel.getExpiringStock(req.user.businessId, days);

    return ApiResponse.success(res, products, 'Expiring products retrieved successfully');
  });
}

export default ProductController;
