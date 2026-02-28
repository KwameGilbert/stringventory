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
   * Get user permissions
   */
  getUserPermissions: async (userId) => {
    return await apiClient.get(API_ENDPOINTS.USERS.PERMISSIONS(userId));
  },

  /**
   * Update user permissions
   */
  updateUserPermissions: async (userId, permissions = []) => {
    return await apiClient.put(API_ENDPOINTS.USERS.PERMISSIONS(userId), { permissions });
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (userId) => {
    return await apiClient.post(API_ENDPOINTS.USERS.RESEND_VERIFICATION(userId));
  },
};

export default userService;
