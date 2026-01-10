import { BaseModel } from './BaseModel.js';
import { hashRefreshToken } from '../utils/crypto.js';
import { getTokenExpiration } from '../utils/jwt.js';

/**
 * Refresh Token Model
 * Manages refresh tokens for user sessions
 */
class RefreshTokenModelClass extends BaseModel {
  constructor() {
    super('refreshTokens', {
      timestamps: false, // Only has createdAt
      softDeletes: false,
      searchableFields: [],
      sortableFields: ['createdAt', 'expiresAt'],
      hidden: ['tokenHash'], // Don't expose token hashes
    });
  }

  /**
   * Create a new refresh token
   * @param {string} sessionId - Session ID
   * @param {string} token - Raw refresh token (will be hashed)
   * @param {Date} expiresAt - Token expiration date
   * @returns {Object} Created token record
   */
  async createToken(sessionId, token, expiresAt) {
    const tokenHash = hashRefreshToken(token);

    return this.create({
      sessionId,
      tokenHash,
      expiresAt,
      revokedAt: null,
      rotatedAt: null,
    });
  }

  /**
   * Find token by hash
   * @param {string} token - Raw token to find
   * @returns {Object|null} Token record or null
   */
  async findByHash(token) {
    const tokenHash = hashRefreshToken(token);

    return this.findBy('tokenHash', tokenHash);
  }

  /**
   * Find valid (non-revoked, non-expired) token by hash
   * @param {string} token - Raw token
   * @returns {Object|null} Valid token record or null
   */
  async findValidToken(token) {
    const tokenHash = hashRefreshToken(token);

    const record = await this.query()
      .where('tokenHash', tokenHash)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .first();

    return record || null;
  }

  /**
   * Revoke a refresh token
   * @param {string} token - Raw token to revoke
   * @returns {boolean} True if revoked
   */
  async revokeToken(token) {
    const tokenHash = hashRefreshToken(token);

    const updated = await this.updateWhere({ tokenHash }, { revokedAt: new Date() });

    return updated.length > 0;
  }

  /**
   * Revoke token by ID
   * @param {string} tokenId - Token ID
   * @returns {boolean} True if revoked
   */
  async revokeTokenById(tokenId) {
    const updated = await this.update(tokenId, {
      revokedAt: new Date(),
    });

    return !!updated;
  }

  /**
   * Rotate refresh token (mark old as rotated, create new)
   * @param {string} oldToken - Old token to rotate
   * @param {string} newToken - New token
   * @param {string} sessionId - Session ID
   * @param {Date} expiresAt - New token expiration
   * @returns {Object} New token record
   */
  async rotateToken(oldToken, newToken, sessionId, expiresAt) {
    const oldTokenHash = hashRefreshToken(oldToken);

    // Mark old token as rotated
    await this.updateWhere(
      { tokenHash: oldTokenHash },
      { rotatedAt: new Date(), revokedAt: new Date() }
    );

    // Create new token
    return this.createToken(sessionId, newToken, expiresAt);
  }

  /**
   * Revoke all tokens for a session
   * @param {string} sessionId - Session ID
   * @returns {number} Number of tokens revoked
   */
  async revokeAllSessionTokens(sessionId) {
    const updated = await this.updateWhere({ sessionId }, { revokedAt: new Date() });

    return updated.length;
  }

  /**
   * Get all tokens for a session
   * @param {string} sessionId - Session ID
   * @returns {Array} Token records
   */
  async getSessionTokens(sessionId) {
    return this.findAllBy('sessionId', sessionId);
  }

  /**
   * Get active (non-revoked) tokens for a session
   * @param {string} sessionId - Session ID
   * @returns {Array} Active token records
   */
  async getActiveSessionTokens(sessionId) {
    const records = await this.query()
      .where('sessionId', sessionId)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date());

    return records;
  }

  /**
   * Delete expired tokens (cleanup job)
   * @param {number} olderThanDays - Delete tokens expired more than X days ago
   * @returns {number} Number of deleted tokens
   */
  async deleteExpired(olderThanDays = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const deleted = await this.getConnection()(this.tableName)
      .where('expiresAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Delete revoked tokens older than specified days
   * @param {number} olderThanDays - Delete revoked tokens older than X days
   * @returns {number} Number of deleted tokens
   */
  async deleteRevoked(olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const deleted = await this.getConnection()(this.tableName)
      .whereNotNull('revokedAt')
      .where('revokedAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Count active tokens for a session
   * @param {string} sessionId - Session ID
   * @returns {number} Count of active tokens
   */
  async countActiveTokens(sessionId) {
    const [{ count }] = await this.query()
      .where('sessionId', sessionId)
      .whereNull('revokedAt')
      .where('expiresAt', '>', new Date())
      .count('id as count');

    return parseInt(count);
  }

  /**
   * Check if a token is valid (exists, not revoked, not expired)
   * @param {string} token - Raw token
   * @returns {boolean} True if valid
   */
  async isTokenValid(token) {
    const validToken = await this.findValidToken(token);
    return !!validToken;
  }

  /**
   * Override prepareForInsert to only set createdAt (no updatedAt)
   */
  prepareForInsert(data) {
    const record = { ...data };

    // Generate UUID if not provided
    if (!record[this.primaryKey]) {
      const { generateUUID } = require('../utils/helpers.js');
      record[this.primaryKey] = generateUUID();
    }

    // Only add createdAt (refreshTokens table doesn't have updatedAt)
    const now = new Date();
    record.createdAt = record.createdAt || now;

    return record;
  }

  /**
   * Override prepareForUpdate to not set updatedAt
   */
  prepareForUpdate(data) {
    const record = { ...data };

    // Remove immutable fields
    delete record[this.primaryKey];
    delete record.createdAt;
    // Don't set updatedAt as this table doesn't have it

    return record;
  }
}

export const RefreshTokenModel = new RefreshTokenModelClass();
export default RefreshTokenModel;
