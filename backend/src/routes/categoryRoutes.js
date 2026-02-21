import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { categorySchemas } from '../validators/schemas.js';

const router = Router();

// All category routes require authentication
router.use(authenticate);

/**
 * @route GET /categories
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @route GET /categories/:categoryId
 */
router.get(
  '/:categoryId',
  validateParams(categorySchemas.params),
  CategoryController.getCategoryById
);

/**
 * @route POST /categories
 */
router.post('/', validateBody(categorySchemas.create), CategoryController.createCategory);

/**
 * @route PUT /categories/:categoryId
 */
router.put(
  '/:categoryId',
  validateParams(categorySchemas.params),
  validateBody(categorySchemas.update),
  CategoryController.updateCategory
);

/**
 * @route DELETE /categories/:categoryId
 */
router.delete(
  '/:categoryId',
  validateParams(categorySchemas.params),
  CategoryController.deleteCategory
);

export default router;
