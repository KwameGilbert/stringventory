import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { customerSchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', CustomerController.getAllCustomers);

router.post('/', validateBody(customerSchemas.create), CustomerController.createCustomer);

router.get(
  '/:customerId',
  validateParams(customerSchemas.params),
  CustomerController.getCustomerById
);

router.put(
  '/:customerId',
  validateParams(customerSchemas.params),
  validateBody(customerSchemas.update),
  CustomerController.updateCustomer
);

router.delete(
  '/:customerId',
  validateParams(customerSchemas.params),
  CustomerController.deleteCustomer
);

router.get(
  '/:customerId/orders',
  validateParams(customerSchemas.params),
  CustomerController.getCustomerOrders
);

export default router;
