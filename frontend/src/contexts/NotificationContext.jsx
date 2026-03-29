import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthProvider';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadNotifications = useCallback(async (quiet = false) => {
        if (!user) return;
        if (!quiet) setLoading(true);
        try {
            const summary = await notificationService.getNotificationSummary({ limit: 10 });
            
            // Check for new notifications to trigger browser push
            if (notifications.length > 0) {
                const latestOldId = notifications[0].id;
                const newItems = summary.notifications.filter(n => !n.isRead && n.id > latestOldId);
                
                if (newItems.length > 0 && Notification.permission === 'granted') {
                    newItems.forEach(item => {
                        new Notification(item.title || 'New Notification', {
                            body: item.message,
                            icon: '/favicon.ico' // Ensure this exists or use a generic icon
                        });
                    });
                }
            }

            setNotifications(summary.notifications.map(item => ({
                id: item?.id,
                title: item?.title || "Notification",
                message: item?.message || "",
                type: (item?.type || "info").toLowerCase(),
                timestamp: item?.createdAt || item?.timestamp || new Date().toISOString(),
                read: Boolean(item?.isRead ?? item?.read),
                raw: item
            })));
            setUnreadCount(summary.unreadCount);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            if (!quiet) setLoading(false);
        }
    }, [user, notifications]);

    useEffect(() => {
        if (user) {
            loadNotifications();
            const interval = setInterval(() => loadNotifications(true), 60000);
            
            // Request notification permission
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }

            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, loadNotifications]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            // Reload to get correct unread count in case the deleted one was unread
            loadNotifications(true);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            loadNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
