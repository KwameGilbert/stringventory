import { showError as defaultShowError } from './alerts';

/**
 * Error Handling Utilities
 * Parse and handle API errors consistently across the application
 */

const getFirstString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim());

/**
 * Parse API error response
 * @param {Object} error - Error object from API
 * @returns {Object} - Parsed error with message and details
 */
export const parseApiError = (error) => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      details: {},
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }

  // If error is from axios response
  if (error.response) {
    const data = error.response.data || {};
    return {
      message: getFirstString(
        data.message,
        data.error,
        data.errorMessage,
        error.message,
        'An unexpected error occurred'
      ),
      details: data.details || data.errors || {},
      code: data.code || data.errorCode || 'API_ERROR',
      status: error.response.status,
    };
  }

  // If error is from our API client (already parsed)
  if (error.message && (error.code || error.status)) {
    return {
      message: error.message,
      details: error.details || {},
      code: error.code || 'ERROR',
      status: error.status || 500,
    };
  }

  // Generic error
  return {
    message: error.message || 'An error occurred',
    details: {},
    code: 'ERROR',
    status: 500,
  };
};

/**
 * Get error message for display
 * @param {Object} error - Error object
 * @returns {String} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  const parsed = parseApiError(error);
  return parsed.message;
};

/**
 * Get field-level errors from validation error
 * @param {Object} error - Error object with details
 * @returns {Object} - Field errors { fieldName: 'error message' }
 */
export const getFieldErrors = (error) => {
  const parsed = parseApiError(error);
  return parsed.details || {};
};

/**
 * Check if error is a specific HTTP status
 * @param {Object} error - Error object
 * @param {Number} status - HTTP status code
 * @returns {Boolean}
 */
export const isErrorStatus = (error, status) => {
  const parsed = parseApiError(error);
  return parsed.status === status;
};

/**
 * Check if error is 401 Unauthorized
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isUnauthorizedError = (error) => isErrorStatus(error, 401);

/**
 * Check if error is 403 Forbidden
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isForbiddenError = (error) => isErrorStatus(error, 403);

/**
 * Check if error is 404 Not Found
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isNotFoundError = (error) => isErrorStatus(error, 404);

/**
 * Check if error is 409 Conflict
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isConflictError = (error) => isErrorStatus(error, 409);

/**
 * Check if error is 422 Validation Error
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isValidationError = (error) => isErrorStatus(error, 422);

/**
 * Handle API error and display appropriate message
 * @param {Object} error - Error object
 * @param {Function} displayFn - Optional error display function (defaults to showAlert)
 */
export const handleApiError = (error, displayFn) => {
  const parsed = parseApiError(error);
  const showAlert = typeof displayFn === 'function' ? displayFn : defaultShowError;

  if (isUnauthorizedError(error)) {
    const defaultMsg = 'Session expired. Please log in again.';
    // Prefer specific backend message if it's not a generic "unauthorized" string
    const useBackendMsg = parsed.message && 
      !parsed.message.toLowerCase().includes('unauthorized') && 
      parsed.message.length < 100;
    
    showAlert(useBackendMsg ? parsed.message : defaultMsg);
  } else if (isForbiddenError(error)) {
    showAlert('You do not have permission to perform this action.');
  } else if (isNotFoundError(error)) {
    showAlert('The requested resource was not found.');
  } else if (isConflictError(error)) {
    showAlert(parsed.message || 'This record already exists.');
  } else if (isValidationError(error)) {
    let fieldErrors = '';
    if (typeof parsed.details === 'object') {
      fieldErrors = Object.entries(parsed.details)
        .map(([field, errors]) => {
          const msg = Array.isArray(errors) ? errors.join(', ') : errors;
          return `${field}: ${msg}`;
        })
        .join('\n');
    }
    showAlert(fieldErrors || parsed.message);
  } else {
    showAlert(parsed.message);
  }
};

/**
 * Validation error formatter
 * Convert validation errors to field-level format
 */
export const formatValidationErrors = (error) => {
  const fieldErrors = getFieldErrors(error);
  return Object.keys(fieldErrors).reduce((acc, field) => {
    acc[field] = Array.isArray(fieldErrors[field])
      ? fieldErrors[field][0]
      : fieldErrors[field];
    return acc;
  }, {});
};
