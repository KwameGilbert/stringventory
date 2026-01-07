import { useState } from "react";
import { Building2, DollarSign, Bell, Shield, Palette, Save } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function Settings() {
  const { theme, setTheme, availableThemes, themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState("business");

  // Business Profile State
  const [businessName, setBusinessName] = useState("WholeSys Distributors");
  const [businessEmail, setBusinessEmail] = useState("info@wholesys.com");
  const [phoneNumber, setPhoneNumber] = useState("+234 800 123 4567");
  const [address, setAddress] = useState("123 Commerce Road, Lagos");
  const [taxId, setTaxId] = useState("NG-123456789");
  const [taxRate, setTaxRate] = useState("7.5");

  // Currency State
  const [defaultCurrency, setDefaultCurrency] = useState("GHS");
  const [currencyPosition, setCurrencyPosition] = useState("before");

  // Notification State
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [expiryWindow, setExpiryWindow] = useState("30");

  const tabs = [
    { id: "business", label: "Business Profile", icon: Building2 },
    { id: "currency", label: "Currency", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "theme", label: "Theme", icon: Palette },
  ];

  const handleSave = () => {
    console.log("Saving settings...");
    // Add save logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure system preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Business Profile Tab */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID / VAT Number
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-3 ${themeColors.buttonGradient} text-white rounded-lg ${themeColors.buttonHover} transition-colors font-medium`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Currency Tab */}
          {activeTab === "currency" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="GHS">Ghanaian Cedi (₵)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Symbol Position
                  </label>
                  <select
                    value={currencyPosition}
                    onChange={(e) => setCurrencyPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="before">Before amount (₵1,000)</option>
                    <option value="after">After amount (1,000₵)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-3 ${themeColors.buttonGradient} text-white rounded-lg ${themeColors.buttonHover} transition-colors font-medium`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Rules</h2>
              
              <div className="space-y-4">
                {/* Low Stock Alerts */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get notified when products fall below reorder threshold
                    </p>
                  </div>
                  <button
                    onClick={() => setLowStockAlerts(!lowStockAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      lowStockAlerts ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        lowStockAlerts ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Expiry Alerts */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Expiry Alerts</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Get notified about products nearing expiry
                        </p>
                      </div>
                      <button
                        onClick={() => setExpiryAlerts(!expiryAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          expiryAlerts ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            expiryAlerts ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {expiryAlerts && (
                      <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alert me when products expire within
                        </label>
                        <select
                          value={expiryWindow}
                          onChange={(e) => setExpiryWindow(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-3 ${themeColors.buttonGradient} text-white rounded-lg ${themeColors.buttonHover} transition-colors font-medium`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Security settings coming soon...</p>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Color Theme</h2>
                <p className="text-gray-600">
                  Choose a color scheme for your dashboard. Changes apply instantly.
                </p>
              </div>

              {/* Theme Cards - Compact Design */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableThemes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`
                      relative p-4 rounded-xl transition-all duration-200
                      ${
                        theme === themeOption.id
                          ? "ring-2 ring-gray-900 ring-offset-2 shadow-lg"
                          : "hover:shadow-md border border-gray-200"
                      }
                    `}
                  >
                    {/* Color Swatches */}
                    <div className="space-y-2">
                      <div className={`w-full h-16 rounded-lg ${themeOption.bgPrimary}`}></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`h-8 rounded ${themeOption.bgSecondary}`}></div>
                        <div className={`h-8 rounded ${themeOption.bgTertiary}`}></div>
                      </div>
                    </div>

                    {/* Theme Name */}
                    <p className="mt-3 font-semibold text-gray-900 text-center">
                      {themeOption.name}
                    </p>

                    {/* Selected Indicator */}
                    {theme === themeOption.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end pt-4">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-3 ${themeColors.buttonGradient} text-white rounded-lg ${themeColors.buttonHover} transition-colors font-medium`}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
