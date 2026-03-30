import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import authService from "../../services/authService";
import { showError, showSuccess } from "../../utils/alerts";

export default function ForcePasswordChange() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
        showError("Password must be at least 8 characters long");
        return;
    }

    setIsLoading(true);

    try {
      // We assume the authService has a method or we use a custom endpoint
      // Given the user hasn't specified the endpoint, I'll use a generic profile update or password update endpoint
      await authService.updatePassword({
          userId: user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
      showSuccess("Password changed successfully!");
      
      // Clear the mustChangePassword flag in local storage and state if possible
      // But usually, it's better to just logout and ask them to login with new password 
      // OR if the backend clears it, the user can proceed.
      // For now, let's logout to be safe and ensure the session is fresh.
      setTimeout(() => {
          logout();
      }, 3000);

    } catch (error) {
      console.error("Password change failed", error);
      showError(error?.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-emerald-50 to-teal-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password Updated!</h2>
          <p className="text-gray-600">
            Your password has been changed successfully. For security reasons, you will be logged out now. Please sign in with your new password.
          </p>
          <div className="pt-4">
             <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to login...
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-emerald-50 to-teal-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                 <path d="M0,0 L100,0 L100,100 Z" fill="white" />
              </svg>
           </div>
           <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">First Time Sign In</h2>
              <p className="text-emerald-100 text-sm mt-2">
                For your security, you are required to change your password before continuing.
              </p>
           </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter temporary password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePassword("current")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "confirm"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Change Password & Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
