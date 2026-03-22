import { useState } from "react";
import { Lock, Key, Smartphone, AlertTriangle, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import settingsService from "../../../services/settingsService";
import { showSuccess, showError } from "../../../utils/alerts";

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("One special character (!@#$%^&*)");
  return errors;
};

export default function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaPhone, setMfaPhone] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState("");

  const handlePasswordChange = (value, field) => {
    setPasswordData({...passwordData, [field]: value});
    setPasswordError("");
    
    if (field === "newPassword" && value) {
      const errors = validatePassword(value);
      setPasswordStrength({
        errors,
        strength: errors.length === 0 ? "strong" : errors.length <= 2 ? "medium" : "weak"
      });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate current password
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    // Validate new password
    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      setPasswordError(`Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    // Check confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Can't be same as current
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      setPasswordSaving(true);
      await settingsService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showSuccess("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength({});
    } catch (err) {
      console.error("Failed to update password", err);
      const errorMsg = err?.message || "Failed to update password";
      setPasswordError(errorMsg);
      showError(errorMsg);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleMfaToggle = async () => {
    if (mfaEnabled) {
      // Disable MFA
      try {
        setMfaLoading(true);
        setMfaError("");
        await settingsService.disableMFA();
        setMfaEnabled(false);
        showSuccess("Two-Factor Authentication disabled");
      } catch (err) {
        console.error("Failed to disable MFA", err);
        setMfaError(err?.message || "Failed to disable MFA");
        showError(err?.message || "Failed to disable MFA");
      } finally {
        setMfaLoading(false);
      }
    } else {
      // Enable MFA - requires phone number
      if (!mfaPhone.trim()) {
        setMfaError("Phone number is required");
        return;
      }

      try {
        setMfaLoading(true);
        setMfaError("");
        await settingsService.enableMFA(mfaPhone);
        setMfaEnabled(true);
        showSuccess("Two-Factor Authentication enabled");
      } catch (err) {
        console.error("Failed to enable MFA", err);
        setMfaError(err?.message || "Failed to enable MFA");
        showError(err?.message || "Failed to enable MFA");
      } finally {
        setMfaLoading(false);
      }
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
        
        {passwordError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
            <p>{passwordError}</p>
          </div>
        )}
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange(e.target.value, "currentPassword")}
                disabled={passwordSaving}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={passwordSaving}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange(e.target.value, "newPassword")}
                disabled={passwordSaving}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={passwordSaving}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {passwordData.newPassword && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    passwordStrength.strength === "strong" ? "bg-emerald-100 text-emerald-700" :
                    passwordStrength.strength === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    <CheckCircle size={14} />
                    Strength: {passwordStrength.strength || "checking"}
                  </span>
                </div>
                {passwordStrength.errors?.length > 0 && (
                  <p className="text-blue-700 text-xs">Missing: {passwordStrength.errors.join(", ")}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange(e.target.value, "confirmPassword")}
                disabled={passwordSaving}
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={passwordSaving}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordSaving || !passwordData.currentPassword || !passwordData.newPassword}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
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
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-emerald-500 transition-all duration-300 top-0 left-0 disabled:cursor-not-allowed"
              checked={mfaEnabled}
              onChange={handleMfaToggle}
              disabled={mfaLoading}
            />
            <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${mfaEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></label>
          </div>
        </div>

        {mfaError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
            <p>{mfaError}</p>
          </div>
        )}

        {!mfaEnabled && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number for Verification</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="tel"
                  placeholder="+233 24 567 8900"
                  value={mfaPhone}
                  onChange={(e) => setMfaPhone(e.target.value)}
                  disabled={mfaLoading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500">Verification codes will be sent to this number</p>
            </div>
          </div>
        )}

        {mfaEnabled && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3 text-emerald-800 text-sm">
            <CheckCircle className="flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium">Two-Factor Authentication is active</p>
              <p>You will be asked for a verification code sent to {mfaPhone || "your registered phone number"} during login.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
