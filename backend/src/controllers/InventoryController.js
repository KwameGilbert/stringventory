import { InventoryModel } from '../models/InventoryModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { ProductModel } from '../models/ProductModel.js';

/**
 * Inventory Controller
 */
export class InventoryController {
  /**
   * Get inventory list
   */
  static getInventory = asyncHandler(async (req, res) => {
    const result = await InventoryModel.getSummary({
      filters: { businessId: req.user.businessId, status: req.query.status },
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Inventory retrieved successfully'
    );
  });

  /**
   * Get inventory by product
   */
  static getInventoryByProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const inventory = await InventoryModel.getProductInventory(productId, req.user.businessId);

    if (!inventory) {
      throw new NotFoundError('Inventory record not found for this product');
    }

    return ApiResponse.success(res, inventory, 'Inventory retrieved successfully');
  });

  /**
   * Add inventory
   */
  static addInventory = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.body.productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.businessId !== req.user.businessId) throw new ForbiddenError('Access denied');

    const result = await InventoryModel.addStock(req.body, req.user.id);

    return ApiResponse.success(res, result, 'Inventory added successfully');
  });

  /**
   * Adjust inventory
   */
  static adjustInventory = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.body.productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.businessId !== req.user.businessId) throw new ForbiddenError('Access denied');

    const result = await InventoryModel.adjustStock(req.body, req.user.id);

    return ApiResponse.success(res, result, 'Inventory adjusted successfully');
  });

  /**
   * Transfer inventory
   */
  static transferInventory = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.body.productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.businessId !== req.user.businessId) throw new ForbiddenError('Access denied');

    const result = await InventoryModel.transferStock(req.body, req.user.id);

    return ApiResponse.success(res, result, 'Inventory transferred successfully');
  });
}

export default InventoryController;
