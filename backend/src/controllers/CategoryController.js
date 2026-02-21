import { CategoryModel } from '../models/CategoryModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

/**
 * Category Controller
 */
export class CategoryController {
  /**
   * Get all categories
   * GET /categories
   */
  static getAllCategories = asyncHandler(async (req, res) => {
    const result = await CategoryModel.findAllWithCounts({
      filters: { businessId: req.user.businessId },
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
    });

    return ApiResponse.paginated(
      res,
      result.data,
      result.pagination,
      'Categories retrieved successfully'
    );
  });

  /**
   * Get category by ID
   * GET /categories/:categoryId
   */
  static getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to view this category');
    }

    return ApiResponse.success(res, category, 'Category retrieved successfully');
  });

  /**
   * Create a new category
   * POST /categories
   */
  static createCategory = asyncHandler(async (req, res) => {
    const categoryData = {
      ...req.body,
      businessId: req.user.businessId,
      isActive: true, // Default to active
    };

    const existing = await CategoryModel.findFirst({
      name: categoryData.name,
      businessId: req.user.businessId,
    });

    if (existing) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = await CategoryModel.create(categoryData);

    const formattedResponse = {
      id: category.id,
      name: category.name,
      description: category.description,
      productCount: 0,
      status: category.isActive ? 'active' : 'inactive',
      createdAt: category.createdAt,
    };

    return ApiResponse.created(res, formattedResponse, 'Category created successfully');
  });

  /**
   * Update category
   * PUT /categories/:categoryId
   */
  static updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const categoryData = req.body;

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to update this category');
    }

    if (categoryData.name && categoryData.name !== category.name) {
      const existing = await CategoryModel.findFirst({
        name: categoryData.name,
        businessId: req.user.businessId,
      });
      if (existing) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    const updated = await CategoryModel.update(categoryId, categoryData);

    const formattedResponse = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      updatedAt: updated.updatedAt,
    };

    return ApiResponse.success(res, formattedResponse, 'Category updated successfully');
  });

  /**
   * Delete category
   * DELETE /categories/:categoryId
   */
  static deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to delete this category');
    }

    // Check if there are products in this category
    const { ProductModel } = await import('../models/ProductModel.js');
    const productsCount = await ProductModel.count({ categoryId });

    if (productsCount > 0) {
      throw new ConflictError('Cannot delete category with associated products');
    }

    await CategoryModel.delete(categoryId);

    return ApiResponse.success(res, null, 'Category deleted successfully');
  });
}

export default CategoryController;
