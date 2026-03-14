/**
 * Custom API Hooks
 * Reusable hooks for API calls with loading, error, and data states
 */

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from './api.client';

/**
 * useApi - Hook for making API calls with loading and error states
 * @param {Function} apiCall - The API call function to execute
 * @param {Array} dependencies - Dependency array for useCallback
 * @returns {Object} - { data, loading, error, execute }
 */
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    dependencies
  );

  return { data, loading, error, execute };
};

/**
 * useFetch - Hook for fetching data on component mount
 * @param {String} url - The API endpoint URL
 * @param {Object} options - Request options (method, params, etc.)
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * usePost - Hook for POST requests
 * @param {String} url - The API endpoint URL
 * @returns {Object} - { data, loading, error, execute }
 */
export const usePost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (payload = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(url, payload);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.message || 'Failed to post data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { data, loading, error, execute };
};

/**
 * usePut - Hook for PUT requests
 * @param {String} url - The API endpoint URL
 * @returns {Object} - { data, loading, error, execute }
 */
export const usePut = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (payload = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put(url, payload);
        setData(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err.message || 'Failed to update data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { data, loading, error, execute };
};

/**
 * useDelete - Hook for DELETE requests
 * @param {String} url - The API endpoint URL
 * @returns {Object} - { data, loading, error, execute }
 */
export const useDelete = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(url);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, execute };
};

/**
 * usePagination - Hook for handling paginated API requests
 * @param {Function} fetchFn - Function to fetch paginated data
 * @returns {Object} - { data, loading, error, page, limit, total, goToPage, nextPage, prevPage }
 */
export const usePagination = (fetchFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (pageNum = 1, pageLimit = 20) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFn({ page: pageNum, limit: pageLimit });
        setData(response.data);
        setTotal(response.pagination?.total || 0);
        setPage(pageNum);
        setLimit(pageLimit);
      } catch (err) {
        setError(err.message || 'Failed to fetch paginated data');
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    fetchData(page, limit);
  }, []);

  const goToPage = (pageNum) => fetchData(pageNum, limit);
  const nextPage = () => fetchData(page + 1, limit);
  const prevPage = () => {
    if (page > 1) fetchData(page - 1, limit);
  };

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchData(page, limit),
  };
};
