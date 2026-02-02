import { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  UserPlus,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Settings,
  X
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'signup',
    title: 'New Business Signup',
    message: 'TechStart Solutions has registered for a free trial.',
    time: '5 minutes ago',
    read: false,
    icon: UserPlus,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: 'Acme Innovations paid $499 for Enterprise plan.',
    time: '23 minutes ago',
    read: false,
    icon: CreditCard,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 3,
    type: 'upgrade',
    title: 'Plan Upgrade',
    message: 'Global Retail Co. upgraded from Professional to Enterprise.',
    time: '1 hour ago',
    read: false,
    icon: TrendingUp,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    id: 4,
    type: 'system',
    title: 'System Alert',
    message: 'Database backup completed successfully.',
    time: '2 hours ago',
    read: true,
    icon: Settings,
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Payment Failed',
    message: 'SmallBiz Store payment failed. Retry scheduled.',
    time: '3 hours ago',
    read: true,
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 6,
    type: 'signup',
    title: 'New Business Signup',
    message: 'Digital Ventures has registered for a free trial.',
    time: '5 hours ago',
    read: true,
    icon: UserPlus,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    id: 7,
    type: 'payment',
    title: 'Payment Received',
    message: 'Enterprise Corp paid $149 for Professional plan.',
    time: '1 day ago',
    read: true,
    icon: CreditCard,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'signup', label: 'Signups', count: notifications.filter(n => n.type === 'signup').length },
    { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system' || n.type === 'alert').length }
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'system') return n.type === 'system' || n.type === 'alert';
    return n.type === activeTab;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'all' 
                ? "You're all caught up! Check back later."
                : `No ${activeTab} notifications to show.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map(notification => {
              const Icon = notification.icon;
              return (
                <div 
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.bgColor}`}>
                    <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-1">
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
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
