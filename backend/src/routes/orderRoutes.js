import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { orderSchemas } from '../validators/schemas.js';
const router = Router();

router.use(authenticate);

/**
 * @route GET /orders
 * @access Private (VIEW_ORDERS)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), OrderController.getAllOrders);

/**
 * @route POST /orders
 * @access Private (MANAGE_ORDERS)
 */
router.post(
  '/',
  requireRole('ceo', 'manager', 'sales'),
  validateBody(orderSchemas.create),
  OrderController.createOrder
);

/**
 * @route GET /orders/:orderId
 * @access Private (VIEW_ORDERS)
 */
router.get(
  '/:orderId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(orderSchemas.params),
  OrderController.getOrderById
);

/**
 * @route PUT /orders/:orderId
 * @access Private (MANAGE_ORDERS)
 */
router.put(
  '/:orderId',
  requireRole('ceo', 'manager'),
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
  requireRole('ceo', 'manager'),
  validateParams(orderSchemas.params),
  OrderController.deleteOrder
);

/**
 * @route POST /orders/:orderId/refund
 * @access Private (MANAGE_ORDERS)
 */
router.post(
  '/:orderId/refund',
  requireRole('ceo', 'manager'),
  validateParams(orderSchemas.params),
  validateBody(orderSchemas.refund),
  OrderController.createRefund
);

export default router;
