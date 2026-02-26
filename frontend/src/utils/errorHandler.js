/**
 * Error Handling Utilities
 * Parse and handle API errors consistently across the application
 */

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
    return {
      message: error.response.data?.message || error.message,
      details: error.response.data?.details || {},
      code: error.response.data?.code || 'API_ERROR',
      status: error.response.status,
    };
  }

  // If error is from our API client (already parsed)
  if (error.message && error.code) {
    return {
      message: error.message,
      details: error.details || {},
      code: error.code,
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
 * Check if error is 422 Validation Error
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isValidationError = (error) => isErrorStatus(error, 422);

/**
 * Handle API error and display appropriate message
 * @param {Object} error - Error object
 * @param {Function} showError - Error display function (e.g., showError from alerts)
 */
export const handleApiError = (error, showError) => {
  const parsed = parseApiError(error);

  if (isUnauthorizedError(error)) {
    showError('Session expired. Please log in again.');
  } else if (isForbiddenError(error)) {
    showError('You do not have permission to perform this action.');
  } else if (isNotFoundError(error)) {
    showError('The requested resource was not found.');
  } else if (isValidationError(error)) {
    const fieldErrors = Object.entries(parsed.details)
      .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
      .join('\n');
    showError(fieldErrors || parsed.message);
  } else {
    showError(parsed.message);
  }
};

/**
 * Create error boundary wrapper for components
 */
export class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-semibold">Something went wrong</h3>
          <p className="text-sm mt-2">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
