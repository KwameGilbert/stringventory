import { Router } from 'express';
import { AdminController } from '../controllers/AdminController.js';
import { authenticate, requireRole, requirePermission } from '../middlewares/auth.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { adminSchemas } from '../validators/schemas.js';

const router = Router();

// All admin routes require authentication and admin/ceo role
router.use(authenticate);
router.use(requireRole('admin', 'ceo', 'super_admin'));

/**
 * @route GET /admin/users
 * @desc Get all users with filtering and pagination
 * @access Private (Admin/CEO + VIEW_USERS)
 */
router.get('/users', requirePermission('VIEW_USERS'), AdminController.getAllUsers);

/**
 * @route GET /admin/users/:userId
 * @desc Get user by ID with permissions
 * @access Private (Admin/CEO + VIEW_USERS)
 */
router.get('/users/:userId', requirePermission('VIEW_USERS'), AdminController.getUserById);

/**
 * @route POST /admin/users
 * @desc Create a new user with role and permissions
 * @access Private (Admin/CEO + MANAGE_USERS)
 */
router.post(
  '/users',
  requirePermission('MANAGE_USERS'),
  validateBody(adminSchemas.createUser),
  AdminController.createUser
);

/**
 * @route PUT /admin/users/:userId
 * @desc Update user
 * @access Private (Admin/CEO + MANAGE_USERS)
 */
router.put(
  '/users/:userId',
  requirePermission('MANAGE_USERS'),
  validateParams(adminSchemas.params),
  validateBody(adminSchemas.updateUser),
  AdminController.updateUser
);

/**
 * @route DELETE /admin/users/:userId
 * @desc Delete user
 * @access Private (Admin/CEO + MANAGE_USERS)
 */
router.delete(
  '/users/:userId',
  requirePermission('MANAGE_USERS'),
  validateParams(adminSchemas.params),
  AdminController.deleteUser
);

/**
 * @route GET /admin/users/:userId/permissions
 * @desc Get user permissions
 * @access Private (Admin/CEO + VIEW_USERS)
 */
router.get(
  '/users/:userId/permissions',
  requirePermission('VIEW_USERS'),
  validateParams(adminSchemas.params),
  AdminController.getUserPermissions
);

/**
 * @route POST /admin/users/:userId/resend-verification
 * @desc Resend verification email
 * @access Private (Admin/CEO + MANAGE_USERS)
 */
router.post(
  '/users/:userId/resend-verification',
  requirePermission('MANAGE_USERS'),
  validateParams(adminSchemas.params),
  AdminController.resendVerification
);

export default router;
