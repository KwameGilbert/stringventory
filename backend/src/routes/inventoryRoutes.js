import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { inventorySchemas } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

/**
 * @route GET /inventory
 * @access Private (VIEW_INVENTORY)
 */
router.get('/', requireRole('ceo', 'manager', 'sales'), InventoryController.getInventory);

/**
 * @route GET /inventory/product/:productId
 * @access Private (VIEW_INVENTORY)
 */
router.get(
  '/product/:productId',
  requireRole('ceo', 'manager', 'sales'),
  validateParams(inventorySchemas.productParams),
  InventoryController.getInventoryByProduct
);

/**
 * @route POST /inventory/add
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/add',
  requireRole('ceo', 'manager'),
  validateBody(inventorySchemas.add),
  InventoryController.addInventory
);

/**
 * @route POST /inventory/adjust
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/adjust',
  requireRole('ceo', 'manager'),
  validateBody(inventorySchemas.adjust),
  InventoryController.adjustInventory
);

/**
 * @route POST /inventory/transfer
 * @access Private (MANAGE_INVENTORY)
 */
router.post(
  '/transfer',
  requireRole('ceo', 'manager'),
  validateBody(inventorySchemas.transfer),
  InventoryController.transferInventory
);

export default router;
