/**
 * Superadmin Authentication Service - ISOLATED DUMMY DATA
 * Handles platform-level authentication independently from business admin.
 */

const SUPERADMIN_STORAGE_KEY = 'stringventory_superadmin_user';
const SUPERADMIN_TOKEN_KEY = 'stringventory_superadmin_token';

export const superadminAuthService = {
  /**
   * Login as Platform Admin (Dummy Mode)
   */
  login: async (email, password) => {
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // Support dummy login for any credentials or specific test one
    if (email.includes('admin')) {
      const mockUser = {
        id: 'plat-admin-001',
        email: email,
        firstName: 'Platform',
        lastName: 'Orchestrator',
        role: 'CEO', // This matches the SUPERADMIN role in accessControl
        isAdmin: true,
        isSuperAdmin: true,
        status: 'active',
        avatar: 'https://ui-avatars.com/api/?name=Platform+Admin&background=10b981&color=fff'
      };

      // Store in isolated localStorage keys
      localStorage.setItem(SUPERADMIN_STORAGE_KEY, JSON.stringify(mockUser));
      localStorage.setItem(SUPERADMIN_TOKEN_KEY, 'mock-superadmin-jwt-token');

      return mockUser;
    }

    throw new Error('Invalid platform administrator credentials');
  },

  /**
   * Get the current superadmin session
   */
  getCurrentUser: () => {
    const stored = localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Isolated logout
   */
  logout: () => {
    localStorage.removeItem(SUPERADMIN_STORAGE_KEY);
    localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
    window.location.href = '/superadmin/login';
  }
};

export default superadminAuthService;
