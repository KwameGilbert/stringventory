import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

    const loadNotifications = useCallback(async (quiet = false) => {
        if (!user) return;
        if (!quiet) setLoading(true);
        try {
            const summary = await notificationService.getNotificationSummary({ limit: 10 });
            const newFetchedItems = summary.notifications || [];
            
            setNotifications(prev => {
                // Check for new notifications to trigger browser push
                if (prev.length > 0) {
                    const latestOldId = prev[0]?.id || 0;
                    const newItems = newFetchedItems.filter(n => !n.isRead && n.id > latestOldId);
                    
                    if (newItems.length > 0 && notificationPermission === 'granted') {
                        newItems.forEach(item => {
                            new Notification(item.title || 'New Notification', {
                                body: item.message,
                                icon: '/favicon.ico'
                            });
                        });
                    }
                }

                return newFetchedItems.map(item => ({
                    id: item?.id,
                    title: item?.title || "Notification",
                    message: item?.message || "",
                    type: (item?.type || "info").toLowerCase(),
                    timestamp: item?.createdAt || item?.timestamp || new Date().toISOString(),
                    read: Boolean(item?.isRead ?? item?.read),
                    raw: item
                }));
            });
            
            setUnreadCount(summary.unreadCount || 0);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            if (!quiet) setLoading(false);
        }
    }, [user, notificationPermission]);

    useEffect(() => {
        if (user) {
            loadNotifications();
            const interval = setInterval(() => loadNotifications(true), 60000);
            
            // Update permission status
            setNotificationPermission(Notification.permission);
            
            // Automatically try to enable desktop alerts on login
            if (Notification.permission === 'default' || Notification.permission === 'granted') {
                subscribeToPush();
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

    const deleteAllNotifications = async () => {
        try {
            await notificationService.deleteAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to delete all notifications:", err);
        }
    };

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            
            if (permission !== 'granted') return false;

            const registration = await navigator.serviceWorker.ready;
            const publicVapidKey = 'BL3JrSg6sjq0qLorIElteJUHrhM5DqO_rico2_s0tHvIj20YS48G_G9XsPAARCTVn3wRRlsSa3cH6p85Dc2wB0E'; 
            
            // Proactively unsubscribe existing registration to avoid "applicationServerKey mismatched" errors
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                await existingSubscription.unsubscribe();
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey
            });

            // Send subscription to backend
            // await apiClient.post('/v1/notifications/subscribe', subscription);
            console.log('User is subscribed:', subscription);
            
            return true;
        } catch (err) {
            console.error('Failed to subscribe the user: ', err);
            return false;
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            notificationPermission,
            loadNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            deleteAllNotifications,
            subscribeToPush
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
