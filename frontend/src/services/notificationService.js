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

    // Handle both { notifications: [], ... } and flat array []
    const notifications = Array.isArray(data.notifications) 
      ? data.notifications 
      : (Array.isArray(data) ? data : []);
      
    // If backend doesn't provide unreadCount, calculate it from the array
    const unreadCount = data.unreadCount !== undefined 
      ? Number(data.unreadCount) 
      : notifications.filter(n => !n.isRead && !n.read).length;

    return {
      notifications,
      unreadCount,
      totalCount: Number(data.totalCount || notifications.length),
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
