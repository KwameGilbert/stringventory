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

    const formattedData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role?.toLowerCase(), // API doc shows lowercase 'ceo'
      status: user.status,
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

    // 3. Resolve role string to roleId or vice-versa to ensure consistency
    if (userData.role && !userData.roleId) {
      const roleRecord = await db('roles').where('name', userData.role.toLowerCase()).first();
      if (roleRecord) {
        userData.roleId = roleRecord.id;
      }
    } else if (userData.roleId && !userData.role) {
      const roleRecord = await db('roles').where('id', userData.roleId).first();
      if (roleRecord) {
        userData.role = roleRecord.name;
      }
    }

    // Ensure 'role' field is removed before the model tries to insert it into DB
    // since the 'role' column was dropped in favor of 'roleId'
    const finalRoleName = userData.role || 'user';
    delete userData.role;

    // 4. Create user
    const newUser = await UserModel.create(userData);

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

    // Resolve role string if roleId is provided or vice-versa
    if (userData.role && !userData.roleId) {
      const roleRecord = await db('roles').where('name', userData.role.toLowerCase()).first();
      if (roleRecord) {
        userData.roleId = roleRecord.id;
      }
    }

    // Ensure 'role' field is removed so Knex doesn't try to update a non-existent column
    delete userData.role;

    const updatedUser = await UserModel.update(userId, userData);

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
