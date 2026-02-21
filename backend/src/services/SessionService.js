import { AuthSessionModel } from '../models/AuthSessionModel.js';
import { RefreshTokenModel } from '../models/RefreshTokenModel.js';
import { SecurityService } from './SecurityService.js';
import { generateRefreshToken } from '../utils/jwt.js';

/**
 * Session Service
 * Manages user authentication sessions and refresh tokens
 */
export class SessionService {
  /**
   * Create a new session with refresh token
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {boolean} rememberMe - Remember me flag
   * @returns {Promise<Object>} Session and refresh token
   */
  static async createSession(userId, req, rememberMe = false) {
    // Generate device fingerprint
    const deviceInfo = SecurityService.generateDeviceFingerprint(req);

    // Calculate expiration times
    const now = new Date();
    const sessionExpiration = rememberMe
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const tokenExpiration = rememberMe
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days (always)

    // Create session
    const session = await AuthSessionModel.createSession({
      userId,
      fingerprintHash: deviceInfo.fingerprintHash,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      rememberMe,
      expiresAt: sessionExpiration,
    });

    // Generate and store refresh token
    const refreshToken = generateRefreshToken({ id: userId });
    await RefreshTokenModel.createToken(session.id, refreshToken, tokenExpiration);

    return {
      session,
      refreshToken,
    };
  }

  /**
   * Validate if session exists and is active
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} True if valid
   */
  static async validateSession(sessionId) {
    return AuthSessionModel.isSessionValid(sessionId);
  }

  /**
   * Get session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Session or null
   */
  static async getSession(sessionId) {
    return AuthSessionModel.findById(sessionId);
  }

  /**
   * Update session last used timestamp
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Updated session
   */
  static async refreshSessionActivity(sessionId) {
    return AuthSessionModel.updateLastUsed(sessionId);
  }

  /**
   * Revoke a session and all its refresh tokens
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} True if revoked
   */
  static async revokeSession(sessionId) {
    return AuthSessionModel.revokeSession(sessionId);
  }

  /**
   * Revoke all sessions for a user (logout everywhere)
   * @param {string} userId - User ID
   * @returns {Promise<number>} Number of sessions revoked
   */
  static async revokeAllUserSessions(userId) {
    return AuthSessionModel.revokeAllUserSessions(userId);
  }

  /**
   * Revoke all sessions except the current one
   * @param {string} userId - User ID
   * @param {string} currentSessionId - Current session ID
   * @returns {Promise<number>} Number of sessions revoked
   */
  static async revokeOtherSessions(userId, currentSessionId) {
    return AuthSessionModel.revokeOtherSessions(userId, currentSessionId);
  }

  /**
   * Get all active sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Active sessions
   */
  static async getUserActiveSessions(userId) {
    return AuthSessionModel.getUserActiveSessions(userId);
  }

  /**
   * Get all sessions for a user with device information
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Sessions with device info
   */
  static async getUserSessionsWithDeviceInfo(userId) {
    return AuthSessionModel.getUserSessionsWithDeviceInfo(userId);
  }

  /**
   * Get session with device information
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Session with device info
   */
  static async getSessionWithDeviceInfo(sessionId) {
    return AuthSessionModel.getSessionWithDeviceInfo(sessionId);
  }

  /**
   * Count active sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of active sessions
   */
  static async countUserActiveSessions(userId) {
    return AuthSessionModel.countActiveSessions(userId);
  }

  /**
   * Extend session expiration
   * @param {string} sessionId - Session ID
   * @param {number} days - Number of days to extend
   * @returns {Promise<Object|null>} Updated session
   */
  static async extendSession(sessionId, days = 7) {
    const newExpiration = new Date();
    newExpiration.setDate(newExpiration.getDate() + days);

    return AuthSessionModel.extendSession(sessionId, newExpiration);
  }

  /**
   * Find or create session for user with device matching
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {boolean} rememberMe - Remember me flag
   * @returns {Promise<Object>} Session and refresh token
   */
  static async findOrCreateSession(userId, req, rememberMe = false) {
    const deviceInfo = SecurityService.generateDeviceFingerprint(req);

    // Check if active session exists for this device
    const existingSession = await AuthSessionModel.findActiveSession(
      userId,
      deviceInfo.fingerprintHash
    );

    if (existingSession) {
      // Extend existing session
      await this.refreshSessionActivity(existingSession.id);

      // Get active refresh token for this session
      const activeTokens = await RefreshTokenModel.getActiveSessionTokens(existingSession.id);

      if (activeTokens.length > 0) {
        // Session and token already exist, just return info
        return {
          session: existingSession,
          refreshToken: null, // Don't expose existing token
          isExisting: true,
        };
      }
    }

    // Create new session
    return {
      ...(await this.createSession(userId, req, rememberMe)),
      isExisting: false,
    };
  }

  /**
   * Refresh a token (rotation) - Wrapper for rotateRefreshToken
   * @param {string} oldToken - Old refresh token
   * @param {Object} req - Express request
   * @returns {Promise<Object>} New tokens
   */
  static async refreshToken(oldToken, req) {
    const validToken = await this.validateRefreshToken(oldToken);
    if (!validToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // Reuse rotation logic
    const userId = validToken.userId; // Wait, RefreshTokenModel might not have userId directly
    // Let's check RefreshTokenModel schema... it has sessionId.
    // I need to get userId from the session.
    const session = await AuthSessionModel.findById(validToken.sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session is inactive');
    }

    const { refreshToken: newToken } = await this.rotateRefreshToken(oldToken, session.userId);
    const { accessToken } = await import('../utils/jwt.js').then((m) =>
      m.generateTokenPair({
        id: session.userId,
        email: null, // We'd need to fetch user, but we can just use extractUserId for most things
        // Actually, it's better to fetch the user or at least the payload from somewhere.
      })
    );
    // Wait, let's keep it simple for now or fetch the user.

    // Better implementation of refreshToken:
    const user = await import('../models/UserModel.js').then((m) =>
      m.UserModel.findById(session.userId)
    );
    const { generateTokenPair } = await import('../utils/jwt.js');
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    });

    // Create new token record and link to session
    await this.rotateRefreshToken(oldToken, user.id);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Revoke a session using a refresh token
   * @param {string} token - Refresh token
   */
  static async revokeSessionByToken(token) {
    const tokenRecord = await RefreshTokenModel.findByHash(token);
    if (tokenRecord) {
      await this.revokeSession(tokenRecord.sessionId);
    }
    return true;
  }

  /**
   * Rotate refresh token
   * @param {string} oldToken - Old refresh token
   * @param {string} userId - User ID
   * @returns {Promise<Object>} New refresh token
   */
  static async rotateRefreshToken(oldToken, userId) {
    // Find old token
    const oldTokenRecord = await RefreshTokenModel.findByHash(oldToken);

    if (!oldTokenRecord) {
      throw new Error('Invalid refresh token');
    }

    // Generate new token
    const newToken = generateRefreshToken({ id: userId });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    // Rotate token (marks old as rotated, creates new)
    const newTokenRecord = await RefreshTokenModel.rotateToken(
      oldToken,
      newToken,
      oldTokenRecord.sessionId,
      expiresAt
    );

    // Update session activity
    await this.refreshSessionActivity(oldTokenRecord.sessionId);

    return {
      refreshToken: newToken,
      session: await this.getSession(oldTokenRecord.sessionId),
    };
  }

  /**
   * Validate refresh token
   * @param {string} token - Refresh token
   * @returns {Promise<Object|null>} Token record or null
   */
  static async validateRefreshToken(token) {
    return RefreshTokenModel.findValidToken(token);
  }

  /**
   * Revoke refresh token
   * @param {string} token - Refresh token to revoke
   * @returns {Promise<boolean>} True if revoked
   */
  static async revokeRefreshToken(token) {
    return RefreshTokenModel.revokeToken(token);
  }

  /**
   * Clean up expired sessions (maintenance job)
   * @param {number} olderThanDays - Delete sessions expired more than X days ago
   * @returns {Promise<Object>} Cleanup results
   */
  static async cleanupExpiredSessions(olderThanDays = 7) {
    const deletedSessions = await AuthSessionModel.deleteExpiredSessions(olderThanDays);
    const deletedTokens = await RefreshTokenModel.deleteExpired(olderThanDays);

    return {
      deletedSessions,
      deletedTokens,
    };
  }

  /**
   * Clean up revoked sessions (maintenance job)
   * @param {number} olderThanDays - Delete revoked sessions older than X days
   * @returns {Promise<Object>} Cleanup results
   */
  static async cleanupRevokedSessions(olderThanDays = 30) {
    const deletedSessions = await AuthSessionModel.deleteRevokedSessions(olderThanDays);
    const deletedTokens = await RefreshTokenModel.deleteRevoked(olderThanDays);

    return {
      deletedSessions,
      deletedTokens,
    };
  }

  /**
   * Get session statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Session statistics
   */
  static async getUserSessionStats(userId) {
    const activeSessions = await this.getUserActiveSessions(userId);
    const totalSessions = await AuthSessionModel.getUserSessions(userId, { limit: 1000 });

    return {
      activeCount: activeSessions.length,
      totalCount: totalSessions.pagination.total,
      sessions: activeSessions,
    };
  }
}

export default SessionService;
