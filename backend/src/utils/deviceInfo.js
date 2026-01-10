import { sha256 } from './crypto.js';

/**
 * Device Info Parser - Extracts and parses device information from HTTP requests
 * Used for device fingerprinting and session management
 */

/**
 * Parse User-Agent string to extract browser and OS information
 * Basic implementation - can be enhanced with ua-parser-js if needed
 * @param {string} userAgent - User-Agent header string
 * @returns {Object} Parsed device information
 */
export const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      browserVersion: 'Unknown',
      os: 'Unknown',
      osVersion: 'Unknown',
      device: 'Unknown',
      isBot: false,
    };
  }

  const ua = userAgent.toLowerCase();

  // Detect bots
  const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
  const isBot = botPatterns.some((pattern) => ua.includes(pattern));

  // Detect browser
  let browser = 'Unknown';
  let browserVersion = 'Unknown';

  if (ua.includes('edg/')) {
    browser = 'Edge';
    browserVersion = ua.match(/edg\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
    browser = 'Chrome';
    browserVersion = ua.match(/chrome\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.match(/firefox\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
    browser = 'Safari';
    browserVersion = ua.match(/version\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    browser = 'Opera';
    browserVersion = ua.match(/(opera|opr)\/([\d.]+)/)?.[2] || 'Unknown';
  }

  // Detect OS
  let os = 'Unknown';
  let osVersion = 'Unknown';

  if (ua.includes('windows nt')) {
    os = 'Windows';
    const versionMap = {
      '10.0': '10',
      6.3: '8.1',
      6.2: '8',
      6.1: '7',
      '6.0': 'Vista',
      5.1: 'XP',
    };
    const ntVersion = ua.match(/windows nt ([\d.]+)/)?.[1];
    osVersion = versionMap[ntVersion] || ntVersion || 'Unknown';
  } else if (ua.includes('mac os x')) {
    os = 'macOS';
    osVersion = ua.match(/mac os x ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (ua.includes('android')) {
    os = 'Android';
    osVersion = ua.match(/android ([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
    osVersion = ua.match(/os ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  // Detect device type
  let device = 'Desktop';
  if (ua.includes('mobile')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    isBot,
    raw: userAgent,
  };
};

/**
 * Extract device information from Express request
 * @param {Object} req - Express request object
 * @returns {Object} Device information
 */
export const extractDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const parsedUA = parseUserAgent(userAgent);

  // Get IP address (handles proxies)
  const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'Unknown';

  // Get accept language
  const acceptLanguage = req.headers['accept-language'] || 'Unknown';

  return {
    ipAddress,
    userAgent,
    ...parsedUA,
    acceptLanguage,
  };
};

/**
 * Generate device fingerprint from request
 * Creates a hash based on multiple device characteristics
 * @param {Object} req - Express request object
 * @returns {string} Device fingerprint hash
 */
export const generateDeviceFingerprint = (req) => {
  const deviceInfo = extractDeviceInfo(req);

  // Combine multiple factors for fingerprint
  const fingerprintData = {
    userAgent: deviceInfo.userAgent,
    acceptLanguage: deviceInfo.acceptLanguage,
    // Don't include IP as it can change frequently (mobile networks, VPNs)
    // But you can include it if you want stricter fingerprinting
  };

  // Create a stable string representation
  const fingerprintString = JSON.stringify(fingerprintData, Object.keys(fingerprintData).sort());

  return sha256(fingerprintString);
};

/**
 * Create a user-friendly device description
 * @param {Object} deviceInfo - Parsed device info
 * @returns {string} Human-readable device description
 */
export const getDeviceDescription = (deviceInfo) => {
  const { browser, browserVersion, os, osVersion, device } = deviceInfo;

  let description = '';

  if (browser !== 'Unknown') {
    description += `${browser}`;
    if (browserVersion !== 'Unknown') {
      description += ` ${browserVersion.split('.')[0]}`; // Major version only
    }
  }

  if (os !== 'Unknown') {
    if (description) description += ' on ';
    description += `${os}`;
    if (osVersion !== 'Unknown') {
      description += ` ${osVersion}`;
    }
  }

  if (device !== 'Desktop') {
    description += ` (${device})`;
  }

  return description || 'Unknown Device';
};

/**
 * Check if request is from a bot/crawler
 * @param {Object} req - Express request object
 * @returns {boolean} True if bot detected
 */
export const isBot = (req) => {
  const deviceInfo = extractDeviceInfo(req);
  return deviceInfo.isBot;
};

/**
 * Get client IP address from request
 * Handles proxied requests properly
 * @param {Object} req - Express request object
 * @returns {string} IP address
 */
export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] || // Cloudflare
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'Unknown'
  );
};

/**
 * Sanitize IP address (remove IPv6 prefix if present)
 * @param {string} ip - IP address
 * @returns {string} Sanitized IP
 */
export const sanitizeIP = (ip) => {
  if (!ip) return 'Unknown';

  // Remove IPv6 prefix for IPv4 addresses
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }

  return ip;
};

/**
 * Create full device info object for storage
 * @param {Object} req - Express request object
 * @returns {Object} Complete device information object
 */
export const createDeviceRecord = (req) => {
  const deviceInfo = extractDeviceInfo(req);
  const fingerprint = generateDeviceFingerprint(req);
  const description = getDeviceDescription(deviceInfo);

  return {
    fingerprint,
    fingerprintHash: fingerprint, // Already hashed
    ipAddress: sanitizeIP(deviceInfo.ipAddress),
    userAgent: deviceInfo.userAgent,
    browser: deviceInfo.browser,
    browserVersion: deviceInfo.browserVersion,
    os: deviceInfo.os,
    osVersion: deviceInfo.osVersion,
    device: deviceInfo.device,
    description,
    isBot: deviceInfo.isBot,
  };
};

export default {
  parseUserAgent,
  extractDeviceInfo,
  generateDeviceFingerprint,
  getDeviceDescription,
  isBot,
  getClientIP,
  sanitizeIP,
  createDeviceRecord,
};
