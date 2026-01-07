import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Search, ChevronDown, Calendar, Bell } from "lucide-react";

const Header = () => {
  const { themeColors } = useTheme();
  const [currency, setCurrency] = useState("GHS");
  const [startDate, setStartDate] = useState("2025-07-12");
  const [endDate, setEndDate] = useState("2026-01-06");
  const [notificationCount, _setNotificationCount] = useState(3);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies = ["GHS", "GBP", "USD", "EUR"];

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-40 ml-72">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
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

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                       rounded-lg hover:bg-gray-50 transition-all focus:outline-none 
                       ${themeColors.focusRing}`}
            >
              <span className="font-medium text-gray-700">₵ {currency}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Currency Dropdown */}
            {showCurrencyDropdown && (
              <div
                className="absolute top-full mt-2 right-0 w-32 bg-white border border-gray-200 
                            rounded-lg shadow-lg overflow-hidden z-50"
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
                                  : "text-gray-700"
                              }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Start Date Picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg 
                       text-gray-700 focus:outline-none ${themeColors.focusRing} 
                       focus:border-transparent transition-all w-40`}
            />
          </div>

          {/* Date Separator */}
          <span className="text-gray-400 font-medium">to</span>

          {/* End Date Picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg 
                       text-gray-700 focus:outline-none ${themeColors.focusRing} 
                       focus:border-transparent transition-all w-40`}
            />
          </div>

          {/* Calendar Icon Button (optional) */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <a href="/dashboard/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white 
                             text-xs font-bold rounded-full flex items-center justify-center 
                             shadow-lg"
              >
                {notificationCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
