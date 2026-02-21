import { UserModel } from '../models/UserModel.js';
import { tokenService } from './TokenService.js';
import { emailService } from './EmailService.js';
import { AuditService } from './AuditService.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Authentication Helper Service
 * Contains non-core helper functions for authentication flows.
 */
export class AuthService {
  /**
   * Resend a verification email to a user
   * @param {string} email - User email
   */
  static async resendVerification(email) {
    const user = await UserModel.findByEmail(email);

    // Security: Don't reveal if user exists, but only send if unverified
    if (user && !user.emailVerifiedAt) {
      const { token } = await tokenService.createVerificationToken(user.id);

      await emailService.sendVerificationEmail(user.email, user.firstName, token);

      // Log for security monitoring
      console.log(`Verification email resent to ${email}`);
    }

    return true;
  }
}

export default AuthService;
