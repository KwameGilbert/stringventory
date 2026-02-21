import { BaseModel } from './BaseModel.js';
import { generateUUID } from '../utils/helpers.js';

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

    // Make EVENT_TYPES accessible on the instance
    this.EVENT_TYPES = AuditLogModelClass.EVENT_TYPES;
  }

  /**
   * Log an audit event
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
   */
  async logLoginFailure(identifier, reason, context) {
    return this.logEvent({
      eventType: AuditLogModelClass.EVENT_TYPES.LOGIN_FAILURE,
      metadata: { identifier, reason },
      ...context,
    });
  }

  /**
   * Log logout
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
   * Get logs for a user
   */
  async getUserLogs(userId, options = {}) {
    const filters = { userId };
    return this.findAll({ ...options, filters });
  }

  /**
   * Get recent logs for a user
   */
  async getUserRecentLogs(userId, limit = 20) {
    return this.query().where('userId', userId).orderBy('createdAt', 'desc').limit(limit);
  }

  /**
   * Get security-related events
   */
  async getSecurityEvents(options = {}) {
    const securityEvents = [
      AuditLogModelClass.EVENT_TYPES.LOGIN_FAILURE,
      AuditLogModelClass.EVENT_TYPES.PASSWORD_RESET_REQUESTED,
      AuditLogModelClass.EVENT_TYPES.ACCOUNT_LOCKED,
      AuditLogModelClass.EVENT_TYPES.SUSPICIOUS_ACTIVITY,
    ];

    const query = this.query().whereIn('eventType', securityEvents);
    return this.findAll({ ...options, query });
  }

  /**
   * Get logs by event type
   */
  async getEventLogs(eventType, options = {}) {
    const filters = { eventType };
    return this.findAll({ ...options, filters });
  }

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const logs = await this.query()
      .where('userId', userId)
      .where('createdAt', '>=', cutoffDate)
      .select('eventType')
      .count('id as count')
      .groupBy('eventType');

    return logs;
  }

  /**
   * Get event type statistics
   */
  async getEventTypeStats(startDate, endDate) {
    let query = this.query().select('eventType').count('id as count').groupBy('eventType');

    if (startDate) query = query.where('createdAt', '>=', startDate);
    if (endDate) query = query.where('createdAt', '<=', endDate);

    return query;
  }

  /**
   * Get logs by IP address
   */
  async getLogsByIP(ipAddress, options = {}) {
    const filters = { ipAddress };
    return this.findAll({ ...options, filters });
  }

  /**
   * Delete old logs
   */
  async deleteOldLogs(olderThanDays = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return this.query().where('createdAt', '<', cutoffDate).del();
  }

  /**
   * Override prepareForInsert to only set createdAt
   */
  prepareForInsert(data) {
    const record = { ...data };
    if (!record[this.primaryKey]) {
      record[this.primaryKey] = generateUUID();
    }
    record.createdAt = record.createdAt || new Date();
    return record;
  }

  /**
   * Override prepareForUpdate to prevent changing immutable fields
   */
  prepareForUpdate(data) {
    const record = { ...data };
    delete record[this.primaryKey];
    delete record.createdAt;
    return record;
  }
}

/**
 * Event type constants
 */
AuditLogModelClass.EVENT_TYPES = {
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

export const AuditLogModel = new AuditLogModelClass();
AuditLogModel.EVENT_TYPES = AuditLogModelClass.EVENT_TYPES;
export default AuditLogModel;
