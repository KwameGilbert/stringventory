
import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
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
} from "lucide-react";

const Sidebar = () => {
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



  const menuSections = [
    {
      id: "overview",
      label: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/" },
      ],
    },
    {
      id: "inventory",
      label: "Inventory Management",
      items: [
        { icon: FolderTree, label: "Categories", path: "/dashboard/categories" },
        { icon: Package, label: "Products", path: "/dashboard/products" },
        { icon: ClipboardList, label: "Inventory", path: "/dashboard/inventory" },
      ],
    },
    {
      id: "sales",
      label: "Sales & Orders",
      items: [
        { icon: ShoppingCart, label: "Orders", path: "/dashboard/orders" },
        { icon: Users, label: "Customers", path: "/dashboard/customers" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        { icon: DollarSign, label: "Expenses", path: "/dashboard/expenses" },
        { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
      ],
    },
    {
      id: "system",
      label: "System",
      items: [
        { icon: UserCog, label: "Users", path: "/dashboard/users" },
        { icon: MessageSquare, label: "Messaging", path: "/dashboard/messaging" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen ${themeColors.sidebarBg} border-r border-gray-800
        text-gray-400 transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
        <div
          className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div className={`${themeColors.bgPrimary} w-8 h-8 rounded-lg flex items-center justify-center shadow-lg`}>
            <Package className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-white">
              Stringventory
            </span>
          )}
        </div>

        {/* Toggle Button */}
        {/* Only show if sidebar is closed to re-open, or rely on a trigger elsewhere. 
            For now keeping inline toggle but minimal. */}
        <button
          onClick={toggleSidebar}
          className={`
            p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-500
            transition-all duration-300 transform
            ${!isOpen && "ml-auto"}
          `}
        >
           {isOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {menuSections.map((section) => {

            return (
              <div key={section.id}>
                {/* Section Header - Only show label if open */}
                 {isOpen && (
                    <div className="px-2 mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {section.label}
                        </p>
                    </div>
                 )}

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    // Exact match for dashboard, startsWith for others to handle sub-routes
                    const isActive = item.path === "/dashboard/" 
                        ? location.pathname === "/dashboard/"
                        : location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={index}
                        to={item.path}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200 group relative
                           ${
                            isActive
                              ? `${themeColors.activeMenuGradient} text-white shadow-lg`
                              : `${themeColors.menuHoverText} ${themeColors.menuHoverBg} text-gray-400`
                          }
                          ${!isOpen && "justify-center px-2"}
                        `}
                      >
                        <Icon
                          className={`w-[18px] h-[18px] flex-shrink-0 ${
                            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                          }`}
                        />

                        {isOpen && (
                          <span className="text-sm">
                            {item.label}
                          </span>
                        )}

                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                          <div className="
                            absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-200 whitespace-nowrap z-50
                          ">
                             {item.label}
                          </div>
                        )}
                        
                        {/* Active Indicator Strip (Optional styling choice) */}
                        {isActive && !isOpen && (
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${themeColors.bgPrimary} rounded-r-md`} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-4">
        <Link
          to="/dashboard/profile"
          className={`
          flex items-center gap-3 cursor-pointer
          ${themeColors.menuHoverBg} p-2 rounded-xl transition-all duration-200
          ${!isOpen && "justify-center"}
        `}
        >
            <img 
                src="https://ui-avatars.com/api/?name=Dibbendo&background=random" 
                alt="Profile" 
                className="w-9 h-9 rounded-full border-2 border-gray-700"
            />

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate">
                Dibbendo
              </p>
              <p className="text-xs text-gray-500 truncate">
                Admin
              </p>
            </div>
          )}
          
          {isOpen && <ChevronRight size={16} className="text-gray-500"/>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
