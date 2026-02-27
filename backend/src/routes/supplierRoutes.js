import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { supplierSchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @route GET /suppliers
 * @access Private (VIEW_SUPPLIERS)
 */
router.get('/', requirePermission('VIEW_SUPPLIERS'), SupplierController.getAllSuppliers);

/**
 * @route GET /suppliers/:supplierId
 * @access Private (VIEW_SUPPLIERS)
 */
router.get(
  '/:supplierId',
  requirePermission('VIEW_SUPPLIERS'),
  validateParams(supplierSchemas.params),
  SupplierController.getSupplierById
);

/**
 * @route POST /suppliers
 * @access Private (MANAGE_SUPPLIERS)
 */
router.post(
  '/',
  requirePermission('MANAGE_SUPPLIERS'),
  validateBody(supplierSchemas.create),
  SupplierController.createSupplier
);

/**
 * @route PUT /suppliers/:supplierId
 * @access Private (MANAGE_SUPPLIERS)
 */
router.put(
  '/:supplierId',
  requirePermission('MANAGE_SUPPLIERS'),
  validateParams(supplierSchemas.params),
  validateBody(supplierSchemas.update),
  SupplierController.updateSupplier
);

/**
 * @route DELETE /suppliers/:supplierId
 * @access Private (MANAGE_SUPPLIERS)
 */
router.delete(
  '/:supplierId',
  requirePermission('MANAGE_SUPPLIERS'),
  validateParams(supplierSchemas.params),
  SupplierController.deleteSupplier
);

export default router;
