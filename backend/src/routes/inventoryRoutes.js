import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { inventorySchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @route GET /inventory
 * @access Private (VIEW_INVENTORY)
 */
router.get('/', requirePermission('VIEW_INVENTORY'), InventoryController.getInventory);

/**
 * @route GET /inventory/product/:productId
 * @access Private (VIEW_INVENTORY)
 */
router.get(
  '/product/:productId',
  requirePermission('VIEW_INVENTORY'),
  validateParams(inventorySchemas.productParams),
  InventoryController.getInventoryByProduct
);

/**
 * @route POST /inventory/add
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/add',
  requirePermission('MANAGE_INVENTORY'),
  validateBody(inventorySchemas.add),
  InventoryController.addInventory
);

/**
 * @route POST /inventory/adjust
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/adjust',
  requirePermission('MANAGE_INVENTORY'),
  validateBody(inventorySchemas.adjust),
  InventoryController.adjustInventory
);

/**
 * @route POST /inventory/transfer
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/transfer',
  requirePermission('MANAGE_INVENTORY'),
  validateBody(inventorySchemas.transfer),
  InventoryController.transferInventory
);

export default router;
