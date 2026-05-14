import { useNavigate, Link } from "react-router-dom";
import { 
  Bell, 
  Check, 
  Clock, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";

const getIcon = (type) => {
  switch (type.toLowerCase()) {
    case "success":
    case "order":
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "warning":
    case "stock":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "alert":
    case "error":
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Info className="w-4 h-4 text-blue-500" />;
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

export default function NotificationDropdown({ 
  notifications = [], 
  onClose, 
  onMarkAsRead,
  unreadCount = 0 
}) {
  const navigate = useNavigate();

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      await onMarkAsRead(n.id);
    }
    
    onClose();

    // Smart Routing Logic
    const msg = n.message.toLowerCase();
    const title = n.title.toLowerCase();
    
    if (msg.includes('order') || title.includes('order')) {
      navigate('/dashboard/orders');
    } else if (msg.includes('stock') || msg.includes('inventory') || title.includes('stock')) {
      navigate('/dashboard/inventory');
    } else if (msg.includes('payment') || title.includes('payment')) {
      navigate('/dashboard/transactions');
    } else if (msg.includes('supplier')) {
      navigate('/dashboard/suppliers');
    } else if (msg.includes('customer')) {
      navigate('/dashboard/customers');
    } else {
      navigate('/dashboard/notifications');
    }
  };

  return (
    <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in duration-200">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h3>
        <Link 
          to="/dashboard/notifications" 
          onClick={onClose}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => handleNotificationClick(n)}
              className={`p-4 hover:bg-gray-50 transition-colors relative group cursor-pointer ${!n.read ? 'bg-emerald-50/20' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!n.read ? 'bg-white shadow-sm ring-1 ring-emerald-100' : 'bg-gray-100'}`}>
                  {getIcon(n.type || 'info')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 font-medium">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {formatTime(n.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
               <Bell className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-900">No new notifications</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">We'll alert you here when stuff happens.</p>
          </div>
        )}
      </div>

      <Link 
        to="/dashboard/notifications"
        onClick={onClose}
        className="block px-4 py-3 text-center text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-all border-t border-gray-100"
      >
        <div className="flex items-center justify-center gap-1">
          See full history
          <ChevronRight size={14} />
        </div>
      </Link>
    </div>
  );
}
