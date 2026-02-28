import { UserModel } from '../models/UserModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { parsePagination } from '../utils/helpers.js';
import { AuditService } from '../services/AuditService.js';
import { emailService } from '../services/EmailService.js';
import { tokenService } from '../services/TokenService.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors.js';

/**
 * User Controller
 * Directly handles UserModel and coordinates with support services (Email, Audit, etc.)
 */
export class UserController {
  /**
   * List users
   * GET /users
   */
  static list = asyncHandler(async (req, res) => {
    const pagination = parsePagination(req.query);
    const result = await UserModel.findAll({
      ...pagination,
      search: req.query.search,
      filters: {
        status: req.query.status,
        role: req.query.role,
      },
    });

    return ApiResponse.paginated(res, result.data, result.pagination);
  });

  /**
   * Get user by ID
   * GET /users/:id
   */
  static getById = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return ApiResponse.success(res, user);
  });

  /**
   * Create a new user
   * POST /users
   */
  static create = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const { role, roleId, confirmPassword, ...userData } = req.body;

    // Resolve role name to roleId if needed
    let finalRoleId = roleId;
    if (role && !finalRoleId) {
      const roleRecord = await db('roles').where('name', role.toLowerCase()).first();
      if (roleRecord) {
        finalRoleId = roleRecord.id;
      }
    }

    const user = await UserModel.create({
      ...userData,
      email: email.toLowerCase(),
      roleId: finalRoleId,
      status: req.body.status || 'active',
    });

    // Side Effects
    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_CREATED, user.id, req, {
      createdBy: req.user?.id || 'admin',
    });

    const { token } = await tokenService.createVerificationToken(user.id);
    emailService
      .sendVerificationEmail(user.email, user.firstName, token)
      .catch((err) => console.error('Failed to send verification email:', err.message));

    return ApiResponse.created(res, user, 'User created successfully');
  });

  /**
   * Update user
   * PATCH /users/:id
   */
  static update = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { role, roleId, ...userData } = req.body;

    // Check if email is being changed
    if (userData.email) {
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('User with this email already exists');
      }
      userData.email = userData.email.toLowerCase();
    }

    // Resolve role name to roleId if needed
    if (role && !roleId) {
      const roleRecord = await db('roles').where('name', role.toLowerCase()).first();
      if (roleRecord) {
        userData.roleId = roleRecord.id;
      }
    } else if (roleId) {
      userData.roleId = roleId;
    }

    const user = await UserModel.update(userId, userData);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Side Effects
    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_UPDATED, userId, req, {
      updatedBy: req.user?.id,
      fields: Object.keys(userData),
    });

    return ApiResponse.success(res, user, 'User updated successfully');
  });

  /**
   * Delete user
   * DELETE /users/:id
   */
  static delete = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (req.user && req.user.id === userId) {
      throw new ForbiddenError('Cannot delete your own account');
    }

    const deleted = await UserModel.delete(userId);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    // Side Effects
    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_DELETED, userId, req, {
      deletedBy: req.user?.id,
    });

    return ApiResponse.success(res, null, 'User deleted successfully');
  });

  /**
   * Restore user
   * POST /users/:id/restore
   */
  static restore = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.restore(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Side Effects
    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_ACTIVATED, userId, req, {
      restoredBy: req.user?.id,
    });

    return ApiResponse.success(res, user, 'User restored successfully');
  });

  /**
   * Update user role
   * PATCH /users/:id/role
   */
  static updateRole = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { role, roleId } = req.body;
    let finalRoleId = roleId;

    if (role && !finalRoleId) {
      const roleRecord = await db('roles').where('name', role.toLowerCase()).first();
      if (roleRecord) {
        finalRoleId = roleRecord.id;
      }
    }

    const user = await UserModel.update(userId, { roleId: finalRoleId });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Side Effects
    await AuditService.logEvent(AuditService.EVENT_TYPES.ROLE_CHANGED, userId, req, {
      newRole: role,
      updatedBy: req.user?.id,
    });

    return ApiResponse.success(res, user, 'User role updated successfully');
  });

  /**
   * Status updates
   */
  static activate = asyncHandler(async (req, res) => {
    const user = await UserModel.update(req.params.id, { status: 'active' });
    if (!user) throw new NotFoundError('User not found');

    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_ACTIVATED, user.id, req);
    return ApiResponse.success(res, user, 'User activated successfully');
  });

  static deactivate = asyncHandler(async (req, res) => {
    const user = await UserModel.update(req.params.id, { status: 'inactive' });
    if (!user) throw new NotFoundError('User not found');

    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_DEACTIVATED, user.id, req);
    return ApiResponse.success(res, user, 'User deactivated successfully');
  });

  static suspend = asyncHandler(async (req, res) => {
    const user = await UserModel.update(req.params.id, { status: 'suspended' });
    if (!user) throw new NotFoundError('User not found');

    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_LOCKED, user.id, req);
    return ApiResponse.success(res, user, 'User suspended successfully');
  });
}

export default UserController;
