import { BaseModel } from './BaseModel.js';
import { RefreshTokenModel } from './RefreshTokenModel.js';
import { hashFingerprint } from '../utils/crypto.js';

/**
 * Auth Session Model
 * Manages user authentication sessions with device tracking
 */
class AuthSessionModelClass extends BaseModel {
  constructor() {
    super('authSessions', {
      timestamps: true,
      softDeletes: false,
      searchableFields: [],
      sortableFields: ['createdAt', 'lastUsedAt', 'expiresAt'],
      hidden: [],
    });
  }

  /**
   * Create a new session
   * @param {Object} data - Session data
   * @param {string} data.userId - User ID
   * @param {string} data.fingerprintHash - Device fingerprint hash
   * @param {string} data.ipAddress - IP address
   * @param {string} data.userAgent - User agent string
   * @param {boolean} data.rememberMe - Remember me flag
   * @param {Date} data.expiresAt - Session expiration
   * @returns {Object} Created session
   */
  async createSession(data) {
    const { userId, fingerprintHash, ipAddress, userAgent, rememberMe = false, expiresAt } = data;

    return this.create({
      userId,
      fingerprintHash,
      ipAddress: ipAddress?.substring(0, 50), // Ensure max length
      userAgent: userAgent?.substring(0, 500), // Ensure max length
      rememberMe,
      lastUsedAt: new Date(),
      expiresAt,
      revokedAt: null,
    });
  }

  /**
   * Find active session by user and fingerprint
   * @param {string} userId - User ID
   * @param {string} fingerprintHash - Device fingerprint hash
   * @returns {Object|null} Active session or null
   */
  async findActiveSession(userId, fingerprintHash) {
    const record = await this.query()
      .where('userId', userId)
      .where('fingerprintHash', fingerprintHash)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .orderBy('lastUsedAt', 'desc')
      .first();

    return record ? this.hideFields(record) : null;
  }

  /**
   * Get all active sessions for a user
   * @param {string} userId - User ID
   * @returns {Array} Active sessions
   */
  async getUserActiveSessions(userId) {
    const records = await this.query()
      .where('userId', userId)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .orderBy('lastUsedAt', 'desc');

    return records.map((record) => this.hideFields(record));
  }

  /**
   * Get all sessions for a user (including expired/revoked)
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options
   * @returns {Object} Paginated sessions
   */
  async getUserSessions(userId, options = {}) {
    const filters = { userId };
    return this.findAll({ ...options, filters });
  }

  /**
   * Update session last used timestamp
   * @param {string} sessionId - Session ID
   * @returns {Object|null} Updated session
   */
  async updateLastUsed(sessionId) {
    return this.update(sessionId, {
      lastUsedAt: new Date(),
    });
  }

  /**
   * Revoke a session
   * @param {string} sessionId - Session ID
   * @returns {boolean} True if revoked
   */
  async revokeSession(sessionId) {
    // Revoke the session
    const updated = await this.update(sessionId, {
      revokedAt: new Date(),
    });

    // Also revoke all refresh tokens for this session
    if (updated) {
      await RefreshTokenModel.revokeAllSessionTokens(sessionId);
    }

    return !!updated;
  }

  /**
   * Revoke all sessions for a user (logout everywhere)
   * @param {string} userId - User ID
   * @returns {number} Number of sessions revoked
   */
  async revokeAllUserSessions(userId) {
    const sessions = await this.getUserActiveSessions(userId);

    let revokedCount = 0;
    for (const session of sessions) {
      const revoked = await this.revokeSession(session.id);
      if (revoked) revokedCount++;
    }

    return revokedCount;
  }

  /**
   * Revoke all sessions except the current one
   * @param {string} userId - User ID
   * @param {string} currentSessionId - Current session ID to keep
   * @returns {number} Number of sessions revoked
   */
  async revokeOtherSessions(userId, currentSessionId) {
    const sessions = await this.getUserActiveSessions(userId);

    let revokedCount = 0;
    for (const session of sessions) {
      if (session.id !== currentSessionId) {
        const revoked = await this.revokeSession(session.id);
        if (revoked) revokedCount++;
      }
    }

    return revokedCount;
  }

  /**
   * Delete expired sessions (cleanup job)
   * @param {number} olderThanDays - Delete sessions expired more than X days ago
   * @returns {number} Number of deleted sessions
   */
  async deleteExpiredSessions(olderThanDays = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // First, delete refresh tokens for these sessions
    const expiredSessions = await this.getConnection()(this.tableName)
      .where('expiresAt', '<', cutoffDate)
      .select('id');

    for (const session of expiredSessions) {
      await RefreshTokenModel.revokeAllSessionTokens(session.id);
    }

    // Then delete the sessions
    const deleted = await this.getConnection()(this.tableName)
      .where('expiresAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Delete revoked sessions older than specified days
   * @param {number} olderThanDays - Delete revoked sessions older than X days
   * @returns {number} Number of deleted sessions
   */
  async deleteRevokedSessions(olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // First, get revoked sessions
    const revokedSessions = await this.getConnection()(this.tableName)
      .whereNotNull('revokedAt')
      .where('revokedAt', '<', cutoffDate)
      .select('id');

    // Delete refresh tokens for these sessions
    for (const session of revokedSessions) {
      await RefreshTokenModel.revokeAllSessionTokens(session.id);
    }

    // Then delete the sessions
    const deleted = await this.getConnection()(this.tableName)
      .whereNotNull('revokedAt')
      .where('revokedAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Count active sessions for a user
   * @param {string} userId - User ID
   * @returns {number} Count of active sessions
   */
  async countActiveSessions(userId) {
    const [{ count }] = await this.query()
      .where('userId', userId)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .count('id as count');

    return parseInt(count);
  }

  /**
   * Check if session is valid (exists, not revoked, not expired)
   * @param {string} sessionId - Session ID
   * @returns {boolean} True if valid
   */
  async isSessionValid(sessionId) {
    const session = await this.query()
      .where('id', sessionId)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .first();

    return !!session;
  }

  /**
   * Get session with device info (formatted)
   * @param {string} sessionId - Session ID
   * @returns {Object|null} Session with device description
   */
  async getSessionWithDeviceInfo(sessionId) {
    const session = await this.findById(sessionId);

    if (!session) return null;

    // Parse user agent to get device description
    const { parseUserAgent, getDeviceDescription } = await import('../utils/deviceInfo.js');
    const deviceInfo = parseUserAgent(session.userAgent);

    return {
      ...session,
      deviceDescription: getDeviceDescription(deviceInfo),
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      device: deviceInfo.device,
    };
  }

  /**
   * Get all user sessions with device info
   * @param {string} userId - User ID
   * @returns {Array} Sessions with device descriptions
   */
  async getUserSessionsWithDeviceInfo(userId) {
    const sessions = await this.getUserActiveSessions(userId);

    const { parseUserAgent, getDeviceDescription } = await import('../utils/deviceInfo.js');

    return sessions.map((session) => {
      const deviceInfo = parseUserAgent(session.userAgent);
      return {
        ...session,
        deviceDescription: getDeviceDescription(deviceInfo),
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        device: deviceInfo.device,
        isActive: !session.revokedAt && session.expiresAt > new Date(),
      };
    });
  }

  /**
   * Extend session expiration
   * @param {string} sessionId - Session ID
   * @param {Date} newExpiresAt - New expiration date
   * @returns {Object|null} Updated session
   */
  async extendSession(sessionId, newExpiresAt) {
    return this.update(sessionId, {
      expiresAt: newExpiresAt,
      lastUsedAt: new Date(),
    });
  }
}

export const AuthSessionModel = new AuthSessionModelClass();
export default AuthSessionModel;
