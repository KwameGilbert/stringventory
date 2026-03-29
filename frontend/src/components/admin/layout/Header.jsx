import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Search, ChevronDown, Calendar, Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardDateFilter } from "../../../contexts/DashboardDateFilterContext";
import { useNotifications } from "../../../contexts/NotificationContext";

const Header = ({ onMenuToggle, isSidebarExpanded }) => {
  const { themeColors } = useTheme();
  const [currency, setCurrency] = useState("GHS");
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { filter, setCustomRange } = useDashboardDateFilter();
  
  const notificationRef = useRef(null);
  const currencyRef = useRef(null);

  const currencies = ["GHS", "GBP", "USD", "EUR"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  return (
    <header className={`fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar - hidden on mobile, shown on sm+ */}
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                       text-gray-700 placeholder-gray-400 focus:outline-none 
                       ${themeColors.focusRing} focus:border-transparent transition-all`}
            />
          </div>
        </div>

        {/* Mobile search icon */}
        <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Currency Selector - hidden on small screens */}
          <div className="relative hidden md:block" ref={currencyRef}>
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 
                       rounded-lg hover:bg-gray-50 transition-all focus:outline-none 
                       ${themeColors.focusRing}`}
            >
              <span className="font-medium text-gray-700 text-sm">₵ {currency}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Currency Dropdown */}
            {showCurrencyDropdown && (
              <div
                className="absolute top-full mt-2 right-0 w-32 bg-white border border-gray-200 
                            rounded-lg shadow-lg overflow-hidden z-50 transform origin-top animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors
                              ${
                                curr === currency
                                  ? `${themeColors.selectionBg} ${themeColors.selectionText} font-medium`
                                  : "text-gray-700 font-medium"
                              }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range - hidden on mobile and tablets */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Start Date Picker */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setCustomRange(e.target.value, filter.endDate)}
                className={`pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg 
                         text-gray-700 focus:outline-none ${themeColors.focusRing} 
                         focus:border-transparent transition-all w-40 text-sm font-medium`}
              />
            </div>

            {/* Date Separator */}
            <span className="text-gray-400 font-medium text-sm">to</span>

            {/* End Date Picker */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="date"
                value={filter.endDate}
                min={filter.startDate}
                onChange={(e) => setCustomRange(filter.startDate, e.target.value)}
                className={`pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg 
                         text-gray-700 focus:outline-none ${themeColors.focusRing} 
                         focus:border-transparent transition-all w-40 text-sm font-medium`}
              />
            </div>
          </div>

          {/* Calendar Icon Button - shown on tablet/smaller desktop */}
          <button className="hidden md:block xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-all">
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all group focus:outline-none"
            >
              <Bell className={`w-5 h-5 transition-colors ${showNotificationDropdown ? 'text-emerald-600' : 'text-gray-600 group-hover:text-gray-900'}`} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white 
                               text-[10px] font-bold rounded-full flex items-center justify-center 
                               shadow-lg border-2 border-white"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <NotificationDropdown 
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={handleMarkAsRead}
                onClose={() => setShowNotificationDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
