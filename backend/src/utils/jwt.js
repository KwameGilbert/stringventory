import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from './errors.js';

/**
 * JWT Utility - Handles all JWT token operations
 * Provides a centralized way to generate, verify, and decode tokens
 */

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode in token
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role
 * @param {Array} [payload.permissions] - User permissions (optional)
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  if (!payload.id || !payload.email) {
    throw new Error('User ID and email are required for token generation');
  }

  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    permissions: payload.permissions || [],
    type: 'access',
  };

  return jwt.sign(tokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '15m', // Default 15 minutes
    subject: String(payload.id),
    issuer: env.APP_NAME || 'StringVentory',
    audience: 'api',
  });
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - User data to encode in token
 * @returns {string} Signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  if (!payload.id) {
    throw new Error('User ID is required for refresh token generation');
  }

  const tokenPayload = {
    id: payload.id,
    type: 'refresh',
  };

  return jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN || '30d', // Default 30 days
    subject: String(payload.id),
    issuer: env.APP_NAME || 'StringVentory',
    audience: 'api',
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - User data
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.APP_NAME || 'StringVentory',
      audience: 'api',
    });

    if (decoded.type !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 */
export const verifyRefreshToken = (token) => {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: env.APP_NAME || 'StringVentory',
      audience: 'api',
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (useful for getting expiration)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return null;
  }
};

/**
 * Get token expiration date
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) {
    return null;
  }
  return new Date(decoded.payload.exp * 1000);
};

/**
 * Check if token is expired (without verification)
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return expiration < new Date();
};

/**
 * Get time until token expires (in milliseconds)
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration (negative if expired)
 */
export const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  return expiration.getTime() - Date.now();
};

/**
 * Extract user ID from token (without full verification)
 * @param {string} token - JWT token
 * @returns {string|null} User ID or null
 */
export const extractUserId = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload) return null;
  return decoded.payload.sub || decoded.payload.id;
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  extractUserId,
};
