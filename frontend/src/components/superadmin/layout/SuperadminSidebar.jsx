import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  BarChart3,
  Settings,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

export default function SuperadminSidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/superadmin', icon: LayoutDashboard, exact: true },
    { name: 'Businesses', href: '/superadmin/businesses', icon: Building2 },
    { name: 'Pricing Plans', href: '/superadmin/pricing-plans', icon: CreditCard },
    { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
    { name: 'Messaging', href: '/superadmin/messaging', icon: MessageSquare },
    { name: 'Settings', href: '/superadmin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <Link to="/superadmin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text-purple">S</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">StringVentory</h1>
            <p className="text-purple-300 text-xs">Platform Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${active 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-purple-600' : ''}`} />
              <span className="font-medium flex-1">{item.name}</span>
              {active && (
                <ChevronRight className="w-4 h-4" />
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
