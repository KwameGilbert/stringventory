import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { categorySchemas } from '../validators/schemas.js';

const router = Router();

// All category routes require authentication
router.use(authenticate);

/**
 * @route GET /categories
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/', requirePermission('VIEW_PRODUCTS'), CategoryController.getAllCategories);

/**
 * @route GET /categories/:categoryId
 * @access Private (VIEW_PRODUCTS)
 */
router.get(
  '/:categoryId',
  requirePermission('VIEW_PRODUCTS'),
  validateParams(categorySchemas.params),
  CategoryController.getCategoryById
);

/**
 * @route POST /categories
 * @access Private (MANAGE_PRODUCTS)
 */
router.post(
  '/',
  requirePermission('MANAGE_PRODUCTS'),
  validateBody(categorySchemas.create),
  CategoryController.createCategory
);

/**
 * @route PUT /categories/:categoryId
 * @access Private (MANAGE_PRODUCTS)
 */
router.put(
  '/:categoryId',
  requirePermission('MANAGE_PRODUCTS'),
  validateParams(categorySchemas.params),
  validateBody(categorySchemas.update),
  CategoryController.updateCategory
);

/**
 * @route DELETE /categories/:categoryId
 * @access Private (MANAGE_PRODUCTS)
 */
router.delete(
  '/:categoryId',
  requirePermission('MANAGE_PRODUCTS'),
  validateParams(categorySchemas.params),
  CategoryController.deleteCategory
);

export default router;
