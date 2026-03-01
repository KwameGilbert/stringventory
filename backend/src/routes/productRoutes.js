import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { productSchemas } from '../validators/schemas.js';

const router = Router();

// All product routes require authentication
router.use(authenticate);

/**
 * @route GET /products
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), ProductController.getAllProducts);

/**
 * @route GET /products/low-stock
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/low-stock', requireRole('ceo', 'manager', 'sales'), ProductController.getLowStock);

/**
 * @route GET /products/expiring
 * @access Private (VIEW_PRODUCTS)
 */
router.get('/expiring', requireRole('ceo', 'manager', 'sales'), ProductController.getExpiring);

/**
 * @route GET /products/:productId
 * @access Private (VIEW_PRODUCTS)
 */
router.get(
  '/:productId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(productSchemas.params),
  ProductController.getProductById
);

/**
 * @route POST /products
 * @access Private (MANAGE_PRODUCTS)
 */
router.post(
  '/',
  requireRole('ceo', 'manager'),
  validateBody(productSchemas.create),
  ProductController.createProduct
);

/**
 * @route PUT /products/:productId
 * @access Private (MANAGE_PRODUCTS)
 */
router.put(
  '/:productId',
  requireRole('ceo', 'manager'),
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
  requireRole('ceo', 'manager'),
  validateParams(productSchemas.params),
  ProductController.deleteProduct
);

export default router;
