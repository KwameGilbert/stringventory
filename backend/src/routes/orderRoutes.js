import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { orderSchemas } from '../validators/schemas.js';
const router = Router();

router.use(authenticate);

router.get('/', OrderController.getAllOrders);

router.post('/', validateBody(orderSchemas.create), OrderController.createOrder);

router.get('/:orderId', validateParams(orderSchemas.params), OrderController.getOrderById);

router.put(
  '/:orderId',
  validateParams(orderSchemas.params),
  validateBody(orderSchemas.update),
  OrderController.updateOrder
);

router.delete('/:orderId', validateParams(orderSchemas.params), OrderController.deleteOrder);

router.post(
  '/:orderId/refund',
  validateParams(orderSchemas.params),
  validateBody(orderSchemas.refund),
  OrderController.createRefund
);

export default router;
