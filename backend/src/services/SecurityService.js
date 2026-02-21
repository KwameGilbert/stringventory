import { LoginAttemptModel } from '../models/LoginAttemptModel.js';
import { createDeviceRecord, generateDeviceFingerprint } from '../utils/deviceInfo.js';
import { TooManyRequestsError, UnauthorizedError } from '../utils/errors.js';

/**
 * Security Service
 * Handles rate limiting, device fingerprinting, and security checks
 */
export class SecurityService {
  /**
   * Generate device fingerprint from request
   * @param {Object} req - Express request object
   * @returns {Object} Device fingerprint and info
   */
  static generateDeviceFingerprint(req) {
    return createDeviceRecord(req);
  }

  /**
   * Check if user/email can attempt login (rate limit check)
   * @param {string} identifier - Email or username
   * @param {Object} options - Rate limit options
   * @returns {Promise<Object>} Rate limit status
   */
  static async checkLoginRateLimit(identifier, options = {}) {
    const { maxAttempts = 5, windowMinutes = 15 } = options;

    return LoginAttemptModel.checkRateLimit(identifier, maxAttempts, windowMinutes);
  }

  /**
   * Check if IP address is rate limited
   * @param {string} ipAddress - IP address
   * @param {Object} options - Rate limit options
   * @returns {Promise<Object>} Rate limit status
   */
  static async checkIPRateLimit(ipAddress, options = {}) {
    const { maxAttempts = 10, windowMinutes = 15 } = options;

    return LoginAttemptModel.checkIPRateLimit(ipAddress, maxAttempts, windowMinutes);
  }

  /**
   * Enforce rate limit - throws error if limited
   * @param {string} identifier - Email or username
   * @param {string} ipAddress - IP address
   * @param {Object} options - Rate limit options
   * @returns {Promise<void>}
   * @throws {TooManyRequestsError} If rate limited
   */
  static async enforceRateLimit(identifier, ipAddress, options = {}) {
    // Check email-based rate limit
    const emailLimit = await this.checkLoginRateLimit(identifier, options);
    if (emailLimit.isLimited) {
      throw new TooManyRequestsError(
        `Too many login attempts for this account. Please try again in ${emailLimit.windowMinutes} minutes.`
      );
    }

    // Check IP-based rate limit
    const ipLimit = await this.checkIPRateLimit(ipAddress, options);
    if (ipLimit.isLimited) {
      throw new TooManyRequestsError(
        `Too many login attempts from your IP address. Please try again later.`
      );
    }

    return {
      emailLimit,
      ipLimit,
    };
  }

  /**
   * Log a login attempt
   * @param {Object} data - Login attempt data
   * @param {string} data.userId - User ID (null if user not found)
   * @param {string} data.identifier - Email/username attempted
   * @param {string} data.ipAddress - IP address
   * @param {string} data.userAgent - User agent
   * @param {boolean} data.success - Whether login succeeded
   * @param {string} data.failureReason - Reason for failure
   * @returns {Promise<Object>} Created attempt record
   */
  static async logLoginAttempt(data) {
    return LoginAttemptModel.logAttempt(data);
  }

  /**
   * Check if account should be locked (too many failures)
   * @param {string} identifier - Email or username
   * @param {Object} options - Lockout options
   * @returns {Promise<Object>} Lockout status
   */
  static async isAccountLocked(identifier, options = {}) {
    const { maxFailures = 5, windowMinutes = 30 } = options;

    const failures = await LoginAttemptModel.countRecentFailures(identifier, windowMinutes);

    const isLocked = failures >= maxFailures;
    const remainingAttempts = Math.max(0, maxFailures - failures);

    return {
      isLocked,
      failures,
      maxFailures,
      remainingAttempts,
      windowMinutes,
    };
  }

  /**
   * Enforce account lockout - throws error if locked
   * @param {string} identifier - Email or username
   * @param {Object} options - Lockout options
   * @returns {Promise<Object>} Lockout status
   * @throws {UnauthorizedError} If account is locked
   */
  static async enforceAccountLockout(identifier, options = {}) {
    const lockout = await this.isAccountLocked(identifier, options);

    if (lockout.isLocked) {
      throw new UnauthorizedError(
        `Account temporarily locked due to too many failed login attempts. Please try again in ${lockout.windowMinutes} minutes.`
      );
    }

    return lockout;
  }

  /**
   * Get suspicious activity for an identifier
   * @param {string} identifier - Email or username
   * @param {number} minutes - Time window in minutes
   * @returns {Promise<Array>} Suspicious IPs
   */
  static async getSuspiciousActivity(identifier, minutes = 60) {
    return LoginAttemptModel.getSuspiciousActivity(identifier, minutes);
  }

  /**
   * Get login history for a user
   * @param {string} userId - User ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated login history
   */
  static async getLoginHistory(userId, options = {}) {
    return LoginAttemptModel.getUserLoginHistory(userId, options);
  }

  /**
   * Get recent successful logins for user
   * @param {string} userId - User ID
   * @param {number} limit - Number of records
   * @returns {Promise<Array>} Recent logins
   */
  static async getRecentLogins(userId, limit = 10) {
    return LoginAttemptModel.getRecentSuccessfulLogins(userId, limit);
  }

  /**
   * Get login statistics
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Login statistics
   */
  static async getLoginStats(startDate, endDate) {
    return LoginAttemptModel.getLoginStats(startDate, endDate);
  }

  /**
   * Get failure reasons summary
   * @param {string} identifier - Email or username
   * @param {number} hours - Time window in hours
   * @returns {Promise<Array>} Failure reasons with counts
   */
  static async getFailureReasons(identifier, hours = 24) {
    return LoginAttemptModel.getFailureReasons(identifier, hours);
  }

  /**
   * Check if request is from a bot
   * @param {Object} req - Express request object
   * @returns {boolean} True if bot detected
   */
  static isBot(req) {
    const { isBot: checkBot } = createDeviceRecord(req);
    return checkBot;
  }

  /**
   * Get comprehensive security check for login
   * @param {string} identifier - Email or username
   * @param {Object} req - Express request object
   * @param {Object} options - Security options
   * @returns {Promise<Object>} Security check results
   */
  static async performSecurityCheck(identifier, req, options = {}) {
    const deviceInfo = this.generateDeviceFingerprint(req);
    const ipAddress = deviceInfo.ipAddress;

    // Check if bot
    const isBot = this.isBot(req);
    if (isBot && options.blockBots) {
      throw new UnauthorizedError('Automated requests are not allowed');
    }

    // Check rate limits
    const limits = await this.enforceRateLimit(identifier, ipAddress, options);

    // Check account lockout
    const lockout = await this.enforceAccountLockout(identifier, options);

    // Get suspicious activity
    const suspicious = await this.getSuspiciousActivity(identifier, 60);

    return {
      deviceInfo,
      limits,
      lockout,
      suspicious,
      isBot,
    };
  }

  /**
   * Clean up old login attempts (maintenance job)
   * @param {number} olderThanDays - Delete attempts older than X days
   * @returns {Promise<number>} Number of deleted records
   */
  static async cleanupOldAttempts(olderThanDays = 90) {
    return LoginAttemptModel.deleteOldAttempts(olderThanDays);
  }
}

export default SecurityService;
