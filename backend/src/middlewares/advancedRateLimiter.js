import { SecurityService } from '../services/SecurityService.js';
import { TooManyRequestsError } from '../utils/errors.js';

/**
 * Advanced Rate Limiter using database-backed login attempts
 * Provides more sophisticated rate limiting than express-rate-limit
 */

/**
 * Create advanced login rate limiter
 * @param {Object} options - Rate limit options
 * @returns {Function} Middleware function
 */
export const createAdvancedLoginLimiter = (options = {}) => {
  const { maxAttempts = 5, windowMinutes = 15, maxIPAttempts = 10, blockBots = true } = options;

  return async (req, res, next) => {
    try {
      const { email, identifier } = req.body;
      const target = email || identifier;

      if (!target) {
        // No identifier to rate limit, skip
        return next();
      }

      // Perform comprehensive security check
      try {
        await SecurityService.performSecurityCheck(target, req, {
          maxAttempts,
          windowMinutes,
          maxIPAttempts,
          blockBots,
        });

        // Passed all checks
        next();
      } catch (error) {
        // Security check failed, forward the error
        next(error);
      }
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Advanced login rate limiter with default settings
 */
export const advancedLoginLimiter = createAdvancedLoginLimiter();

/**
 * Strict login rate limiter (for sensitive operations)
 */
export const strictLoginLimiter = createAdvancedLoginLimiter({
  maxAttempts: 3,
  windowMinutes: 30,
  maxIPAttempts: 5,
  blockBots: true,
});

/**
 * Check account lockout middleware
 * Throws error if account is locket due to too many failures
 */
export const checkAccountLockout = (options = {}) => {
  const { maxFailures = 5, windowMinutes = 30 } = options;

  return async (req, res, next) => {
    try {
      const { email, identifier } = req.body;
      const target = email || identifier;

      if (!target) {
        return next();
      }

      // Check if account should be locked
      await SecurityService.enforceAccountLockout(target, {
        maxFailures,
        windowMinutes,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Log login attempt middleware (use after authentication)
 * Logs successful login attempts
 */
export const logSuccessfulLogin = async (req, res, next) => {
  try {
    const { user } = req;

    if (user && req.loginAttemptLogged !== true) {
      const { email, identifier } = req.body;

      await SecurityService.logLoginAttempt({
        userId: user.id,
        identifier: email || identifier || user.email,
        ipAddress: req.deviceInfo?.ipAddress || req.ip,
        userAgent: req.headers['user-agent'],
        success: true,
      });

      req.loginAttemptLogged = true;
    }

    next();
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log login attempt:', error);
    next();
  }
};

/**
 * Log failed login attempt middleware
 * Call this in catch blocks of login routes
 */
export const logFailedLogin = async (identifier, reason, req) => {
  try {
    await SecurityService.logLoginAttempt({
      userId: null,
      identifier,
      ipAddress: req.deviceInfo?.ipAddress || req.ip,
      userAgent: req.headers['user-agent'],
      success: false,
      failureReason: reason,
    });
  } catch (error) {
    console.error('Failed to log failed login attempt:', error);
  }
};

export default {
  createAdvancedLoginLimiter,
  advancedLoginLimiter,
  strictLoginLimiter,
  checkAccountLockout,
  logSuccessfulLogin,
  logFailedLogin,
};
