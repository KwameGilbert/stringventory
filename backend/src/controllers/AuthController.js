import { AuthService } from '../services/AuthService.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { logFailedLogin } from '../middlewares/advancedRateLimiter.js';

/**
 * Enhanced Authentication Controller
 * Uses all new authentication features:
 * - Session management
 * - Device fingerprinting
 * - Security checks
 * - Audit logging
 */
export class AuthController {
  /**
   * Register a new user with optional session creation
   * POST /auth/register
   */
  static register = asyncHandler(async (req, res) => {
    // Enhanced: Pass req for optional session creation
    const result = await AuthService.register(req.body, req);

    return ApiResponse.created(res, result, result.message || 'User registered successfully');
  });

  /**
   * Enhanced login with session management
   * POST /auth/login
   * Requires: deviceFingerprint and advancedLoginLimiter middlewares
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;

    try {
      // Use enhanced login with session
      const result = await AuthService.loginWithSession(email, password, req, rememberMe);

      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      // Log failed login attempt
      await logFailedLogin(email, error.message, req);
      throw error;
    }
  });

  /**
   * Legacy login (backwards compatible)
   * POST /auth/login/legacy
   */
  static loginLegacy = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    return ApiResponse.success(res, result, 'Login successful');
  });

  /**
   * Refresh access token with rotation
   * POST /auth/refresh
   * Requires: deviceFingerprint middleware
   */
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Use enhanced refresh with token rotation
    const tokens = await AuthService.refreshTokenWithSession(refreshToken, req);

    return ApiResponse.success(res, tokens, 'Token refreshed successfully');
  });

  /**
   * Legacy refresh token (backwards compatible)
   * POST /auth/refresh/legacy
   */
  static refreshTokenLegacy = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);

    return ApiResponse.success(res, tokens, 'Token refreshed successfully');
  });

  /**
   * Get current user profile
   * GET /auth/me
   */
  static getProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.getProfile(req.user.id);

    return ApiResponse.success(res, user);
  });

  /**
   * Update current user profile
   * PATCH /auth/me
   */
  static updateProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.updateProfile(req.user.id, req.body);

    return ApiResponse.success(res, user, 'Profile updated successfully');
  });

  /**
   * Change password with audit logging
   * POST /auth/change-password
   */
  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Enhanced: Pass req for audit logging
    await AuthService.changePassword(req.user.id, currentPassword, newPassword, req);

    return ApiResponse.success(res, null, 'Password changed successfully');
  });

  /**
   * Request password reset with audit logging
   * POST /auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Enhanced: Pass req for audit logging
    await AuthService.requestPasswordReset(email, req);

    return ApiResponse.success(
      res,
      null,
      'If an account exists with this email, you will receive a password reset link'
    );
  });

  /**
   * Reset password with token and audit logging
   * POST /auth/reset-password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Enhanced: Pass req for audit logging
    await AuthService.resetPassword(token, password, req);

    return ApiResponse.success(res, null, 'Password reset successfully');
  });

  /**
   * Verify email with token and audit logging
   * GET /auth/verify-email
   */
  static verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token) {
      return ApiResponse.badRequest(res, 'Verification token is required');
    }

    // Enhanced: Pass req for audit logging
    const user = await AuthService.verifyEmail(token, req);

    return ApiResponse.success(res, { verified: true }, 'Email verified successfully');
  });

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  static resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await AuthService.resendVerification(email);

    return ApiResponse.success(
      res,
      null,
      'If your email is registered and not verified, you will receive a verification link'
    );
  });

  /**
   * Logout from current session
   * POST /auth/logout
   * Requires: authenticate middleware
   */
  static logout = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    if (sessionId) {
      // Enhanced: Logout from specific session
      await AuthService.logoutFromSession(sessionId, req);
      return ApiResponse.success(res, null, 'Logged out successfully');
    }

    // Legacy logout (token blacklisting)
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];
    const { refreshToken } = req.body || {};

    if (accessToken) {
      await AuthService.logout(accessToken, refreshToken);
    }

    return ApiResponse.success(res, null, 'Logged out successfully');
  });

  /**
   * Logout from all sessions (all devices)
   * POST /auth/logout-all
   * Requires: authenticate middleware
   */
  static logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const revokedCount = await AuthService.logoutFromAllSessions(userId, req);

    return ApiResponse.success(
      res,
      { revokedSessions: revokedCount },
      `Logged out from ${revokedCount} session(s) successfully`
    );
  });

  /**
   * Logout from other sessions (keep current)
   * POST /auth/logout-others
   * Requires: authenticate middleware
   */
  static logoutOthers = asyncHandler(async (req, res) => {
    const { currentSessionId } = req.body;
    const userId = req.user.id;

    if (!currentSessionId) {
      return ApiResponse.badRequest(res, 'Current session ID is required');
    }

    const revokedCount = await AuthService.logoutFromOtherSessions(userId, currentSessionId, req);

    return ApiResponse.success(
      res,
      { revokedSessions: revokedCount },
      `Logged out from ${revokedCount} other session(s) successfully`
    );
  });

  /**
   * Get user's active sessions
   * GET /auth/sessions
   * Requires: authenticate middleware
   */
  static getSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const sessions = await AuthService.getUserActiveSessions(userId);

    return ApiResponse.success(res, { sessions, count: sessions.length });
  });

  /**
   * Revoke a specific session
   * DELETE /auth/sessions/:sessionId
   * Requires: authenticate middleware
   */
  static revokeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    await AuthService.logoutFromSession(sessionId, req);

    return ApiResponse.success(res, null, 'Session revoked successfully');
  });

  /**
   * Get login history
   * GET /auth/login-history
   * Requires: authenticate middleware
   */
  static getLoginHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const history = await AuthService.getLoginHistory(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return ApiResponse.success(res, history);
  });

  /**
   * Get user audit trail
   * GET /auth/audit-logs
   * Requires: authenticate middleware
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

    const logs = await AuthService.getUserAuditTrail(userId, options);

    return ApiResponse.success(res, logs);
  });
}

export default AuthController;
