import { db } from '../config/database.js';
import { UserModel } from '../models/UserModel.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { parsePagination } from '../utils/helpers.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';
import { emailService } from '../services/EmailService.js';
import { tokenService } from '../services/TokenService.js';

/**
 * Admin Controller
 * Handles administrative operations
 */
export class AdminController {
  /**
   * Get all users
   * GET /admin/users
   */
  static getAllUsers = asyncHandler(async (req, res) => {
    const pagination = parsePagination(req.query);
    const filters = {
      status: req.query.status,
      role: req.query.role,
    };

    // CEOs can only see users within their own business
    // Admins and Super Admins can see everyone
    if (req.user.role === 'ceo') {
      filters.businessId = req.user.businessId;
    }

    const result = await UserModel.findAll({
      ...pagination,
      search: req.query.search,
      filters,
    });

    // Map fields to match requested format
    const formattedData = result.data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role?.toUpperCase(),
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLoginAt,
    }));

    return ApiResponse.paginated(
      res,
      formattedData,
      result.pagination,
      'Users retrieved successfully'
    );
  });

  /**
   * Get user by ID
   * GET /admin/users/:userId
   */
  static getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // CEOs can only see users within their own business
    if (req.user.role === 'ceo' && user.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to view this user');
    }

    const permissions = await UserModel.getUserPermissions(userId);

    const formattedData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role?.toLowerCase(), // API doc shows lowercase 'ceo'
      status: user.status,
      permissions,
      createdAt: user.createdAt,
    };

    return ApiResponse.success(res, formattedData, 'User retrieved successfully');
  });

  /**
   * Create a new user
   * POST /admin/users
   */
  static createUser = asyncHandler(async (req, res) => {
    const { permissions, twoFactorEnabled, ...userData } = req.body;

    // 1. Business Level Security Check
    if (req.user.role === 'ceo') {
      userData.businessId = req.user.businessId;
    }

    // Map request field to DB field
    if (twoFactorEnabled !== undefined) {
      userData.mfaEnabled = twoFactorEnabled;
    }

    // 2. Check for existing email
    const email = userData.email.toLowerCase();
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }
    userData.email = email;

    // 3. Resolve role string from roleId if provided
    if (userData.roleId) {
      const roleRecord = await db('roles').where('id', userData.roleId).first();
      if (roleRecord) {
        userData.role = roleRecord.name;
      }
    }

    // 4. Create user and permissions in a transaction
    const newUser = await db.transaction(async (trx) => {
      // Create primary user record
      const user = await UserModel.create(userData, trx);

      // Determine which permissions to assign
      let permissionIds = [];

      if (permissions && permissions.length > 0) {
        // Use explicitly provided permissions
        const permissionRecords = await trx('permissions').whereIn('key', permissions).select('id');
        permissionIds = permissionRecords.map((p) => p.id);
      } else {
        // No permissions provided – assign defaults based on role
        const resolvedRole = (userData.role || 'user').toLowerCase();

        if (resolvedRole === 'admin' || resolvedRole === 'ceo') {
          // Admin/CEO get ALL permissions
          const allPerms = await trx('permissions').select('id');
          permissionIds = allPerms.map((p) => p.id);
        } else {
          // Look up role record and copy its role_permissions as defaults
          const roleRecord = await trx('roles').where('name', resolvedRole).first();
          if (roleRecord) {
            const rolePerms = await trx('role_permissions')
              .where('roleId', roleRecord.id)
              .select('permissionId');
            permissionIds = rolePerms.map((p) => p.permissionId);
          } else {
            // Fallback: basic default permissions
            const defaultPerms = await trx('permissions')
              .whereIn('key', [
                'VIEW_DASHBOARD',
                'VIEW_PRODUCTS',
                'VIEW_ORDERS',
                'VIEW_INVENTORY',
                'VIEW_PROFILE',
                'EDIT_PROFILE',
                'VIEW_NOTIFICATIONS',
              ])
              .select('id');
            permissionIds = defaultPerms.map((p) => p.id);
          }
        }
      }

      // Insert user_permissions
      if (permissionIds.length > 0) {
        const userPerms = permissionIds.map((permId) => ({
          userId: user.id,
          permissionId: permId,
        }));
        await trx('user_permissions').insert(userPerms);
      }

      return user;
    });

    return ApiResponse.created(res, newUser, 'User created successfully');
  });

  /**
   * Update user
   * PUT /admin/users/:userId
   */
  static updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { permissions, twoFactorEnabled, ...userData } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business Level Security Check
    if (req.user.role === 'ceo' && user.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to update this user');
    }

    // Map request field to DB field
    if (twoFactorEnabled !== undefined) {
      userData.mfaEnabled = twoFactorEnabled;
    }

    // Check email conflict
    if (userData.email) {
      const email = userData.email.toLowerCase();
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError('User with this email already exists');
      }
      userData.email = email;
    }

    // Resolve role string if roleId is provided
    if (userData.roleId) {
      const roleRecord = await db('roles').where('id', userData.roleId).first();
      if (roleRecord) {
        userData.role = roleRecord.name;
      }
    }

    const updatedUser = await db.transaction(async (trx) => {
      // 1. Update primary user record
      const updated = await UserModel.update(userId, userData, trx);

      // 2. Update permissions if provided
      if (permissions !== undefined) {
        // Clear existing direct permissions
        await trx('user_permissions').where('userId', userId).del();

        if (permissions.length > 0) {
          const permissionRecords = await trx('permissions')
            .whereIn('key', permissions)
            .select('id');

          const userPerms = permissionRecords.map((p) => ({
            userId: user.id,
            permissionId: p.id,
          }));

          await trx('user_permissions').insert(userPerms);
        }
      }

      return updated;
    });

    return ApiResponse.success(res, updatedUser, 'User updated successfully');
  });

  /**
   * Delete user
   * DELETE /admin/users/:userId
   */
  static deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (req.user.id === userId) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business Level Security Check
    if (req.user.role === 'ceo' && user.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to delete this user');
    }

    await UserModel.delete(userId);

    return ApiResponse.success(res, null, 'User deleted successfully');
  });

  /**
   * Get user permissions
   * GET /admin/users/:userId/permissions
   */
  static getUserPermissions = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business Level Security Check
    if (req.user.role === 'ceo' && user.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to view these permissions');
    }

    const permissions = await UserModel.getUserPermissionsDetailed(userId);

    return ApiResponse.success(
      res,
      {
        userId,
        role: user.role?.toUpperCase(),
        permissions,
      },
      'User permissions retrieved successfully'
    );
  });

  /**
   * Resend verification email
   * POST /admin/users/:userId/resend-verification
   */
  static resendVerification = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Business Level Security Check
    if (req.user.role === 'ceo' && user.businessId !== req.user.businessId) {
      throw new ForbiddenError('You do not have permission to resend verification for this user');
    }

    if (user.emailVerifiedAt || user.emailVerified) {
      throw new ConflictError('User is already verified');
    }

    const { token } = await tokenService.createVerificationToken(user.id);

    await emailService.sendVerificationEmail(user.email, user.firstName, token);

    return ApiResponse.success(res, null, 'Verification email sent successfully');
  });
}

export default AdminController;
