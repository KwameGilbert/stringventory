import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { categorySchemas } from '../validators/schemas.js';

const router = Router();

// All category routes require authentication
router.use(authenticate);

/**
 * @route GET /categories
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), CategoryController.getAllCategories);

/**
 * @route GET /categories/:categoryId
 * @access Private (VIEW_PRODUCTS)
 */
router.get(
  '/:categoryId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(categorySchemas.params),
  CategoryController.getCategoryById
);

/**
 * @route POST /categories
 * @access Private (MANAGE_PRODUCTS)
 */
router.post(
  '/',
  requireRole('ceo', 'manager'),
  validateBody(categorySchemas.create),
  CategoryController.createCategory
);

/**
 * @route PUT /categories/:categoryId
 * @access Private (MANAGE_PRODUCTS)
 */
router.put(
  '/:categoryId',
  requireRole('ceo', 'manager'),
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
  requireRole('ceo', 'manager'),
  validateParams(categorySchemas.params),
  CategoryController.deleteCategory
);

export default router;
