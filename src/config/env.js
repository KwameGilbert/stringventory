/**
 * config/env.js
 * Centralized access to all VITE_ environment variables.
 * Import from here instead of calling import.meta.env directly.
 */

const env = {
  /** Base URL for all API requests */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,

  /** localStorage key used to persist the authenticated user session */
  AUTH_USER_KEY: import.meta.env.VITE_AUTH_USER_KEY,

  /** App display name */
  APP_NAME: import.meta.env.VITE_APP_NAME,

  /** Current environment: 'development' | 'production' | 'test' */
  MODE: import.meta.env.MODE,

  /** True when running in development mode */
  IS_DEV: import.meta.env.DEV,

  /** True when running a production build */
  IS_PROD: import.meta.env.PROD,
};

export default env;
