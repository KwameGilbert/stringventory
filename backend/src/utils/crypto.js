import crypto from 'crypto';

/**
 * Crypto Utility - Handles hashing and encryption operations
 * Used for hashing refresh tokens, device fingerprints, and other sensitive data
 */

/**
 * Hash a string using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} Hex string hash
 */
export const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Hash a string using SHA-512
 * @param {string} data - Data to hash
 * @returns {string} Hex string hash
 */
export const sha512 = (data) => {
  return crypto.createHash('sha512').update(data).digest('hex');
};

/**
 * Hash refresh token for secure storage
 * Uses SHA-256 to create a one-way hash
 * @param {string} token - Refresh token to hash
 * @returns {string} Hashed token
 */
export const hashRefreshToken = (token) => {
  if (!token) {
    throw new Error('Token is required for hashing');
  }
  return sha256(token);
};

/**
 * Hash device fingerprint
 * @param {Object} fingerprint - Device fingerprint object
 * @returns {string} Hashed fingerprint
 */
export const hashFingerprint = (fingerprint) => {
  if (!fingerprint) {
    throw new Error('Fingerprint is required');
  }

  // Convert object to stable string representation
  const fingerprintString =
    typeof fingerprint === 'string'
      ? fingerprint
      : JSON.stringify(fingerprint, Object.keys(fingerprint).sort());

  return sha256(fingerprintString);
};

/**
 * Generate a cryptographically secure random token
 * @param {number} length - Length in bytes (default: 32)
 * @returns {string} Random hex string
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a random UUID v4
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {string} HMAC signature
 */
export const createHMAC = (data, secret, algorithm = 'sha256') => {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
};

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {boolean} True if signature is valid
 */
export const verifyHMAC = (data, signature, secret, algorithm = 'sha256') => {
  const expectedSignature = createHMAC(data, secret, algorithm);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

/**
 * Compare two values in constant time (prevents timing attacks)
 * @param {string} a - First value
 * @param {string} b - Second value
 * @returns {boolean} True if values are equal
 */
export const constantTimeCompare = (a, b) => {
  if (!a || !b) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch (error) {
    // If buffers are different lengths, timingSafeEqual throws
    return false;
  }
};

/**
 * Hash a password reset token or email verification token
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 */
export const hashToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }
  return sha256(token);
};

/**
 * Generate a numeric OTP (One-Time Password)
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} Numeric OTP
 */
export const generateOTP = (length = 6) => {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  const otp = crypto.randomInt(min, max + 1);
  return otp.toString().padStart(length, '0');
};

/**
 * Encrypt data using AES-256-GCM
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key (must be 32 bytes)
 * @returns {Object} { encrypted, iv, authTag }
 */
export const encrypt = (data, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

/**
 * Decrypt data encrypted with AES-256-GCM
 * @param {string} encrypted - Encrypted data
 * @param {string} key - Decryption key
 * @param {string} iv - Initialization vector
 * @param {string} authTag - Authentication tag
 * @returns {string} Decrypted data
 */
export const decrypt = (encrypted, key, iv, authTag) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

/**
 * Generate a cryptographic hash for rate limiting keys
 * @param {string} identifier - Identifier (email, IP, etc.)
 * @param {string} context - Context (login, api, etc.)
 * @returns {string} Hash key
 */
export const generateRateLimitKey = (identifier, context = 'default') => {
  return sha256(`${context}:${identifier}`);
};

export default {
  sha256,
  sha512,
  hashRefreshToken,
  hashFingerprint,
  generateSecureToken,
  generateUUID,
  createHMAC,
  verifyHMAC,
  constantTimeCompare,
  hashToken,
  generateOTP,
  encrypt,
  decrypt,
  generateRateLimitKey,
};
