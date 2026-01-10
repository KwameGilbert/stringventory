import { UserModel } from '../models/UserModel.js';
import { generateTokenPair, generateAccessToken } from '../utils/jwt.js';
import { tokenService } from './TokenService.js';
import { emailService } from './EmailService.js';
import { SecurityService } from './SecurityService.js';
import { SessionService } from './SessionService.js';
import { AuditService } from './AuditService.js';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../utils/errors.js';

/**
 * Enhanced Authentication Service
 * Handles user authentication with advanced security features:
 * - Session management
 * - Device fingerprinting
 * - Rate limiting
 * - Audit logging
 * - Refresh token rotation
 */
export class AuthServiceEnhanced {
  /**
   * Register a new user with optional session creation
   * @param {Object} data - Registration data
   * @param {Object} req - Express request (optional, for session creation)
   * @returns {Promise<Object>} User and tokens
   */
  static async register(data, req = null) {
    const { email, password, first_name, last_name, role = 'user' } = data;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user (unverified by default)
    const user = await UserModel.create({
      email: email.toLowerCase(),
      password,
      first_name,
      last_name,
      role,
      status: 'active',
      email_verified_at: null,
    });

    // Generate verification token
    const { token: verificationToken } = await tokenService.createVerificationToken(user.id);

    // Send verification email (non-blocking)
    emailService
      .sendVerificationEmail(user.email, user.first_name, verificationToken)
      .catch((err) => console.error('Failed to send verification email:', err.message));

    // Generate auth tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    // Optionally create session if request is provided
    let session = null;
    if (req) {
      try {
        const sessionData = await SessionService.createSession(user.id, req, false);
        session = sessionData.session;
        tokens.refreshToken = sessionData.refreshToken; // Use session refresh token

        // Audit log
        await AuditService.logEvent(AuditService.EVENT_TYPES.ACCOUNT_CREATED, user.id, {
          ipAddress: req.deviceInfo?.ipAddress || req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: session.id,
        });
      } catch (error) {
        console.error('Failed to create session during registration:', error);
      }
    }

    return {
      user,
      ...tokens,
      session,
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Enhanced login with session management and security checks
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} req - Express request object
   * @param {boolean} rememberMe - Remember me flag
   * @returns {Promise<Object>} User, tokens, and session
   */
  static async loginWithSession(email, password, req, rememberMe = false) {
    const identifier = email.toLowerCase();

    // Security check (rate limiting, account lockout)
    await SecurityService.performSecurityCheck(identifier, req, {
      maxAttempts: 5,
      windowMinutes: 15,
    });

    // Find user
    const user = await UserModel.findByEmailWithPassword(identifier);

    if (!user) {
      // Log failed attempt
      await SecurityService.logLoginAttempt({
        userId: null,
        identifier,
        ipAddress: req.deviceInfo?.ipAddress || req.ip,
        userAgent: req.headers['user-agent'],
        success: false,
        failureReason: 'user_not_found',
      });

      await AuditService.logLoginFailure(identifier, 'user_not_found', req);

      throw new UnauthorizedError('Invalid email or password');
    }

    // Check account status
    if (user.status !== 'active') {
      await SecurityService.logLoginAttempt({
        userId: user.id,
        identifier,
        ipAddress: req.deviceInfo?.ipAddress || req.ip,
        userAgent: req.headers['user-agent'],
        success: false,
        failureReason: 'account_inactive',
      });

      throw new UnauthorizedError('Your account is not active');
    }

    // Verify password
    const isValidPassword = await UserModel.comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      // Log failed attempt
      await SecurityService.logLoginAttempt({
        userId: user.id,
        identifier,
        ipAddress: req.deviceInfo?.ipAddress || req.ip,
        userAgent: req.headers['user-agent'],
        success: false,
        failureReason: 'invalid_password',
      });

      await AuditService.logLoginFailure(identifier, 'invalid_password', req);

      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await UserModel.update(user.id, {
      last_login_at: new Date(),
    });

    // Create session and refresh token
    const { session, refreshToken } = await SessionService.createSession(
      user.id,
      req,
      rememberMe
    );

    // Generate access token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    // Log successful attempt
    await SecurityService.logLoginAttempt({
      userId: user.id,
      identifier,
      ipAddress: req.deviceInfo?.ipAddress || req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    // Audit log
    await AuditService.logLoginSuccess(user.id, req);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        rememberMe: session.rememberMe,
      },
    };
  }

  /**
   * Legacy login (backwards compatible, no session)
   * @deprecated Use loginWithSession instead
   */
  static async login(email, password) {
    const user = await UserModel.findByEmailWithPassword(email.toLowerCase());

    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await UserModel.comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await UserModel.update(user.id, {
      last_login_at: new Date(),
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Logout from current session
   * @param {string} sessionId - Session ID
   * @param {Object} req - Express request
   * @returns {Promise<boolean>}
   */
  static async logoutFromSession(sessionId, req) {
    // Revoke session (cascades to refresh tokens)
    const revoked = await SessionService.revokeSession(sessionId);

    if (revoked && req) {
      const userId = req.user?.id;
      if (userId) {
        await AuditService.logLogout(userId, req);
      }
    }

    return revoked;
  }

  /**
   * Logout from all sessions (all devices)
   * @param {string} userId - User ID
   * @param {Object} req - Express request
   * @returns {Promise<number>} Number of sessions revoked
   */
  static async logoutFromAllSessions(userId, req) {
    const revokedCount = await SessionService.revokeAllUserSessions(userId);

    if (req) {
      await AuditService.logLogoutAll(userId, req);
    }

    return revokedCount;
  }

  /**
   * Logout from other sessions (keep current)
   * @param {string} userId - User ID
   * @param {string} currentSessionId - Current session ID to keep
   * @param {Object} req - Express request
   * @returns {Promise<number>} Number of sessions revoked
   */
  static async logoutFromOtherSessions(userId, currentSessionId, req) {
    const revokedCount = await SessionService.revokeOtherSessions(userId, currentSessionId);

    if (req) {
      await AuditService.logEvent(
        'logout_other_sessions',
        userId,
        {
          ipAddress: req.deviceInfo?.ipAddress || req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: currentSessionId,
        },
        { revokedCount }
      );
    }

    return revokedCount;
  }

  /**
   * Legacy logout (backwards compatible)
   * @deprecated Use logoutFromSession instead
   */
  static async logout(accessToken, refreshToken = null) {
    const tokenParts = accessToken.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const expiresAt = new Date(payload.exp * 1000);

        await tokenService.blacklistToken(accessToken, expiresAt);

        if (refreshToken) {
          await tokenService.blacklistToken(
            refreshToken,
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          );
        }
      } catch (e) {
        // Ignore decode errors
      }
    }

    return true;
  }

  /**
   * Refresh access token with token rotation
   * @param {string} refreshToken - Refresh token
   * @param {Object} req - Express request
   * @returns {Promise<Object>} New tokens
   */
  static async refreshTokenWithSession(refreshToken, req) {
    // Validate refresh token
    const tokenRecord = await SessionService.validateRefreshToken(refreshToken);

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Get this tokenRecord's session
    const session = await SessionService.getSession(tokenRecord.sessionId);

    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    // Check if session is valid
    const isValid = await SessionService.validateSession(session.id);

    if (!isValid) {
      throw new UnauthorizedError('Session has expired');
    }

    // Rotate refresh token
    const { refreshToken: newRefreshToken } = await SessionService.rotateRefreshToken(
      refreshToken,
      session.userId
    );

    // Generate new access token
    const user = await UserModel.findById(session.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);

    // Audit log
    if (req) {
      await AuditService.logTokenRefresh(user.id, req);
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Legacy refresh token (backwards compatible)
   * @deprecated Use refreshTokenWithSession instead
   */
  static async refreshToken(refreshToken) {
    const isBlacklisted = await tokenService.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been invalidated');
    }

    try {
      const { verifyRefreshToken } = await import('../utils/jwt.js');
      const decoded = verifyRefreshToken(refreshToken);

      const tokenPayload = {
        id: decoded.sub || decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      const tokens = generateTokenPair(tokenPayload);

      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  /**
   * Get user's active sessions
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Active sessions with device info
   */
  static async getUserActiveSessions(userId) {
    return SessionService.getUserSessionsWithDeviceInfo(userId);
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token, req = null) {
    const tokenRecord = await tokenService.verifyVerificationToken(token);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    const user = await UserModel.update(tokenRecord.user_id, {
      email_verified_at: new Date(),
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Audit log
    if (req) {
      await AuditService.logEmailVerified(user.id, req);
    }

    // Send welcome email
    emailService
      .sendWelcomeEmail(user.email, user.first_name)
      .catch((err) => console.error('Failed to send welcome email:', err.message));

    return user;
  }

  /**
   * Resend verification email
   */
  static async resendVerification(email) {
    const user = await UserModel.findByEmail(email.toLowerCase());

    if (!user) {
      return true;
    }

    if (user.email_verified_at) {
      throw new BadRequestError('Email is already verified');
    }

    await tokenService.invalidateUserTokens(user.id, 'email_verification');

    const { token: verificationToken } = await tokenService.createVerificationToken(user.id);

    await emailService.sendVerificationEmail(user.email, user.first_name, verificationToken);

    return true;
  }

  /**
   * Change user password
   */
  static async changePassword(userId, currentPassword, newPassword, req = null) {
    const isValid = await UserModel.verifyPassword(userId, currentPassword);

    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const user = await UserModel.findById(userId);

    await UserModel.update(userId, {
      password: newPassword,
    });

    // Audit log
    if (req) {
      await AuditService.logPasswordChange(userId, req);
    }

    // Send notification email
    if (user) {
      emailService
        .sendPasswordChangedEmail(user.email, user.first_name)
        .catch((err) => console.error('Failed to send password changed email:', err.message));
    }

    return true;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email, req = null) {
    const user = await UserModel.findByEmail(email.toLowerCase());

    if (!user) {
      return true;
    }

    const { token: resetToken } = await tokenService.createPasswordResetToken(user.id);

    // Audit log
    if (req) {
      await AuditService.logPasswordResetRequested(user.id, req);
    }

    await emailService.sendPasswordResetEmail(user.email, user.first_name, resetToken);

    return true;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token, newPassword, req = null) {
    const tokenRecord = await tokenService.verifyPasswordResetToken(token);

    if (!tokenRecord) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const user = await UserModel.findById(tokenRecord.user_id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await UserModel.update(user.id, {
      password: newPassword,
    });

    // Audit log
    if (req) {
      await AuditService.logPasswordResetCompleted(user.id, req);
    }

    emailService
      .sendPasswordChangedEmail(user.email, user.first_name)
      .catch((err) => console.error('Failed to send password changed email:', err.message));

    return true;
  }

  /**
   * Get current user profile
   */
  static async getProfile(userId) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(userId, data) {
    const { password, role, status, email_verified_at, ...safeData } = data;

    const user = await UserModel.update(userId, safeData);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Get login history for user
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Login history
   */
  static async getLoginHistory(userId, options = {}) {
    return SecurityService.getLoginHistory(userId, options);
  }

  /**
   * Get user's audit trail
   * @param {string} userId - User ID
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Audit logs
   */
  static async getUserAuditTrail(userId, options = {}) {
    return AuditService.getUserAuditTrail(userId, options);
  }
}

// Export both for backwards compatibility
export const AuthService = AuthServiceEnhanced;
export default AuthServiceEnhanced;
