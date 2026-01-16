import { useState } from "react";
import { DollarSign, Bell, AlertTriangle, Clock } from "lucide-react";
import { showSuccess } from "../../../utils/alerts";

export default function PreferenceSettings() {
  const [preferences, setPreferences] = useState({
    currency: "GHS",
    lowStockThreshold: 10,
    expiryAlertDays: 30,
    emailNotifications: true,
    dashboardRefresh: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showSuccess("Preferences updated successfully");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Localization */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            Localization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Default Currency</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white"
                >
                  <option value="GHS">Ghanaian Cedi (GHS)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Auto-Refresh Dashboard (Minutes)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.dashboardRefresh}
                  onChange={(e) => setPreferences({...preferences, dashboardRefresh: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Rules */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            Notification Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Low Stock Threshold (Units)</label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-2.5 text-amber-500" size={18} />
                <input
                  type="number"
                  min="1"
                  value={preferences.lowStockThreshold}
                  onChange={(e) => setPreferences({...preferences, lowStockThreshold: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500">Alert when product quantity falls below this number.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Expiry Alert Lead Time (Days)</label>
              <div className="relative">
                <Bell className="absolute left-3 top-2.5 text-rose-500" size={18} />
                <input
                  type="number"
                  min="1"
                  value={preferences.expiryAlertDays}
                  onChange={(e) => setPreferences({...preferences, expiryAlertDays: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500">Alert when product is expiring within these days.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="emailNotifs"
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" 
            />
            <label htmlFor="emailNotifs" className="text-sm text-gray-700 select-none">
              Receive daily summary via email
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
