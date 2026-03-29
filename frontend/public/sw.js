/*
 * Service Worker for Push Notifications
 */

self.addEventListener('push', function(event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body || 'New update from Stringventory',
                icon: '/favicon.ico', // Update path if needed
                badge: '/badge.png',  // Optional small icon
                data: {
                    url: data.url || '/dashboard/notifications'
                },
                tag: data.tag || 'stringventory-update',
                renotify: true
            };

            event.waitUntil(
                self.registration.showNotification(data.title || 'Stringventory Alert', options)
            );
        } catch (e) {
            // Fallback for non-JSON push
            const options = {
                body: event.data.text() || 'New update from Stringventory',
                icon: '/favicon.ico'
            };
            event.waitUntil(
                self.registration.showNotification('Stringventory Alert', options)
            );
        }
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    const targetUrl = event.notification.data.url || '/dashboard/notifications';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
