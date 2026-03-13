/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { apiClient, API_ENDPOINTS, setTokens, clearTokens, extractAuthTokens } from './api.client';

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

    const { accessToken, refreshToken } = extractAuthTokens(response);

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
      refresh_token: refreshToken,
    });

    const {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    } = extractAuthTokens(response);

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
  verifyEmail: async (email, token) => {
    return await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL(email, token));
  },
};

export default authService;
