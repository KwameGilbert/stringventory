import { SecurityService } from '../services/SecurityService.js';

/**
 * Device Fingerprinting Middleware
 * Extracts device information and attaches to request
 */
export const deviceFingerprint = (req, res, next) => {
  try {
    // Generate device fingerprint and info
    const deviceInfo = SecurityService.generateDeviceFingerprint(req);

    // Attach to request for use in routes
    req.deviceInfo = deviceInfo;
    req.fingerprint = deviceInfo.fingerprintHash;

    next();
  } catch (error) {
    // Don't fail the request if fingerprinting fails
    req.deviceInfo = null;
    req.fingerprint = null;
    next();
  }
};

export default deviceFingerprint;
