import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { customerSchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @route GET /customers
 * @access Private (VIEW_CUSTOMERS)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), CustomerController.getAllCustomers);

/**
 * @route POST /customers
 * @access Private (MANAGE_CUSTOMERS)
 */
router.post(
  '/',
  requireRole('ceo', 'manager'),
  validateBody(customerSchemas.create),
  CustomerController.createCustomer
);

/**
 * @route GET /customers/:customerId
 * @access Private (VIEW_CUSTOMERS)
 */
router.get(
  '/:customerId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(customerSchemas.params),
  CustomerController.getCustomerById
);

/**
 * @route PUT /customers/:customerId
 * @access Private (MANAGE_CUSTOMERS)
 */
router.put(
  '/:customerId',
  requireRole('ceo', 'manager'),
  validateParams(customerSchemas.params),
  validateBody(customerSchemas.update),
  CustomerController.updateCustomer
);

/**
 * @route DELETE /customers/:customerId
 * @access Private (MANAGE_CUSTOMERS)
 */
router.delete(
  '/:customerId',
  requireRole('ceo', 'manager'),
  validateParams(customerSchemas.params),
  CustomerController.deleteCustomer
);

/**
 * @route GET /customers/:customerId/orders
 * @access Private (VIEW_CUSTOMERS)
 */
router.get(
  '/:customerId/orders',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(customerSchemas.params),
  CustomerController.getCustomerOrders
);

export default router;
