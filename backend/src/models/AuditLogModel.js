import { BaseModel } from './BaseModel.js';

/**
 * Audit Log Model
 * Tracks security and authentication events for compliance and monitoring
 */
class AuditLogModelClass extends BaseModel {
  constructor() {
    super('auditLogs', {
      timestamps: false, // Only has createdAt
      softDeletes: false,
      searchableFields: ['eventType', 'ipAddress'],
      sortableFields: ['createdAt', 'eventType'],
      hidden: [],
    });
  }

  /**
   * Event type constants
   */
  static EVENT_TYPES = {
    // Authentication events
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILURE: 'login_failure',
    LOGOUT: 'logout',
    LOGOUT_ALL: 'logout_all',

    // Token events
    TOKEN_REFRESH: 'token_refresh',
    TOKEN_REVOKED: 'token_revoked',
    SESSION_REVOKED: 'session_revoked',
    SESSION_EXPIRED: 'session_expired',

    // Account events
    PASSWORD_CHANGED: 'password_changed',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
    PASSWORD_RESET_COMPLETED: 'password_reset_completed',
    EMAIL_VERIFIED: 'email_verified',
    EMAIL_CHANGED: 'email_changed',

    // Security events
    MFA_ENABLED: 'mfa_enabled',
    MFA_DISABLED: 'mfa_disabled',
    MFA_VERIFIED: 'mfa_verified',
    MFA_FAILED: 'mfa_failed',
    ACCOUNT_LOCKED: 'account_locked',
    ACCOUNT_UNLOCKED: 'account_unlocked',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity',

    // Permission events
    PERMISSION_CHANGED: 'permission_changed',
    ROLE_CHANGED: 'role_changed',

    // Account management
    ACCOUNT_CREATED: 'account_created',
    ACCOUNT_DELETED: 'account_deleted',
    ACCOUNT_ACTIVATED: 'account_activated',
    ACCOUNT_DEACTIVATED: 'account_deactivated',
  };

  /**
   * Log an audit event
   * @param {Object} data - Event data
   * @param {string} data.eventType - Type of event
   * @param {string} data.userId - User ID (null for anonymous events)
   * @param {string} data.ipAddress - IP address
   * @param {string} data.userAgent - User agent string
   * @param {string} data.sessionId - Session ID (if applicable)
   * @param {Object} data.metadata - Additional event metadata
   * @returns {Object} Created audit log record
   */
  async logEvent(data) {
    const {
      eventType,
      userId = null,
      ipAddress,
      userAgent,
      sessionId = null,
      metadata = null,
    } = data;

    return this.create({
      eventType: eventType?.substring(0, 100),
      userId,
      ipAddress: ipAddress?.substring(0, 50),
      userAgent: userAgent?.substring(0, 500),
      sessionId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  }

  /**
   * Log login success
   * @param {string} userId - User ID
   * @param {Object} context - Request context (IP, UA, sessionId)
   * @returns {Object} Created log
   */
  async logLoginSuccess(userId, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.LOGIN_SUCCESS,
      userId,
      ...context,
    });
  }

  /**
   * Log login failure
   * @param {string} identifier - Email/username attempted
   * @param {string} reason - Failure reason
   * @param {Object} context - Request context
   * @returns {Object} Created log
   */
  async logLoginFailure(identifier, reason, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.LOGIN_FAILURE,
      userId: null,
      metadata: { identifier, reason },
      ...context,
    });
  }

  /**
   * Log logout
   * @param {string} userId - User ID
   * @param {Object} context - Request context
   * @returns {Object} Created log
   */
  async logLogout(userId, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.LOGOUT,
      userId,
      ...context,
    });
  }

  /**
   * Log password change
   * @param {string} userId - User ID
   * @param {Object} context - Request context
   * @returns {Object} Created log
   */
  async logPasswordChange(userId, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.PASSWORD_CHANGED,
      userId,
      ...context,
    });
  }

  /**
   * Log suspicious activity
   * @param {string} userId - User ID (if known)
   * @param {string} description - Activity description
   * @param {Object} context - Request context
   * @returns {Object} Created log
   */
  async logSuspiciousActivity(userId, description, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.SUSPICIOUS_ACTIVITY,
      userId,
      metadata: { description },
      ...context,
    });
  }

  /**
   * Get audit logs for a user
   * @param {string} userId - User ID
   * @param {Object} options - Pagination and filter options
   * @returns {Object} Paginated audit logs
   */
  async getUserLogs(userId, options = {}) {
    const filters = { userId, ...options.filters };
    return this.findAll({ ...options, filters });
  }

  /**
   * Get logs by event type
   * @param {string} eventType - Event type
   * @param {Object} options - Pagination options
   * @returns {Object} Paginated logs
   */
  async getEventLogs(eventType, options = {}) {
    const filters = { eventType, ...options.filters };
    return this.findAll({ ...options, filters });
  }

  /**
   * Get recent logs for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of records
   * @returns {Array} Recent logs
   */
  async getUserRecentLogs(userId, limit = 20) {
    const records = await this.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    return records;
  }

  /**
   * Get security events (filtered list of security-related events)
   * @param {Object} options - Filter and pagination options
   * @returns {Object} Paginated security events
   */
  async getSecurityEvents(options = {}) {
    const securityEventTypes = [
      AuditLogModelClass.EVENT_TYPES.LOGIN_FAILURE,
      AuditLogModelClass.EVENT_TYPES.MFA_FAILED,
      AuditLogModelClass.EVENT_TYPES.ACCOUNT_LOCKED,
      AuditLogModelClass.EVENT_TYPES.SUSPICIOUS_ACTIVITY,
      AuditLogModelClass.EVENT_TYPES.SESSION_REVOKED,
    ];

    let query = this.query().whereIn('eventType', securityEventTypes);

    if (options.filters) {
      query = this.applyFilters(query, options.filters);
    }

    const { page = 1, limit = 50 } = options;
    const offset = (page - 1) * limit;

    const [{ count }] = await query.clone().count('id as count');
    const total = parseInt(count);

    const data = await query.orderBy('createdAt', 'desc').limit(limit).offset(offset);

    return {
      data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get event type statistics
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Event type counts
   */
  async getEventTypeStats(startDate, endDate = new Date()) {
    const records = await this.query()
      .whereBetween('createdAt', [startDate, endDate])
      .groupBy('eventType')
      .select('eventType')
      .count('* as count')
      .orderBy('count', 'desc');

    return records.map((record) => ({
      eventType: record.eventType,
      count: parseInt(record.count),
    }));
  }

  /**
   * Get user activity summary
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look back
   * @returns {Object} Activity summary
   */
  async getUserActivitySummary(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await this.query()
      .where('userId', userId)
      .where('createdAt', '>=', startDate)
      .groupBy('eventType')
      .select('eventType')
      .count('* as count');

    const summary = {
      userId,
      period: { days, startDate, endDate: new Date() },
      events: {},
      totalEvents: 0,
    };

    records.forEach((record) => {
      summary.events[record.eventType] = parseInt(record.count);
      summary.totalEvents += parseInt(record.count);
    });

    return summary;
  }

  /**
   * Get logs by IP address
   * @param {string} ipAddress - IP address
   * @param {Object} options - Pagination options
   * @returns {Object} Paginated logs
   */
  async getLogsByIP(ipAddress, options = {}) {
    const filters = { ipAddress, ...options.filters };
    return this.findAll({ ...options, filters });
  }

  /**
   * Search logs by metadata
   * @param {Object} metadataSearch - Key-value pairs to search in metadata JSON
   * @param {Object} options - Pagination options
   * @returns {Array} Matching logs
   */
  async searchByMetadata(metadataSearch, options = {}) {
    let query = this.query();

    // For PostgreSQL JSON search
    for (const [key, value] of Object.entries(metadataSearch)) {
      query = query.whereRaw(`metadata->>'${key}' = ?`, [value]);
    }

    const { page = 1, limit = 50 } = options;
    const offset = (page - 1) * limit;

    const records = await query.orderBy('createdAt', 'desc').limit(limit).offset(offset);

    return records;
  }

  /**
   * Delete old audit logs (cleanup job)
   * @param {number} olderThanDays - Delete logs older than X days
   * @returns {number} Number of deleted records
   */
  async deleteOldLogs(olderThanDays = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const deleted = await this.getConnection()(this.tableName)
      .where('createdAt', '<', cutoffDate)
      .del();

    return deleted;
  }

  /**
   * Get failed login attempts from different IPs for same user
   * @param {string} userId - User ID
   * @param {number} hours - Time window in hours
   * @returns {Array} IP addresses with failed login counts
   */
  async getFailedLoginIPs(userId, hours = 24) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    const records = await this.query()
      .where('userId', userId)
      .where('eventType', AuditLogModelClass.EVENT_TYPES.LOGIN_FAILURE)
      .where('createdAt', '>=', cutoffDate)
      .groupBy('ipAddress')
      .select('ipAddress')
      .count('* as attemptCount')
      .orderBy('attemptCount', 'desc');

    return records;
  }

  /**
   * Override prepareForInsert to only set createdAt
   */
  prepareForInsert(data) {
    const record = { ...data };

    if (!record[this.primaryKey]) {
      const { generateUUID } = require('../utils/helpers.js');
      record[this.primaryKey] = generateUUID();
    }

    const now = new Date();
    record.createdAt = record.createdAt || now;

    return record;
  }

  /**
   * Override prepareForUpdate (audit logs are generally immutable)
   */
  prepareForUpdate(data) {
    const record = { ...data };
    delete record[this.primaryKey];
    delete record.createdAt;
    return record;
  }
}

export const AuditLogModel = new AuditLogModelClass();
export default AuditLogModel;
