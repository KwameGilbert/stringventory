import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { productSchemas } from '../validators/schemas.js';

const router = Router();

// All product routes require authentication
router.use(authenticate);

/**
 * @route GET /products
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route GET /products/low-stock
 */
router.get('/low-stock', ProductController.getLowStock);

/**
 * @route GET /products/expiring
 */
router.get('/expiring', ProductController.getExpiring);

/**
 * @route GET /products/:productId
 */
router.get('/:productId', validateParams(productSchemas.params), ProductController.getProductById);

/**
 * @route POST /products
 */
router.post('/', validateBody(productSchemas.create), ProductController.createProduct);

/**
 * @route PUT /products/:productId
 */
router.put(
  '/:productId',
  validateParams(productSchemas.params),
  validateBody(productSchemas.update),
  ProductController.updateProduct
);

/**
 * @route DELETE /products/:productId
 */
router.delete(
  '/:productId',
  validateParams(productSchemas.params),
  ProductController.deleteProduct
);

export default router;
