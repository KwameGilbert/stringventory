
import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
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
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState(["overview"]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuSections = [
    {
      id: "overview",
      label: "Overview",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/", active: true },
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
        fixed left-0 top-0 h-screen ${themeColors.sidebarBg}
        text-white transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? "w-72" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-slate-700/50">
        <div
          className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div className={`${themeColors.logoGradient} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
            <Package className={`w-6 h-6 ${themeColors.logoIcon}`} />
          </div>
          {isOpen && (
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              WholeSys
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`
            p-2 rounded-lg border border-slate-600 hover:bg-slate-700 
            transition-all duration-300 hover:border-emerald-400
            ${!isOpen && "ml-auto"}
          `}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-4">
          {menuSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            
            return (
              <div key={section.id}>
                {/* Section Header */}
                {isOpen ? (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2 text-slate-400 
                             hover:text-white transition-colors group text-md font-medium"
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-1 bg-slate-700/50 rounded-full mx-2 my-3" />
                )}

                {/* Section Items */}
                <div
                  className={`space-y-1 overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? isExpanded
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                      : "max-h-96 opacity-100"
                  }`}
                >
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        className={`
                          flex items-center gap-4 px-4 py-3 rounded-xl
                          transition-all duration-300 group relative
                           ${
                            item.active
                              ? `${themeColors.activeMenuGradient} ${themeColors.activeMenuShadow}`
                              : `${themeColors.menuHoverBg} hover:translate-x-1`
                          }
                          ${!isOpen && "justify-center"}
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            item.active
                              ? "text-white"
                              : `text-slate-300 ${themeColors.menuHoverText}`
                          }`}
                        />

                        {isOpen && (
                          <span
                            className={`font-medium text-md ${
                              item.active ? "text-white" : "text-slate-200"
                            }`}
                          >
                            {item.label}
                          </span>
                        )}

                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                          <div
                            className="
                            absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-200 whitespace-nowrap shadow-xl
                            border border-slate-700 z-50
                          "
                          >
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                            <div
                              className="absolute right-full top-1/2 -translate-y-1/2 
                              border-8 border-transparent border-r-slate-800"
                            ></div>
                          </div>
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
      <div
        className={`
        border-t border-slate-700/50 p-4
        ${!isOpen && "flex justify-center"}
      `}
      >
        <Link
          to="/dashboard/profile"
          className={`
          flex items-center gap-3 cursor-pointer
          hover:bg-slate-700/50 p-2 rounded-xl transition-all duration-300
          ${!isOpen && "justify-center"}
        `}
        >
          <div className={`${themeColors.profileGradient} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-sm font-bold text-white">SA</span>
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Super Admin
              </p>
              <p className="text-xs text-slate-400 truncate">
                admin@wholesys.com
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
