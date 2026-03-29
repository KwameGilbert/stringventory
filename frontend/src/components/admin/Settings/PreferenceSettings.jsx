import { useState, useEffect } from "react";
import { Banknote, ChevronDown, Bell, AlertTriangle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useSettings } from "../../../contexts/SettingsContext";
import { showSuccess, showError } from "../../../utils/alerts";

export default function PreferenceSettings() {
  const { settings, updateSettings, loading: contextLoading } = useSettings();
  const [preferences, setPreferences] = useState({
    currency: "GHS",
    lowStockThreshold: 10,
    expiryAlertDays: 30,
    emailNotifications: true,
    dashboardRefresh: 5
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Sync local form state with context settings when they load
  useEffect(() => {
    if (settings) {
      setPreferences({
        currency: settings.currency || "GHS",
        lowStockThreshold: settings.lowStockThreshold || 10,
        expiryAlertDays: settings.expiryAlertDays || 30,
        emailNotifications: settings.emailNotifications !== false,
        dashboardRefresh: settings.dashboardRefresh || 5
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      
      await updateSettings({
        currency: preferences.currency,
        lowStockThreshold: parseInt(preferences.lowStockThreshold),
        expiryAlertDays: parseInt(preferences.expiryAlertDays),
        emailNotifications: preferences.emailNotifications,
        dashboardRefresh: parseInt(preferences.dashboardRefresh)
      });
      
      showSuccess("Preferences updated successfully");
    } catch (err) {
      console.error("Failed to update preferences", err);
      setError(err?.message || "Failed to update preferences");
      showError(err?.message || "Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Preferences</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}

      {contextLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-gray-500 text-sm animate-pulse">Loading system preferences...</p>
        </div>
      ) : (
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
                <Banknote className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                  disabled={saving}
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="GHS">Ghanaian Cedi (GHS)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
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
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={saving}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 disabled:cursor-not-allowed" 
            />
            <label htmlFor="emailNotifs" className="text-sm text-gray-700 select-none">
              Receive daily summary via email
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
