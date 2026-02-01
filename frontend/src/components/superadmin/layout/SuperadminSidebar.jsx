import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  BarChart3,
  Settings,
  ChevronRight,
  MessageSquare,
  X
} from 'lucide-react';

export default function SuperadminSidebar({ onClose }) {
  const location = useLocation();

  // Mock unread messages count - in production, this would come from a context or API
  const unreadMessages = 3;

  const navigation = [
    { name: 'Dashboard', href: '/superadmin', icon: LayoutDashboard, exact: true },
    { name: 'Businesses', href: '/superadmin/businesses', icon: Building2 },
    { name: 'Pricing Plans', href: '/superadmin/pricing-plans', icon: CreditCard },
    { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
    { name: 'Messaging', href: '/superadmin/messaging', icon: MessageSquare, badge: unreadMessages },
    { name: 'Settings', href: '/superadmin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 min-h-screen flex flex-col">
      {/* Logo with close button for mobile */}
      <div className="p-4 sm:p-6 border-b border-purple-700">
        <div className="flex items-center justify-between">
          <Link to="/superadmin" className="flex items-center gap-3" onClick={handleNavClick}>
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold gradient-text-purple">S</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">StringVentory</h1>
              <p className="text-purple-300 text-xs">Platform Admin</p>
            </div>
          </Link>
          {/* Close button - only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-purple-200 hover:text-white hover:bg-purple-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all group relative
                ${active 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-purple-600' : ''}`} />
              <span className="font-medium flex-1">{item.name}</span>
              {/* Notification Badge */}
              {item.badge && item.badge > 0 && !active && (
                <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
              {active && (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-700">
        <div className="text-xs text-purple-300 text-center">
          Platform v1.0.0
        </div>
      </div>
    </div>
  );
}
