/**
 * Messaging API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

export const messagingService = {
  /**
   * Get sent messages history
   */
  getMessages: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.MESSAGING.MESSAGES_LIST, { params });
  },

  /**
   * Get message details by ID
   */
  getMessageById: async (messageId) => {
    return await apiClient.get(API_ENDPOINTS.MESSAGING.MESSAGE_GET(messageId));
  },

  /**
   * Send bulk message campaign
   */
  sendBulkMessage: async (payload) => {
    return await apiClient.post(API_ENDPOINTS.MESSAGING.BULK_SEND, payload);
  },

  /**
   * Send single/direct message
   */
  sendMessage: async (payload) => {
    return await apiClient.post(API_ENDPOINTS.MESSAGING.MESSAGE_SEND, payload);
  },

  /**
   * Get message templates
   */
  getTemplates: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.MESSAGING.TEMPLATES, { params });
  },
};

export default messagingService;
