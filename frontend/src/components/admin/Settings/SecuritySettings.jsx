import { useState } from "react";
import { Lock, Key, Smartphone, AlertTriangle } from "lucide-react";
import { showSuccess, showInfo } from "../../../utils/alerts";

export default function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Add error alert here if needed
      return;
    }
    showSuccess("Password updated successfully");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled);
    if (!mfaEnabled) {
      showInfo("Two-Factor Authentication Enabled");
    } else {
      showInfo("Two-Factor Authentication Disabled");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-emerald-600" />
          Change Password
        </h2>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* MFA Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Smartphone size={20} className="text-blue-600" />
              Two-Factor Authentication
            </h2>
            <p className="text-gray-500 text-sm max-w-xl">
              Add an extra layer of security to your account by requiring more than just a password to log in.
            </p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-emerald-500 transition-all duration-300 top-0 left-0" checked={mfaEnabled} onChange={handleMfaToggle}/>
            <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${mfaEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></label>
          </div>
        </div>

        {mfaEnabled && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-800 text-sm">
            <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
            <p>
              Two-factor authentication is currently active. You will be asked for a verification code sent to your registered phone number during login.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
