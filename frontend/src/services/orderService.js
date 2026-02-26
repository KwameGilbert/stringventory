/**
 * Order Management API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const orderService = {
  /**
   * Get all orders
   */
  getOrders: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.ORDERS.LIST, { params });
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId) => {
    return await apiClient.get(API_ENDPOINTS.ORDERS.GET(orderId));
  },

  /**
   * Create new order
   */
  createOrder: async (orderData) => {
    return await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  },

  /**
   * Update order
   */
  updateOrder: async (orderId, orderData) => {
    return await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), orderData);
  },

  /**
   * Delete order
   */
  deleteOrder: async (orderId) => {
    return await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(orderId));
  },

  /**
   * Create refund for order
   */
  createRefund: async (orderId, refundData) => {
    return await apiClient.post(API_ENDPOINTS.ORDERS.CREATE_REFUND(orderId), refundData);
  },
};

export default orderService;
