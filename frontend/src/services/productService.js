/**
 * Product Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const productService = {
  /**
   * Get all products
   */
  getProducts: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
  },

  /**
   * Get product by ID
   */
  getProductById: async (productId) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCTS.GET(productId));
  },

  /**
   * Create new product
   */
  createProduct: async (productData) => {
    return await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
  },

  /**
   * Update product
   */
  updateProduct: async (productId, productData) => {
    return await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(productId), productData);
  },

  /**
   * Delete product
   */
  deleteProduct: async (productId) => {
    return await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(productId));
  },

  /**
   * Get low stock products
   */
  getLowStockProducts: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCTS.LOW_STOCK, { params });
  },

  /**
   * Get expiring products
   */
  getExpiringProducts: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.PRODUCTS.EXPIRING, { params });
  },
};

export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST, { params });
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId) => {
    return await apiClient.get(API_ENDPOINTS.CATEGORIES.GET(categoryId));
  },

  /**
   * Create new category
   */
  createCategory: async (categoryData) => {
    return await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
  },

  /**
   * Update category
   */
  updateCategory: async (categoryId, categoryData) => {
    return await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(categoryId), categoryData);
  },

  /**
   * Delete category
   */
  deleteCategory: async (categoryId) => {
    return await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
  },
};

export default { productService, categoryService };
