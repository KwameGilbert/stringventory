import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { supplierSchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @route GET /suppliers
 * @access Private (VIEW_SUPPLIERS)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), SupplierController.getAllSuppliers);

/**
 * @route GET /suppliers/:supplierId
 * @access Private (VIEW_SUPPLIERS)
 */
router.get(
  '/:supplierId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(supplierSchemas.params),
  SupplierController.getSupplierById
);

/**
 * @route POST /suppliers
 * @access Private (MANAGE_SUPPLIERS)
 */
router.post(
  '/',
  requireRole('ceo', 'manager'),
  validateBody(supplierSchemas.create),
  SupplierController.createSupplier
);

/**
 * @route PUT /suppliers/:supplierId
 * @access Private (MANAGE_SUPPLIERS)
 */
router.put(
  '/:supplierId',
  requireRole('ceo', 'manager'),
  validateParams(supplierSchemas.params),
  validateBody(supplierSchemas.update),
  SupplierController.updateSupplier
);

/**
 * @route DELETE /suppliers/:supplierId
 * @access Private
 */
router.delete(
  '/:supplierId',
  requireRole('ceo', 'manager'),
  validateParams(supplierSchemas.params),
  SupplierController.deleteSupplier
);

export default router;
