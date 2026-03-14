/**
 * Category Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const categoryService = {
  getCategories: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, { params });
  },

  getCategoryById: async (categoryId) => {
    return await apiClient.get(API_ENDPOINTS.CATEGORIES.GET(categoryId));
  },

  createCategory: async (categoryData) => {
    return await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
  },

  updateCategory: async (categoryId, categoryData) => {
    return await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(categoryId), categoryData);
  },

  deleteCategory: async (categoryId) => {
    return await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
  },
};

export default categoryService;
