import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authSchemas } from '../validators/schemas.js';
import { validateBody } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import {
  deviceFingerprint,
  advancedLoginLimiter,
  logSuccessfulLogin,
} from '../middlewares/index.js';

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user with optional session creation
 * @access Public
 */
router.post(
  '/register',
  deviceFingerprint, // Extract device info
  authRateLimiter, // Express rate limiter
  validateBody(authSchemas.register),
  AuthController.register
);

/**
 * @route POST /auth/login
 * @desc Enhanced login with session management
 * @access Public
 */
router.post(
  '/login',
  deviceFingerprint, // Extract device info
  authRateLimiter, // Express rate limiter (10/15min)
  advancedLoginLimiter, // DB-backed rate limiter + account lockout
  validateBody(authSchemas.login),
  AuthController.login,
  logSuccessfulLogin // Log successful attempt (post-login)
);

/**
 * @route POST /auth/refresh-token
 * @desc Refresh access token with rotation
 * @access Public
 */
router.post(
  '/refresh-token',
  deviceFingerprint, // Extract device info for audit
  validateBody(authSchemas.refreshToken),
  AuthController.refreshToken
);

/**
 * @route POST /auth/logout
 * @desc Logout from current session
 * @access Private
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route POST /auth/logout-all
 * @desc Logout from all sessions (all devices)
 * @access Private
 */
router.post('/logout-all', authenticate, AuthController.logoutAll);

/**
 * @route POST /auth/logout-others
 * @desc Logout from other sessions (keep current)
 * @access Private
 */
router.post('/logout-others', authenticate, AuthController.logoutOthers);

/**
 * @route GET /auth/sessions
 * @desc Get user's active sessions
 * @access Private
 */
router.get('/sessions', authenticate, AuthController.getSessions);

/**
 * @route DELETE /auth/sessions/:sessionId
 * @desc Revoke a specific session
 * @access Private
 */
router.delete('/sessions/:sessionId', authenticate, AuthController.revokeSession);

/**
 * @route GET /auth/login-history
 * @desc Get login attempt history
 * @access Private
 */
router.get('/login-history', authenticate, AuthController.getLoginHistory);

/**
 * @route GET /auth/audit-logs
 * @desc Get security audit logs
 * @access Private
 */
router.get('/audit-logs', authenticate, AuthController.getAuditLogs);

/**
 * @route POST /auth/verify-email
 * @desc Verify email with token
 * @access Public
 */
router.post('/verify-email', validateBody(authSchemas.verifyEmail), AuthController.verifyEmail);

/**
 * @route POST /auth/resend-verification
 * @desc Resend verification email
 * @access Public
 */
router.post(
  '/resend-verification',
  authRateLimiter,
  validateBody(authSchemas.forgotPassword), // Same schema (just email)
  AuthController.resendVerification
);

/**
 * @route GET /auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, AuthController.getProfile);

/**
 * @route PATCH /auth/me
 * @desc Update current user profile
 * @access Private
 */
router.patch(
  '/me',
  authenticate,
  validateBody(authSchemas.updateProfile),
  AuthController.updateProfile
);

/**
 * @route POST /auth/change-password
 * @desc Change password
 * @access Private
 */
router.post(
  '/change-password',
  authenticate,
  validateBody(authSchemas.changePassword),
  AuthController.changePassword
);

/**
 * @route POST /auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validateBody(authSchemas.forgotPassword),
  AuthController.forgotPassword
);

/**
 * @route POST /auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post(
  '/reset-password',
  authRateLimiter,
  validateBody(authSchemas.resetPassword),
  AuthController.resetPassword
);

export default router;
