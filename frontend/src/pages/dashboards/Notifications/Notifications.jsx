import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import notificationService from "../../../services/notificationService";
import { showError, showSuccess } from "../../../utils/alerts";

const normalizeNotification = (item) => ({
  id: item?.id,
  title: item?.title || "Notification",
  message: item?.message || "",
  type: (item?.type || "info").toLowerCase(),
  timestamp: item?.createdAt || item?.timestamp || new Date().toISOString(),
  read: Boolean(item?.isRead ?? item?.read),
  raw: item,
});

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const summary = await notificationService.getNotificationSummary();
      const nextNotifications = Array.isArray(summary?.notifications)
        ? summary.notifications.map(normalizeNotification)
        : [];
      setNotifications(nextNotifications);
    } catch (err) {
      const message = err?.message || "Failed to load notifications";
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === "unread") return !notification.read;
        return true;
      }),
    [notifications, filter]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    try {
      setActionLoading(true);
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      showError(err?.message || "Failed to mark notification as read");
    } finally {
      setActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showSuccess("All notifications marked as read");
    } catch (err) {
      showError(err?.message || "Failed to mark all notifications as read");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setActionLoading(true);
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      showError(err?.message || "Failed to delete notification");
    } finally {
      setActionLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setActionLoading(true);
      const deletions = await Promise.allSettled(
        notifications.map((n) => notificationService.deleteNotification(n.id))
      );
      const hasFailure = deletions.some((result) => result.status === "rejected");
      if (hasFailure) {
        showError("Some notifications could not be deleted");
      } else {
        showSuccess("All notifications cleared");
      }
      await loadNotifications();
    } catch (err) {
      showError(err?.message || "Failed to clear notifications");
    } finally {
      setActionLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
      case "order":
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "warning":
      case "stock":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "alert":
      case "error":
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
      case "payment":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

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

      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 bg-white border border-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
            <p className="text-gray-500 mt-1">We'll notify you when something important happens.</p>
            {filter === "unread" && notifications.length > 0 && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
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
              <div
                className={`
                shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${notification.read ? "bg-gray-100" : "bg-white shadow-sm ring-1 ring-emerald-100"}
              `}
              >
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          New
                        </span>
                      )}
                    </h3>
                    <p className={`mt-1 text-sm ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    disabled={actionLoading}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  disabled={actionLoading}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
