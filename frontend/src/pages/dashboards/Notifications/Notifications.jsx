import { useState } from "react";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  Trash2, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Filter
} from "lucide-react";

// Mock Data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order #ORD-2024-001 has been placed by John Doe.",
    type: "success", // success, info, warning, alert
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    read: false,
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Product 'Wireless Mouse' is running low on stock (5 items remaining).",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 3,
    title: "System Update",
    message: "System maintenance is scheduled for tonight at 2:00 AM.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: 4,
    title: "Payment Failed",
    message: "Payment for Order #ORD-2024-055 failed. Please contact the customer.",
    type: "alert",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day 2 hours ago
    read: true,
  },
  {
    id: 5,
    title: "New User Registered",
    message: "A new user 'Sarah Smith' has verified their email.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Actions
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Helper: Get Icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // Helper: Format relative time
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            You have <span className="font-semibold text-emerald-600">{unreadCount}</span> unread notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            filter === "all"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
            filter === "unread"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                <p className="text-gray-500 mt-1">We'll notify you when something important happens.</p>
                {filter === 'unread' && notifications.length > 0 && (
                    <button onClick={() => setFilter('all')} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                        View all notifications
                    </button>
                )}
            </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200
                border border-gray-100 hover:shadow-md
                ${notification.read ? "bg-white" : "bg-emerald-50/50"}
              `}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${notification.read ? "bg-gray-100" : "bg-white shadow-sm ring-1 ring-emerald-100"}
              `}>
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          New
                        </span>
                      )}
                    </h3>
                    <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  {/* Time & Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(notification.timestamp)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                    <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Mark as read"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
