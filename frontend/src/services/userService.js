/**
 * User Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const userService = {
  /**
   * Get all users
   */
  getUsers: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    return await apiClient.get(API_ENDPOINTS.USERS.GET(userId));
  },

  /**
   * Create new user
   */
  createUser: async (userData) => {
    return await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData);
  },

  /**
   * Update user
   */
  updateUser: async (userId, userData) => {
    return await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    return await apiClient.delete(API_ENDPOINTS.USERS.DELETE(userId));
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (userId) => {
    return await apiClient.post(API_ENDPOINTS.USERS.RESEND_VERIFICATION(userId));
  },

  resetPassword: async (userId, passwordData) => {
    return await apiClient.post(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), {
      userId,
      user_id: userId,
      ...passwordData,
      // Ensure all common naming conventions are covered
      current_password: passwordData.currentPassword || passwordData.current_password,
      new_password: passwordData.newPassword || passwordData.new_password || passwordData.password,
      password: passwordData.newPassword || passwordData.password,
      password_confirmation: passwordData.confirmPassword || passwordData.newPassword || passwordData.password_confirmation
    });
  },
};

export default userService;
