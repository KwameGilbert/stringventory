import { db } from '../config/database.js';
import { SupplierModel } from '../models/SupplierModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

/**
 * Supplier Controller
 */
export class SupplierController {
  /**
   * Get all suppliers
   */
  static getAllSuppliers = asyncHandler(async (req, res) => {
    const filters = {
      businessId: req.user.businessId,
      status: req.query.status,
    };

    const result = await SupplierModel.findAllWithStats({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      filters,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Suppliers retrieved successfully'
    );
  });

  /**
   * Get supplier by ID
   */
  static getSupplierById = asyncHandler(async (req, res) => {
    const { supplierId } = req.params;

    const supplier = await SupplierModel.findByIdWithStats(supplierId);

    if (!supplier) {
      throw new NotFoundError('Supplier not found');
    }

    if (supplier.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to view this supplier');
    }

    return ApiResponse.success(res, supplier, 'Supplier retrieved successfully');
  });

  /**
   * Create supplier
   */
  static createSupplier = asyncHandler(async (req, res) => {
    const supplierData = {
      ...req.body,
      businessId: req.user.businessId,
      isActive: true,
    };

    // Check conflict
    const existing = await SupplierModel.findFirst({
      name: supplierData.name,
      businessId: req.user.businessId,
    });

    if (existing) {
      throw new ConflictError('Supplier with this name already exists');
    }

    const supplier = await SupplierModel.create(supplierData);

    const formattedResponse = {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      status: supplier.isActive ? 'active' : 'inactive',
      createdAt: supplier.createdAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Supplier created successfully');
  });

  /**
   * Update supplier
   */
  static updateSupplier = asyncHandler(async (req, res) => {
    const { supplierId } = req.params;
    const { status, ...otherData } = req.body;

    const supplierData = { ...otherData };
    if (status !== undefined) supplierData.isActive = status === 'active';

    const supplier = await SupplierModel.findById(supplierId);
    if (!supplier) {
      throw new NotFoundError('Supplier not found');
    }

    if (supplier.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to update this supplier');
    }

    if (supplierData.name && supplierData.name !== supplier.name) {
      const existing = await SupplierModel.findFirst({
        name: supplierData.name,
        businessId: req.user.businessId,
      });
      if (existing) {
        throw new ConflictError('Supplier with this name already exists');
      }
    }

    const updated = await SupplierModel.update(supplierId, supplierData);

    const formattedResponse = {
      id: updated.id,
      name: updated.name,
      paymentTerms: updated.paymentTerms,
      updatedAt: updated.updatedAt,
    };

    return ApiResponse.success(res, formattedResponse, 'Supplier updated successfully');
  });

  /**
   * Delete supplier
   */
  static deleteSupplier = asyncHandler(async (req, res) => {
    const { supplierId } = req.params;

    const supplier = await SupplierModel.findById(supplierId);
    if (!supplier) {
      throw new NotFoundError('Supplier not found');
    }

    if (supplier.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to delete this supplier');
    }

    // Check if there are products or purchases associated
    const productsCount = await db('products').where({ supplierId }).count('* as count');
    const purchasesCount = await db('purchases').where({ supplierId }).count('* as count');

    if (parseInt(productsCount[0].count) > 0 || parseInt(purchasesCount[0].count) > 0) {
      throw new ConflictError('Cannot delete supplier with associated products or purchases');
    }

    await SupplierModel.delete(supplierId);

    return ApiResponse.success(res, null, 'Supplier deleted successfully');
  });
}

export default SupplierController;
