import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { supplierSchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', SupplierController.getAllSuppliers);

router.get(
  '/:supplierId',
  validateParams(supplierSchemas.params),
  SupplierController.getSupplierById
);

router.post('/', validateBody(supplierSchemas.create), SupplierController.createSupplier);

router.put(
  '/:supplierId',
  validateParams(supplierSchemas.params),
  validateBody(supplierSchemas.update),
  SupplierController.updateSupplier
);

router.delete(
  '/:supplierId',
  validateParams(supplierSchemas.params),
  SupplierController.deleteSupplier
);

export default router;
