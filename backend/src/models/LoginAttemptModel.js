import { BaseModel } from './BaseModel.js';
import { generateUUID } from '../utils/helpers.js';

/**
 * Login Attempt Model
 * Tracks login attempts for security monitoring and rate limiting
 */
class LoginAttemptModelClass extends BaseModel {
  constructor() {
    super('loginAttempts', {
      timestamps: false, // Only has createdAt
      softDeletes: false,
      searchableFields: ['identifier', 'ipAddress'],
      sortableFields: ['createdAt'],
      hidden: [],
    });
  }

  /**
   * Log a login attempt
   * @param {Object} data - Attempt data
   * @param {string} data.userId - User ID (null if user not found)
   * @param {string} data.identifier - Email/username attempted
   * @param {string} data.ipAddress - IP address
   * @param {string} data.userAgent - User agent string
   * @param {boolean} data.success - Whether login succeeded
   * @param {string} data.failureReason - Reason for failure (if failed)
   * @returns {Object} Created attempt record
   */
  async logAttempt(data) {
    const { userId = null, identifier, ipAddress, userAgent, success, failureReason = null } = data;

    return this.create({
      userId,
      identifier: identifier?.toLowerCase()?.substring(0, 255),
      ipAddress: ipAddress?.substring(0, 50),
      userAgent: userAgent?.substring(0, 500),
      success,
      failureReason: failureReason?.substring(0, 100),
    });
  }

  /**
   * Get recent attempts for an identifier
   * @param {string} identifier - Email/username
   * @param {number} minutes - Time window in minutes
   * @returns {Array} Recent attempts
   */
  async getRecentAttempts(identifier, minutes = 15) {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const records = await this.query()
      .where('identifier', identifier.toLowerCase())
      .where('createdAt', '>=', cutoffDate)
      .orderBy('createdAt', 'desc');

    return records;
  }

  /**
   * Get recent failed attempts by IP address
   * @param {string} ipAddress - IP address
   * @param {number} minutes - Time window in minutes
   * @returns {Array} Recent failed attempts
   */
  async getFailedAttemptsByIP(ipAddress, minutes = 15) {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const records = await this.query()
      .where('ipAddress', ipAddress)
      .where('success', false)
      .where('createdAt', '>=', cutoffDate)
      .orderBy('createdAt', 'desc');

    return records;
  }

  /**
   * Count recent failed attempts for identifier
   * @param {string} identifier - Email/username
   * @param {number} minutes - Time window in minutes
   * @returns {number} Count of failed attempts
   */
  async countRecentFailures(identifier, minutes = 15) {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const [{ count }] = await this.query()
      .where('identifier', identifier.toLowerCase())
      .where('success', false)
      .where('createdAt', '>=', cutoffDate)
      .count('id as count');

    return parseInt(count);
  }

  /**
   * Count recent failed attempts by IP
   * @param {string} ipAddress - IP address
   * @param {number} minutes - Time window in minutes
   * @returns {number} Count of failed attempts
   */
  async countRecentFailuresByIP(ipAddress, minutes = 15) {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const [{ count }] = await this.query()
      .where('ipAddress', ipAddress)
      .where('success', false)
      .where('createdAt', '>=', cutoffDate)
      .count('id as count');

    return parseInt(count);
  }

  /**
   * Check if identifier is rate limited
   * @param {string} identifier - Email/username
   * @param {number} maxAttempts - Max failed attempts allowed
   * @param {number} windowMinutes - Time window in minutes
   * @returns {Object} { isLimited: boolean, attemptCount: number, remainingAttempts: number }
   */
  async checkRateLimit(identifier, maxAttempts = 5, windowMinutes = 15) {
    const attemptCount = await this.countRecentFailures(identifier, windowMinutes);
    const isLimited = attemptCount >= maxAttempts;
    const remainingAttempts = Math.max(0, maxAttempts - attemptCount);

    return {
      isLimited,
      attemptCount,
      remainingAttempts,
      maxAttempts,
      windowMinutes,
    };
  }

  /**
   * Check if IP is rate limited
   * @param {string} ipAddress - IP address
   * @param {number} maxAttempts - Max failed attempts allowed
   * @param {number} windowMinutes - Time window in minutes
   * @returns {Object} Rate limit status
   */
  async checkIPRateLimit(ipAddress, maxAttempts = 10, windowMinutes = 15) {
    const attemptCount = await this.countRecentFailuresByIP(ipAddress, windowMinutes);
    const isLimited = attemptCount >= maxAttempts;
    const remainingAttempts = Math.max(0, maxAttempts - attemptCount);

    return {
      isLimited,
      attemptCount,
      remainingAttempts,
      maxAttempts,
      windowMinutes,
    };
  }

  /**
   * Get login history for a user
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options
   * @returns {Object} Paginated login history
   */
  async getUserLoginHistory(userId, options = {}) {
    const filters = { userId };
    return this.findAll({ ...options, filters });
  }

  /**
   * Get recent successful logins for user
   * @param {string} userId - User ID
   * @param {number} limit - Number of records to return
   * @returns {Array} Recent successful logins
   */
  async getRecentSuccessfulLogins(userId, limit = 10) {
    const records = await this.query()
      .where('userId', userId)
      .where('success', true)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    return records;
  }

  /**
   * Get suspicious activity (multiple failures from different IPs)
   * @param {string} identifier - Email/username
   * @param {number} minutes - Time window in minutes
   * @returns {Array} Failed attempts from different IPs
   */
  async getSuspiciousActivity(identifier, minutes = 60) {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const records = await this.query()
      .where('identifier', identifier.toLowerCase())
      .where('success', false)
      .where('createdAt', '>=', cutoffDate)
      .groupBy('ipAddress')
      .select('ipAddress')
      .count('* as attemptCount')
      .orderBy('attemptCount', 'desc');

    return records;
  }

  /**
   * Get failure reasons summary for identifier
   * @param {string} identifier - Email/username
   * @param {number} hours - Time window in hours
   * @returns {Array} Failure reasons with counts
   */
  async getFailureReasons(identifier, hours = 24) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    const records = await this.query()
      .where('identifier', identifier.toLowerCase())
      .where('success', false)
      .where('createdAt', '>=', cutoffDate)
      .whereNotNull('failureReason')
      .groupBy('failureReason')
      .select('failureReason')
      .count('* as count')
      .orderBy('count', 'desc');

    return records;
  }

  /**
   * Delete old login attempts (cleanup job)
   * @param {number} olderThanDays - Delete attempts older than X days
   * @returns {number} Number of deleted records
   */
  async deleteOldAttempts(olderThanDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const deleted = await this.getConnection()(this.tableName)
      .where('createdAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Get login statistics for a time period
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Login statistics
   */
  async getLoginStats(startDate, endDate = new Date()) {
    const [stats] = await this.query()
      .whereBetween('createdAt', [startDate, endDate])
      .select(
        this.getConnection().raw('COUNT(*) as totalAttempts'),
        this.getConnection().raw(
          'SUM(CASE WHEN success = true THEN 1 ELSE 0 END) as successfulLogins'
        ),
        this.getConnection().raw(
          'SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as failedLogins'
        ),
        this.getConnection().raw('COUNT(DISTINCT "userId") as uniqueUsers'),
        this.getConnection().raw('COUNT(DISTINCT "ipAddress") as uniqueIPs')
      );

    return {
      totalAttempts: parseInt(stats.totalAttempts),
      successfulLogins: parseInt(stats.successfulLogins),
      failedLogins: parseInt(stats.failedLogins),
      uniqueUsers: parseInt(stats.uniqueUsers),
      uniqueIPs: parseInt(stats.uniqueIPs),
      successRate:
        stats.totalAttempts > 0
          ? ((parseInt(stats.successfulLogins) / parseInt(stats.totalAttempts)) * 100).toFixed(2)
          : 0,
    };
  }

  /**
   * Override prepareForInsert to only set createdAt
   */
  prepareForInsert(data) {
    const record = { ...data };

    if (!record[this.primaryKey]) {
      record[this.primaryKey] = generateUUID();
    }

    const now = new Date();
    record.createdAt = record.createdAt || now;

    return record;
  }

  /**
   * Override prepareForUpdate (loginAttempts are immutable)
   */
  prepareForUpdate(data) {
    const record = { ...data };
    delete record[this.primaryKey];
    delete record.createdAt;
    return record;
  }
}

export const LoginAttemptModel = new LoginAttemptModelClass();
export default LoginAttemptModel;
