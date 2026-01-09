import { useState } from "react";
import { User, Lock, Settings as SettingsIcon } from "lucide-react";
import ProfileSettings from "../../../components/admin/Settings/ProfileSettings";
import SecuritySettings from "../../../components/admin/Settings/SecuritySettings";
import PreferenceSettings from "../../../components/admin/Settings/PreferenceSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
  ];

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account and system configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} className={activeTab === tab.id ? "text-emerald-600" : "text-gray-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "preferences" && <PreferenceSettings />}
        </div>
      </div>
    </div>
  );
}
