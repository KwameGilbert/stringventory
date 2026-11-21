import { useState, useEffect } from 'react';
import { useAuth } from '../../../providers/AuthContext';
import superadminService from '../../../services/platform/superadminService';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Key, 
  Clock,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [activityLog, setActivityLog] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Platform Administrator',
    email: user?.email || '',
    phone: user?.phone || '',
    timezone: user?.timezone || 'Africa/Accra'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch activity log when Activity tab is opened
  useEffect(() => {
    if (activeTab === 'activity' && activityLog.length === 0) {
      fetchActivityLog();
    }
  }, [activeTab]);

  const fetchActivityLog = async () => {
    try {
      setLoadingActivity(true);
      const response = await superadminService.getActivityLog({ limit: 20 });
      const logs = response?.data || [];
      setActivityLog(Array.isArray(logs) ? logs : []);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      // No mock data fallback
      setActivityLog([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  const handleSave = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorMessage('Please enter a valid email address');
      return;
    }

    // Validate name
    if (!formData.name.trim()) {
      showErrorMessage('Name cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      const response = await superadminService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        timezone: formData.timezone
      });

      // Update auth context
      if (updateUser) {
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          timezone: formData.timezone
        });
      }

      setIsEditing(false);
      showSuccessMessage();
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorMessage(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      showErrorMessage('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      showErrorMessage('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showErrorMessage('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorMessage('Passwords do not match');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      showErrorMessage('New password must be different from current password');
      return;
    }

    try {
      setIsSaving(true);
      await superadminService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccessMessage();
    } catch (error) {
      console.error('Error changing password:', error);
      showErrorMessage(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorMessage('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorMessage('Please upload an image file');
      return;
    }

    try {
      setIsSaving(true);
      const formDataObj = new FormData();
      formDataObj.append('avatar', file);

      const response = await superadminService.uploadAvatar(formDataObj);
      
      if (updateUser) {
        updateUser({
          ...user,
          avatar: response?.data?.avatar || user.avatar
        });
      }

      showSuccessMessage();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showErrorMessage(error?.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings' },
    { id: 'security', label: 'Security' },
    { id: 'activity', label: 'Activity Log' }
  ];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5" />
          Changes saved successfully!
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top">
          <AlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=ffffff&color=0f172a&size=100`}
                alt={formData.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors cursor-pointer">
                <Camera className="w-4 h-4 text-slate-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-semibold">{formData.name}</h2>
              <p className="text-emerald-400 font-medium flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4" />
                {user?.role || 'Platform Administrator'}
              </p>
              <p className="text-slate-300 flex items-center gap-2 mt-1 text-sm">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Africa/Accra">Ghana (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-emerald-600" />
                  Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordData.newPassword && (
                      <p className="text-xs text-gray-500 mt-1">
                        {passwordData.newPassword.length < 8 ? '✗ Min 8 characters' : '✓ Strong password'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">Once you logout, you'll need to sign in again with your credentials.</p>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Recent Activity
              </h3>
              
              {loadingActivity ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <span className="ml-2 text-slate-600 font-medium">Loading activity...</span>
                </div>
              ) : activityLog && activityLog.length > 0 ? (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  {activityLog.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">IP: {activity.ip}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activity recorded yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
