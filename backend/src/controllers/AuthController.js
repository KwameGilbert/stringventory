import { UserModel } from '../models/UserModel.js';
import { BusinessModel } from '../models/BusinessModel.js';
import { db } from '../config/database.js';
import { generateTokenPair, generateAccessToken } from '../utils/jwt.js';
import { tokenService } from '../services/TokenService.js';
import { emailService } from '../services/EmailService.js';
import { SecurityService } from '../services/SecurityService.js';
import { SessionService } from '../services/SessionService.js';
import { AuditService } from '../services/AuditService.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { logFailedLogin } from '../middlewares/advancedRateLimiter.js';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';

/**
 * Enhanced Authentication Controller
 * Handles the authentication lifecycle directly:
 * - Registration
 * - Login
 * - Password Management
 * - Email Verification
 */
export class AuthController {
  // Constants for default assignments
  static DEFAULT_PLAN_ID = '5f4dcc3b-5aa7-4efc-a502-4fc93d6593d1'; // Free plan

  /**
   * Register a new user with business creation and subscription
   * POST /auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      businessName,
      businessType,
      role = 'user',
    } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    let user = null;
    let business = null;

    // Use transaction to ensure business and user are created together
    await db.transaction(async (trx) => {
      // 1. Create Business with default subscription
      business = await BusinessModel.create(
        {
          name: businessName,
          type: businessType,
          subscriptionPlanId: AuthController.DEFAULT_PLAN_ID,
          subscriptionStatus: 'active',
        },
        trx
      );

      // 2. Create User linked to business
      user = await UserModel.create(
        {
          email: email.toLowerCase(),
          password,
          firstName,
          lastName,
          phone,
          businessId: business.id,
          role,
          status: 'active',
          emailVerifiedAt: null,
        },
        trx
      );

      // 3. Assign default permissions based on role
      const normalizedRole = role.toLowerCase();
      let defaultPermKeys;

      if (normalizedRole === 'admin' || normalizedRole === 'ceo') {
        // Admin/CEO get ALL permissions
        const allPerms = await trx('permissions').select('id');
        defaultPermKeys = allPerms;
      } else {
        // Other roles: look up the role record and copy its role_permissions
        const roleRecord = await trx('roles').where('name', normalizedRole).first();
        if (roleRecord) {
          defaultPermKeys = await trx('role_permissions')
            .where('roleId', roleRecord.id)
            .select('permissionId as id');
        } else {
          // Fallback: give basic default permissions for unknown roles
          defaultPermKeys = await trx('permissions')
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
        }
      }

      if (defaultPermKeys && defaultPermKeys.length > 0) {
        const userPerms = defaultPermKeys.map((p) => ({
          userId: user.id,
          permissionId: p.id,
        }));
        await trx('user_permissions').insert(userPerms);
      }
    });

    // Generate auth tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    };

    const tokens = generateTokenPair(tokenPayload);

    // Side Effects (Async)
    AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_CREATED, user.id, req).catch((err) =>
      console.error('Failed to log registration event:', err)
    );

    tokenService
      .createVerificationToken(user.id)
      .then(({ token }) => {
        return emailService.sendVerificationEmail(user.email, user.firstName, token);
      })
      .catch((err) => console.error('Failed to send verification email:', err.message));

    // Optionally create session
    let session = null;
    try {
      const sessionData = await SessionService.createSession(user.id, req, false);
      session = sessionData.session;
      tokens.refreshToken = sessionData.refreshToken;
    } catch (error) {
      console.error('Failed to create session during registration:', error);
    }

    // Fetch the user's assigned permissions
    const permissions = await UserModel.getUserPermissions(user.id);

    const responseData = {
      user: {
        ...user,
        businessName: business.name,
        businessType: business.type,
        permissions,
      },
      ...tokens,
      session,
    };

    return ApiResponse.created(
      res,
      responseData,
      'Registration successful. Please check your email to verify your account.'
    );
  });

  /**
   * Enhanced login with session management and subscription info
   * POST /auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    const identifier = email.toLowerCase();

    try {
      // 1. Security check
      await SecurityService.performSecurityCheck(identifier, req, {
        maxAttempts: 5,
        windowMinutes: 15,
      });

      // 2. Find user with password
      const userRaw = await UserModel.findByEmailWithPassword(identifier);

      if (!userRaw) {
        // Log failure
        await SecurityService.logLoginAttempt({
          userId: null,
          identifier,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          success: false,
          failureReason: 'user_not_found',
        });
        await AuditService.logLoginFailure(identifier, 'user_not_found', req);

        throw new UnauthorizedError('Invalid email or password');
      }

      // 3. Status check
      if (userRaw.status !== 'active') {
        await SecurityService.logLoginAttempt({
          userId: userRaw.id,
          identifier,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          success: false,
          failureReason: `account_${userRaw.status}`,
        });
        throw new UnauthorizedError(`Your account is ${userRaw.status}`);
      }

      // 4. Password validation
      const isValidPassword = await UserModel.comparePassword(password, userRaw.passwordHash);

      if (!isValidPassword) {
        // Log failure
        await SecurityService.logLoginAttempt({
          userId: userRaw.id,
          identifier,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          success: false,
          failureReason: 'invalid_password',
        });
        await AuditService.logLoginFailure(identifier, 'invalid_password', req);

        throw new UnauthorizedError('Invalid email or password');
      }

      // 5. Update user stats
      await UserModel.update(userRaw.id, { lastLoginAt: new Date() });

      // 6. Create session
      const { session, refreshToken } = await SessionService.createSession(
        userRaw.id,
        req,
        rememberMe
      );

      // 7. Get full user details including subscription
      const user = await UserModel.findUserWithDetails(userRaw.id);

      // 8. Get user permissions
      const permissions = await UserModel.getUserPermissions(userRaw.id);

      // 9. Success responses & Logging
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
      };

      const accessToken = generateAccessToken(tokenPayload);

      await SecurityService.logLoginAttempt({
        userId: user.id,
        identifier,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        success: true,
      });

      await AuditService.logLoginSuccess(user.id, req);

      // Format response exactly as requested
      return ApiResponse.success(
        res,
        {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role?.toUpperCase(),
            status: user.status,
            businessId: user.businessId,
            subscriptionPlan: user.subscriptionPlan || 'free',
            subscriptionStatus: user.subscriptionStatus || 'active',
            permissions,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 3600,
          },
        },
        'User logged in successfully'
      );
    } catch (error) {
      // Log failed login attempt for the limiter
      await logFailedLogin(email, error.message, req);
      throw error;
    }
  });

  /**
   * Refresh access token with rotation
   * POST /auth/refresh-token
   */
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken: oldToken } = req.body;

    const tokens = await SessionService.refreshToken(oldToken, req);

    return ApiResponse.success(
      res,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 3600,
      },
      'Token refreshed successfully'
    );
  });

  /**
   * Get current user profile
   * GET /auth/me
   */
  static getProfile = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) throw new NotFoundError('User not found');

    return ApiResponse.success(res, user);
  });

  /**
   * Update current user profile
   * PATCH /auth/me
   */
  static updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { password, role, status, emailVerifiedAt, ...safeData } = req.body;

    const user = await UserModel.update(userId, safeData);

    if (!user) throw new NotFoundError('User not found');

    await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_UPDATED, userId, req, {
      fields: Object.keys(safeData),
    });

    return ApiResponse.success(res, user, 'Profile updated successfully');
  });

  /**
   * Change password
   * POST /auth/change-password
   */
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const isValid = await UserModel.verifyPassword(userId, currentPassword);

    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const user = await UserModel.update(userId, {
      password: newPassword,
    });

    await AuditService.logEvent(AuditService.EVENT_TYPES.PASSWORD_CHANGED, userId, req);

    if (user) {
      emailService
        .sendPasswordChangedEmail(user.email, user.firstName)
        .catch((err) => console.error('Failed to send password changed email:', err.message));
    }

    return ApiResponse.success(res, null, 'Password changed successfully');
  });

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);

    if (user) {
      const { token } = await tokenService.createPasswordResetToken(user.id);

      await AuditService.logEvent(AuditService.EVENT_TYPES.PASSWORD_RESET_REQUESTED, user.id, req);

      emailService
        .sendPasswordResetEmail(user.email, user.firstName, token)
        .catch((err) => console.error('Failed to send reset email:', err.message));
    }

    return ApiResponse.success(
      res,
      null,
      'If an account exists with this email, you will receive a password reset link'
    );
  });

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const tokenRecord = await tokenService.verifyPasswordResetToken(token);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const user = await UserModel.update(tokenRecord.userId, {
      password: newPassword,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await AuditService.logEvent(AuditService.EVENT_TYPES.PASSWORD_RESET_COMPLETED, user.id, req);

    emailService
      .sendPasswordChangedEmail(user.email, user.firstName)
      .catch((err) => console.error('Failed to send password changed email:', err.message));

    return ApiResponse.success(res, null, 'Password reset successfully');
  });

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  static verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return ApiResponse.badRequest(res, 'Verification token is required');
    }

    const tokenRecord = await tokenService.verifyVerificationToken(token);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    const user = await UserModel.update(tokenRecord.userId, {
      emailVerifiedAt: new Date(),
      status: 'active',
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await AuditService.logEvent(AuditService.EVENT_TYPES.EMAIL_VERIFIED, user.id, req);

    emailService
      .sendWelcomeEmail(user.email, user.firstName)
      .catch((err) => console.error('Failed to send welcome email:', err.message));

    return ApiResponse.success(res, null, 'Email verified successfully');
  });

  /**
   * Logout from current session
   * POST /auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await SessionService.revokeSessionByToken(refreshToken);
    } else {
      // Fallback: If no refreshToken provided, but we have a user from auth middleware,
      // we could revoke all their sessions or just the current one if we had sessionId in token.
      // For now, if no refreshToken, we'll just log the event.
      if (req.user?.id) {
        await AuditService.logEvent(AuditService.EVENT_TYPES.LOGOUT, req.user.id, req);
      }
    }

    return ApiResponse.success(res, null, 'User logged out successfully');
  });

  /**
   * Logout from all sessions (all devices)
   * POST /auth/logout-all
   */
  static logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await AuditService.logEvent(AuditService.EVENT_TYPES.LOGOUT_ALL, userId, req);
    const revokedCount = await SessionService.revokeAllUserSessions(userId);

    return ApiResponse.success(
      res,
      { revokedSessions: revokedCount },
      `Logged out from ${revokedCount} session(s) successfully`
    );
  });

  /**
   * Logout from other sessions (keep current)
   * POST /auth/logout-others
   */
  static logoutOthers = asyncHandler(async (req, res) => {
    const { currentSessionId } = req.body;
    const userId = req.user.id;

    if (!currentSessionId) {
      return ApiResponse.badRequest(res, 'Current session ID is required');
    }

    const revokedCount = await SessionService.revokeOtherSessions(userId, currentSessionId);

    return ApiResponse.success(
      res,
      { revokedSessions: revokedCount },
      `Logged out from ${revokedCount} other session(s) successfully`
    );
  });

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  static resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);

    // Security: Don't reveal if user exists, but only send if unverified
    if (user && !user.emailVerifiedAt) {
      const { token } = await tokenService.createVerificationToken(user.id);

      await emailService.sendVerificationEmail(user.email, user.firstName, token);

      // Log for security monitoring
      console.log(`Verification email resent to ${email}`);
    }

    return ApiResponse.success(
      res,
      null,
      'If your email is registered and not verified, you will receive a verification link'
    );
  });

  /**
   * Get user's active sessions
   * GET /auth/sessions
   */
  static getSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const sessions = await SessionService.getUserActiveSessions(userId);

    return ApiResponse.success(res, { sessions, count: sessions.length });
  });

  /**
   * Revoke a specific session
   * DELETE /auth/sessions/:sessionId
   */
  static revokeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    await SessionService.revokeSession(sessionId, req);

    return ApiResponse.success(res, null, 'Session revoked successfully');
  });

  /**
   * Get login history
   * GET /auth/login-history
   */
  static getLoginHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const history = await SecurityService.getLoginHistory(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return ApiResponse.success(res, history);
  });

  /**
   * Get user audit trail
   * GET /auth/audit-logs
   */
  static getAuditLogs = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 100, eventType } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (eventType) {
      options.filters = { eventType };
    }

    const logs = await AuditService.getUserLogs(userId, options);

    return ApiResponse.success(res, logs);
  });
}

export default AuthController;
