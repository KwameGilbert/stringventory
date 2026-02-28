/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient, API_ENDPOINTS, setTokens, clearTokens } from './api.client';

/**
 * Register a new user
 */
export const authService = {
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const payload = response?.data || response || {};
    const tokenPayload = response?.tokens || payload?.tokens || {};
    const accessToken = tokenPayload?.accessToken || payload?.accessToken;
    const refreshToken = tokenPayload?.refreshToken || payload?.refreshToken;

    if (accessToken) {
      setTokens(accessToken, refreshToken);
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: async (refreshToken) => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken,
      });
    } finally {
      clearTokens();
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });

    const payload = response?.data || response || {};
    const tokenPayload = response?.tokens || payload?.tokens || {};
    const nextAccessToken = tokenPayload?.accessToken || payload?.accessToken;
    const nextRefreshToken = tokenPayload?.refreshToken || payload?.refreshToken;

    if (nextAccessToken) {
      setTokens(nextAccessToken, nextRefreshToken);
    }

    return response;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
      confirmPassword,
    });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  },
};

export default authService;
