import { AuditLogModel } from '../models/AuditLogModel.js';
import { getClientIP, sanitizeIP } from '../utils/deviceInfo.js';

/**
 * Audit Service
 * Centralized security event logging and audit trail management
 */
export class AuditService {
  /**
   * Event types (re-export from model for convenience)
   */
  static get EVENT_TYPES() {
    return AuditLogModel.EVENT_TYPES;
  }

  /**
   * Extract context from request
   * @param {Object} req - Express request object
   * @returns {Object} Context object
   */
  static extractContext(req) {
    return {
      ipAddress: sanitizeIP(getClientIP(req)),
      userAgent: req.headers['user-agent'] || 'Unknown',
      sessionId: req.session?.id || req.sessionId || null,
    };
  }

  /**
   * Log a generic audit event
   * @param {string} eventType - Type of event
   * @param {string} userId - User ID (null for anonymous)
   * @param {Object} contextOrReq - Request context object OR Express req object
   * @param {Object} metadata - Additional event data
   * @returns {Promise<Object>} Created audit log
   */
  static async logEvent(eventType, userId, contextOrReq, metadata = null) {
    const context =
      contextOrReq && contextOrReq.headers ? this.extractContext(contextOrReq) : contextOrReq || {};

    return AuditLogModel.logEvent({
      eventType,
      userId,
      ...context,
      metadata,
    });
  }

  /**
   * Log login success
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {Object} metadata - Additional data
   * @returns {Promise<Object>} Created audit log
   */
  static async logLoginSuccess(userId, req, metadata = {}) {
    const context = this.extractContext(req);
    return AuditLogModel.logLoginSuccess(userId, context);
  }

  /**
   * Log login failure
   * @param {string} identifier - Email/username attempted
   * @param {string} reason - Failure reason
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logLoginFailure(identifier, reason, req) {
    const context = this.extractContext(req);
    return AuditLogModel.logLoginFailure(identifier, reason, context);
  }

  /**
   * Log logout
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logLogout(userId, req) {
    const context = this.extractContext(req);
    return AuditLogModel.logLogout(userId, context);
  }

  /**
   * Log logout from all sessions
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logLogoutAll(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.LOGOUT_ALL, userId, context);
  }

  /**
   * Log token refresh
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logTokenRefresh(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.TOKEN_REFRESH, userId, context);
  }

  /**
   * Log token revocation
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {string} reason - Revocation reason
   * @returns {Promise<Object>} Created audit log
   */
  static async logTokenRevoked(userId, req, reason = null) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.TOKEN_REVOKED, userId, context, { reason });
  }

  /**
   * Log session revocation
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logSessionRevoked(userId, sessionId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.SESSION_REVOKED, userId, {
      ...context,
      sessionId,
    });
  }

  /**
   * Log password change
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logPasswordChange(userId, req) {
    const context = this.extractContext(req);
    return AuditLogModel.logPasswordChange(userId, context);
  }

  /**
   * Log password reset requested
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logPasswordResetRequested(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.PASSWORD_RESET_REQUESTED, userId, context);
  }

  /**
   * Log password reset completed
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logPasswordResetCompleted(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.PASSWORD_RESET_COMPLETED, userId, context);
  }

  /**
   * Log email verification
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logEmailVerified(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.EMAIL_VERIFIED, userId, context);
  }

  /**
   * Log MFA enabled
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logMFAEnabled(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.MFA_ENABLED, userId, context);
  }

  /**
   * Log MFA disabled
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logMFADisabled(userId, req) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.MFA_DISABLED, userId, context);
  }

  /**
   * Log account locked
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {string} reason - Lock reason
   * @returns {Promise<Object>} Created audit log
   */
  static async logAccountLocked(userId, req, reason) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.ACCOUNT_LOCKED, userId, context, { reason });
  }

  /**
   * Log suspicious activity
   * @param {string} userId - User ID (if known)
   * @param {string} description - Activity description
   * @param {Object} req - Express request object
   * @returns {Promise<Object>} Created audit log
   */
  static async logSuspiciousActivity(userId, description, req) {
    const context = this.extractContext(req);
    return AuditLogModel.logSuspiciousActivity(userId, description, context);
  }

  /**
   * Log permission change
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {Object} changes - Permission changes
   * @returns {Promise<Object>} Created audit log
   */
  static async logPermissionChanged(userId, req, changes) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.PERMISSION_CHANGED, userId, context, { changes });
  }

  /**
   * Log role change
   * @param {string} userId - User ID
   * @param {Object} req - Express request object
   * @param {Object} changes - Role changes
   * @returns {Promise<Object>} Created audit log
   */
  static async logRoleChanged(userId, req, changes) {
    const context = this.extractContext(req);
    return this.logEvent(AuditService.EVENT_TYPES.ROLE_CHANGED, userId, context, { changes });
  }

  /**
   * Get user's audit trail
   * @param {string} userId - User ID
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Paginated audit logs
   */
  static async getUserAuditTrail(userId, options = {}) {
    return AuditLogModel.getUserLogs(userId, options);
  }

  /**
   * Get recent audit logs for user
   * @param {string} userId - User ID
   * @param {number} limit - Number of records
   * @returns {Promise<Array>} Recent logs
   */
  static async getUserRecentActivity(userId, limit = 20) {
    return AuditLogModel.getUserRecentLogs(userId, limit);
  }

  /**
   * Get security events
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Paginated security events
   */
  static async getSecurityEvents(options = {}) {
    return AuditLogModel.getSecurityEvents(options);
  }

  /**
   * Get event logs by type
   * @param {string} eventType - Event type
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated logs
   */
  static async getEventLogs(eventType, options = {}) {
    return AuditLogModel.getEventLogs(eventType, options);
  }

  /**
   * Get user activity summary
   * @param {string} userId - User ID
   * @param {number} days - Number of days
   * @returns {Promise<Object>} Activity summary
   */
  static async getUserActivitySummary(userId, days = 30) {
    return AuditLogModel.getUserActivitySummary(userId, days);
  }

  /**
   * Get event type statistics
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Event statistics
   */
  static async getEventTypeStats(startDate, endDate) {
    return AuditLogModel.getEventTypeStats(startDate, endDate);
  }

  /**
   * Get logs by IP address
   * @param {string} ipAddress - IP address
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated logs
   */
  static async getLogsByIP(ipAddress, options = {}) {
    return AuditLogModel.getLogsByIP(ipAddress, options);
  }

  /**
   * Clean up old audit logs (maintenance job)
   * @param {number} olderThanDays - Delete logs older than X days
   * @returns {Promise<number>} Number of deleted records
   */
  static async cleanupOldLogs(olderThanDays = 365) {
    return AuditLogModel.deleteOldLogs(olderThanDays);
  }
}

export default AuditService;
