import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { productSchemas } from '../validators/schemas.js';

const router = Router();

// All product routes require authentication
router.use(authenticate);

/**
 * @route GET /products
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/', requirePermission('VIEW_PRODUCTS'), ProductController.getAllProducts);

/**
 * @route GET /products/low-stock
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/low-stock', requirePermission('VIEW_PRODUCTS'), ProductController.getLowStock);

/**
 * @route GET /products/expiring
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/expiring', requirePermission('VIEW_PRODUCTS'), ProductController.getExpiring);

/**
 * @route GET /products/:productId
 * @access Private (VIEW_PRODUCTS)
 */
router.get(
  '/:productId',
  requirePermission('VIEW_PRODUCTS'),
  validateParams(productSchemas.params),
  ProductController.getProductById
);

/**
 * @route POST /products
 * @access Private (MANAGE_PRODUCTS)
 */
router.post(
  '/',
  requirePermission('MANAGE_PRODUCTS'),
  validateBody(productSchemas.create),
  ProductController.createProduct
);

/**
 * @route PUT /products/:productId
 * @access Private (MANAGE_PRODUCTS)
 */
router.put(
  '/:productId',
  requirePermission('MANAGE_PRODUCTS'),
  validateParams(productSchemas.params),
  validateBody(productSchemas.update),
  ProductController.updateProduct
);

/**
 * @route DELETE /products/:productId
 * @access Private (MANAGE_PRODUCTS)
 */
router.delete(
  '/:productId',
  requirePermission('MANAGE_PRODUCTS'),
  validateParams(productSchemas.params),
  ProductController.deleteProduct
);

export default router;
