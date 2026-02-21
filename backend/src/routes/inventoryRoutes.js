import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { inventorySchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', InventoryController.getInventory);

router.get(
  '/product/:productId',
  validateParams(inventorySchemas.productParams),
  InventoryController.getInventoryByProduct
);

router.post('/add', validateBody(inventorySchemas.add), InventoryController.addInventory);

router.post('/adjust', validateBody(inventorySchemas.adjust), InventoryController.adjustInventory);

router.post(
  '/transfer',
  validateBody(inventorySchemas.transfer),
  InventoryController.transferInventory
);

export default router;
