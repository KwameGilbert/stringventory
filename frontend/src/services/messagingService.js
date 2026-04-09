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

  /**
   * Create a new message template
   */
  createTemplate: async (payload) => {
    return await apiClient.post(API_ENDPOINTS.MESSAGING.CREATE_TEMPLATE, payload);
  },

  /**
   * Update an existing message template
   */
  updateTemplate: async (templateId, payload) => {
    return await apiClient.put(`${API_ENDPOINTS.MESSAGING.TEMPLATES}/${templateId}`, payload);
  },

  /**
   * Delete a message template
   */
  deleteTemplate: async (templateId) => {
    return await apiClient.delete(`${API_ENDPOINTS.MESSAGING.TEMPLATES}/${templateId}`);
  },
};

export default messagingService;
