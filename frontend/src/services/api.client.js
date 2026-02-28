/**
 * API Client - Axios Instance Configuration
 * Handles base configuration, interceptors, and HTTP requests
 */

import axios from 'axios';
import { API_ENDPOINTS, BASE_URL } from './api.endpoints';

// Get tokens from localStorage
const getAccessToken = () => localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'stringventory_access_token');
const getRefreshToken = () => localStorage.getItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'stringventory_refresh_token');

// Set tokens in localStorage
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'stringventory_access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'stringventory_refresh_token', refreshToken);
  }
};

// Clear tokens from localStorage
const clearTokens = () => {
  localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'stringventory_access_token');
  localStorage.removeItem(import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || 'stringventory_refresh_token');
  localStorage.removeItem(import.meta.env.VITE_AUTH_USER_KEY || 'stringventory_user');
};

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor
 * Add authorization header to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle token refresh on 401, parse errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data, not the entire response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
          refreshToken,
        });

        const payload = response?.data?.data || response?.data || {};
        const tokenPayload = payload?.tokens || response?.data?.tokens || {};
        const accessToken = tokenPayload?.accessToken || payload?.accessToken;
        const nextRefreshToken = tokenPayload?.refreshToken || payload?.refreshToken;

        if (!accessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        setTokens(accessToken, nextRefreshToken);

        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        // Trigger logout event
        window.dispatchEvent(new Event('logout'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const errorData = error.response?.data || {
      status: 'error',
      message: error.message || 'An error occurred',
    };

    return Promise.reject(errorData);
  }
);

export {
  apiClient,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  API_ENDPOINTS,
};
