import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext.js";
import { PERMISSIONS } from "../../../constants/permissions";
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
  ChevronDown,
  LogOut,
  Bell,
  Tag,
  FileText,
} from "lucide-react";

const Sidebar = () => {
  useTheme(); // Hook maintained for potential future use
  const { user, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/", permission: PERMISSIONS.VIEW_DASHBOARD },
    { icon: FolderTree, label: "Categories", path: "/dashboard/categories", permission: PERMISSIONS.VIEW_PRODUCTS }, // Assuming categories part of product management
    { icon: Package, label: "Products", path: "/dashboard/products", permission: PERMISSIONS.VIEW_PRODUCTS },
    { icon: FileText, label: "Purchases", path: "/dashboard/purchases", permission: PERMISSIONS.VIEW_PURCHASES },
    { icon: ClipboardList, label: "Stock Management", path: "/dashboard/inventory", permission: PERMISSIONS.VIEW_INVENTORY },
    { icon: ShoppingCart, label: "Orders", path: "/dashboard/orders", permission: PERMISSIONS.VIEW_ORDERS },
    { icon: Users, label: "Customers", path: "/dashboard/customers", permission: PERMISSIONS.VIEW_CUSTOMERS },
    { icon: Tag, label: "Expense Categories", path: "/dashboard/expenses/categories", permission: PERMISSIONS.VIEW_EXPENSES },
    { icon: DollarSign, label: "Expenses", path: "/dashboard/expenses", permission: PERMISSIONS.VIEW_EXPENSES },
    { icon: BarChart3, label: "Reports", path: "/dashboard/reports", permission: PERMISSIONS.VIEW_REPORTS },
    { icon: UserCog, label: "Users", path: "/dashboard/users", permission: PERMISSIONS.VIEW_USERS },
    { icon: MessageSquare, label: "Messaging", path: "/dashboard/messaging", permission: PERMISSIONS.VIEW_MESSAGING },
    { icon: Settings, label: "Settings", path: "/dashboard/settings", permission: PERMISSIONS.VIEW_SETTINGS },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-slate-900
        text-gray-300 transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          <div className="bg-emerald-500 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Stringventory
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg
            bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white
            transition-all duration-200
            ${!isOpen && "mx-auto"}
          `}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            
            // Calculate active state globally
            const matchingPaths = filteredMenuItems
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
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 font-medium" 
                      : "text-gray-400 hover:bg-slate-800/50 hover:text-white"
                  }
                  ${!isOpen && "justify-center px-2"}
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
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
                      border border-slate-700
                    "
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      {isOpen && (
        <div className="px-3 py-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Link to="/dashboard/notifications" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-all duration-200">
              <Bell className="w-4 h-4" />
              <span className="text-xs">Notifications</span>
            </Link>
            <Link to="/" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white hover:text-white transition-all duration-200">
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Logout</span>
            </Link>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-slate-800 p-3">
        <Link
          to="/dashboard/settings"
          className={`
            flex items-center gap-3 p-2.5 rounded-xl
            bg-slate-800/50 hover:bg-slate-800 transition-all duration-200
            ${!isOpen && "justify-center p-2"}
          `}
        >
          <div className="relative">
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

          {isOpen && <ChevronRight size={16} className="text-gray-500" />}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
