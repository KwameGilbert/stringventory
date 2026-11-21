/**
 * superadminAuthService — DEPRECATED
 *
 * This file previously provided a mock/dummy superadmin authentication flow.
 * It has been replaced by the unified auth system:
 *
 *   - All users (superadmin, CEO, manager, sales) log in at /login
 *   - The AuthProvider handles role detection and sets isSuperAdmin: true
 *     for platform-level administrators
 *   - SuperadminRoute enforces access based on user.isSuperAdmin
 *
 * This stub is kept temporarily to avoid import errors in any files that
 * haven't been updated yet. It will be removed in a future cleanup pass.
 */

export const superadminAuthService = {
  login: () => {
    throw new Error(
      '[superadminAuthService] Deprecated — use the unified /login page with AuthProvider.'
    );
  },
  getCurrentUser: () => null,
  logout: () => {
    window.location.href = '/login';
  },
};

export default superadminAuthService;
