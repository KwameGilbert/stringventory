/**
 * Customer Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const customerService = {
  /**
   * Get all customers
   */
  getCustomers: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.CUSTOMERS.LIST, { params });
  },

  /**
   * Get customer by ID
   */
  getCustomerById: async (customerId) => {
    return await apiClient.get(API_ENDPOINTS.CUSTOMERS.GET(customerId));
  },

  /**
   * Create new customer
   */
  createCustomer: async (customerData) => {
    return await apiClient.post(API_ENDPOINTS.CUSTOMERS.CREATE, customerData);
  },

  /**
   * Update customer
   */
  updateCustomer: async (customerId, customerData) => {
    return await apiClient.put(API_ENDPOINTS.CUSTOMERS.UPDATE(customerId), customerData);
  },

  /**
   * Delete customer
   */
  deleteCustomer: async (customerId) => {
    return await apiClient.delete(API_ENDPOINTS.CUSTOMERS.DELETE(customerId));
  },

  /**
   * Get customer orders
   */
  getCustomerOrders: async (customerId, params = {}) => {
    return await apiClient.get(API_ENDPOINTS.CUSTOMERS.ORDERS(customerId), {
      params,
    });
  },
};

export default customerService;
