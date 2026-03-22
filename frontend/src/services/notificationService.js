/**
 * Notifications API Service
 */

import { apiClient, API_ENDPOINTS } from './api.client';

const getPayloadData = (response) => response?.data || response || {};

export const notificationService = {
  /**
   * Get all notifications
   * GET /v1/notifications
   */
  getNotifications: async (params = {}) => {
    return await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
  },

  /**
   * Get notifications list + counts in a consistent shape
   */
  getNotificationSummary: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
    const data = getPayloadData(response);

    return {
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      unreadCount: Number(data.unreadCount || 0),
      totalCount: Number(data.totalCount || 0),
      raw: response,
    };
  },

  /**
   * Mark one notification as read
   * POST /v1/notifications/:id/read
   */
  markAsRead: async (id) => {
    return await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
  },

  /**
   * Mark all notifications as read
   * POST /v1/notifications/read-all
   */
  markAllAsRead: async () => {
    return await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ);
  },

  /**
   * Delete one notification
   * DELETE /v1/notifications/:id
   */
  deleteNotification: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },
};

export default notificationService;
