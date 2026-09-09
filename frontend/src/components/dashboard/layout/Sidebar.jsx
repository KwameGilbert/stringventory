import { useTheme } from "../../../providers/ThemeContext";
import { useSettings } from "../../../providers/SettingsContext";
import { useAuth } from "../../../providers/AuthContext.js";
import { getRoleMenuItems } from "../../../utils/accessControl";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ClipboardList,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  UserCog,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Tag,
  FileText,
  Truck,
  RotateCcw,
  Landmark,
  Activity,
  X,
} from "lucide-react";

const Sidebar = ({ mobileOpen, onClose, isOpen, onToggle }) => {
  useTheme(); // Hook maintained for potential future use
  const { user } = useAuth();
  const { businessInfo } = useSettings();
  const location = useLocation();

  const toggleSidebar = () => {
    if (onToggle) onToggle();
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    if (onClose) {
      onClose();
    }
  };

  const menuGroups = [
    {
      title: "Overview",
      items: [
        { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/" },
      ],
    },
    {
      title: "Inventory & Catalog",
      items: [
        { key: "inventory", icon: ClipboardList, label: "Inventory", path: "/dashboard/inventory" },
        { key: "products", icon: Package, label: "Products", path: "/dashboard/products" },
        { key: "categories", icon: FolderTree, label: "Categories", path: "/dashboard/categories" },
        { key: "suppliers", icon: Truck, label: "Suppliers", path: "/dashboard/suppliers" },
      ],
    },
    {
      title: "Sales & Finances",
      items: [
        { key: "sales", icon: ShoppingCart, label: "Sales", path: "/dashboard/orders" },
        { key: "purchases", icon: FileText, label: "Purchases", path: "/dashboard/purchases" },
        { key: "transactions", icon: Landmark, label: "Transactions", path: "/dashboard/transactions" },
        { key: "refunds", icon: RotateCcw, label: "Refunds", path: "/dashboard/refunds" },
        { key: "expenses", icon: DollarSign, label: "Expenses", path: "/dashboard/expenses" },
        { key: "expense-categories", icon: Tag, label: "Expense Categories", path: "/dashboard/expenses/categories" },
      ],
    },
    {
      title: "Relationships",
      items: [
        { key: "customers", icon: Users, label: "Customers", path: "/dashboard/customers" },
        { key: "messaging", icon: MessageSquare, label: "Messaging", path: "/dashboard/messaging" },
      ],
    },
    {
      title: "Administration",
      items: [
        { key: "reports", icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
        { key: "activity-logs", icon: Activity, label: "Activity Logs", path: "/dashboard/activity-logs" },
        { key: "users", icon: UserCog, label: "Users", path: "/dashboard/users" },
        { key: "notifications", icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
        { key: "settings", icon: Settings, label: "Settings", path: "/dashboard/settings" },
      ],
    },
  ];

  const allowedMenuKeys = getRoleMenuItems(user?.role || user?.normalizedRole);

  // Flatten all allowed items to compute active route matching correctly
  const allAllowedItems = menuGroups
    .flatMap((group) => group.items)
    .filter((item) => allowedMenuKeys.includes(item.key));

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-slate-900
        text-gray-300 transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? "w-[17rem]" : "w-24"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-100"
          }`}
        >
          {businessInfo?.logo ? (
            <img 
              src={businessInfo.logo} 
              alt="Logo" 
              className={`w-8 h-8 rounded-sm shadow-lg object-cover bg-white ${!isOpen && "mx-auto"}`} 
            />
          ) : (
            <div className={`bg-emerald-500 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 ${!isOpen && "mx-auto"}`}>
              <Package className="w-5 h-5 text-white" />
            </div>
          )}
          
          {isOpen && (
            <span className="text-lg font-bold text-white tracking-tight truncate max-w-[140px]">
              {businessInfo?.name || "PinnexVentures"}
            </span>
          )}
        </div>

        {/* Toggle Button - hidden on mobile */}
        <button
          onClick={toggleSidebar}
          className={`
            hidden lg:flex w-8 h-8 items-center justify-center rounded-lg
            bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white
            transition-all duration-200
            ${!isOpen && "mx-auto"}
          `}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 min-h-0 px-3 py-2 overflow-y-auto custom-scrollbar space-y-4">
        {menuGroups.map((group, groupIdx) => {
          const groupItems = group.items.filter((item) => allowedMenuKeys.includes(item.key));
          if (groupItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {isOpen && (
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </p>
              )}
              {groupItems.map((item, index) => {
                const Icon = item.icon;
                
                const matchingPaths = allAllowedItems
                  .filter(i => 
                    (i.path === "/dashboard/" && location.pathname === "/dashboard/") ||
                    (i.path !== "/dashboard/" && location.pathname.startsWith(i.path))
                  )
                  .map(i => i.path);
                
                const bestMatch = matchingPaths.sort((a, b) => b.length - a.length)[0];
                const isActive = item.path === bestMatch;

                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200 group relative
                      ${
                        isActive
                          ? "bg-slate-800 text-emerald-400 font-bold shadow-xs" 
                          : "text-gray-400 hover:bg-slate-800/50 hover:text-white font-medium"
                      }
                      ${!isOpen && "justify-center px-2"}
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400"
                      }`}
                    />

                    {isOpen && (
                      <span className="text-sm">{item.label}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div
                        className="
                          absolute left-14 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transition-all duration-200 whitespace-nowrap z-50 shadow-xl
                          border border-slate-700 font-semibold
                        "
                      >
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {isOpen && (
        <div className="px-3 py-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Link 
              to="/dashboard/notifications" 
              onClick={handleNavClick}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs">Notifications</span>
            </Link>
            <Link 
              to="/" 
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white hover:text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Logout</span>
            </Link>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-slate-800 p-3">
        <Link
          to="/dashboard/profile"
          onClick={handleNavClick}
          className={`
            flex items-center gap-3 p-2.5 rounded-xl
            bg-slate-800/50 hover:bg-slate-800 transition-all duration-200
            ${!isOpen && "justify-center p-2"}
          `}
        >
          <div className="relative shrink-0">
            <img
              src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
              alt="Profile"
              className="w-9 h-9 rounded-full ring-2 ring-slate-700"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role || "Member"}
              </p>
            </div>
          )}

          {isOpen && <ChevronRight size={16} className="text-gray-500 shrink-0" />}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
