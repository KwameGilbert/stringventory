import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { orderSchemas } from '../validators/schemas.js';
const router = Router();

router.use(authenticate);

/**
 * @route GET /orders
 * @access Private (VIEW_ORDERS)
 */
router.get('/', requirePermission('VIEW_ORDERS'), OrderController.getAllOrders);

/**
 * @route POST /orders
 * @access Private (MANAGE_ORDERS)
 */
router.post(
  '/',
  requirePermission('MANAGE_ORDERS'),
  validateBody(orderSchemas.create),
  OrderController.createOrder
);

/**
 * @route GET /orders/:orderId
 * @access Private (VIEW_ORDERS)
 */
router.get(
  '/:orderId',
  requirePermission('VIEW_ORDERS'),
  validateParams(orderSchemas.params),
  OrderController.getOrderById
);

/**
 * @route PUT /orders/:orderId
 * @access Private (MANAGE_ORDERS)
 */
router.put(
  '/:orderId',
  requirePermission('MANAGE_ORDERS'),
  validateParams(orderSchemas.params),
  validateBody(orderSchemas.update),
  OrderController.updateOrder
);

/**
 * @route DELETE /orders/:orderId
 * @access Private (MANAGE_ORDERS)
 */
router.delete(
  '/:orderId',
  requirePermission('MANAGE_ORDERS'),
  validateParams(orderSchemas.params),
  OrderController.deleteOrder
);

/**
 * @route POST /orders/:orderId/refund
 * @access Private (MANAGE_ORDERS)
 */
router.post(
  '/:orderId/refund',
  requirePermission('MANAGE_ORDERS'),
  validateParams(orderSchemas.params),
  validateBody(orderSchemas.refund),
  OrderController.createRefund
);

export default router;
