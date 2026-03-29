import { useState, useEffect } from "react";
import { 
  User, Mail, Shield, Key, Loader2, 
  CheckCircle, AlertCircle, Save, Camera,
  Briefcase, Calendar, Hash, Globe, Phone,
  Eye, EyeOff
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import userService from "../../../services/userService";
import { showSuccess, showError, confirmAction } from "../../../utils/alerts";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfile = async () => {
    if (!authUser?.id) return;
    setLoading(true);
    try {
      const response = await userService.getUserById(authUser.id);
      const data = response?.data || response || {};
      const userData = data?.user || data || {};
      
      setProfileData(userData);
      setFormData({
        firstName: userData.firstName || userData.first_name || "",
        lastName: userData.lastName || userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || userData.phoneNumber || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      showError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser?.id]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateUser(authUser.id, formData);
      showSuccess("Your profile has been updated successfully.", "Profile Updated");
      // Optionally refresh auth state here if needed
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      showError(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    const confirmation = await confirmAction(
      "Change Password?",
      "Are you sure you want to update your password?",
      "Yes, change password"
    );

    if (!confirmation.isConfirmed) return;

    setSaving(true);
    try {
      await userService.resetPassword(authUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showSuccess("Your password has been changed.", "Security Updated");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error resetting password:", error);
      showError(error?.message || "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  const TABS = [
    { id: "general", label: "Account Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-40 w-full bg-linear-to-r from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
        </div>
        
        <div className="px-8 -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-end gap-6 pb-2">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-400">
               {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
            </div>
            <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-105 group-active:scale-95 border-2 border-white">
              <Camera size={20} />
            </button>
          </div>
          
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {profileData?.firstName} {profileData?.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100 uppercase tracking-tight">
                <Shield size={14} />
                {profileData?.role || 'Staff'}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Mail size={14} />
                {profileData?.email}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                profileData?.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {profileData?.isActive ? 'Active Plan' : 'Account Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  General Information
                </h3>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-500 bg-gray-50"
                      value={formData.email}
                      disabled
                    />
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <AlertCircle size={10} /> Contact administrator to change email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                      placeholder="+233 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Key size={18} className="text-gray-400" />
                  Security Settings
                </h3>
              </div>
              
              <form onSubmit={handlePasswordReset} className="p-8 space-y-6">
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-12"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-12"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-12"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
