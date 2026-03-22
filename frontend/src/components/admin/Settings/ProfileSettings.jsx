import { useState, useEffect, useContext } from "react";
import { User, Mail, Phone, MapPin, Globe, Camera, AlertCircle } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext";
import settingsService from "../../../services/settingsService";
import { showSuccess, showError } from "../../../utils/alerts";

export default function ProfileSettings() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load business settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await settingsService.getBusinessSettings();
        const settings = response?.data || response || {};
        
        setFormData({
          businessName: settings.businessName || settings.name || user?.businessName || "",
          email: settings.email || user?.email || "",
          phone: settings.phone || user?.phone || "",
          address: settings.address || "",
          website: settings.website || "",
          avatar: settings.avatar || settings.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.businessName || user?.businessName || "Business")}&background=10b981&color=fff`
        });
      } catch (err) {
        console.error("Failed to load business settings", err);
        setError(err?.message || "Failed to load settings");
        // Set fallback from auth context
        if (user) {
          setFormData(prev => ({
            ...prev,
            businessName: user.businessName || user.name || "",
            email: user.email || "",
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to process image", err);
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName?.trim()) {
      setError("Business name is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      await settingsService.updateBusinessSettings({
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
        avatar: formData.avatar.startsWith('data:') ? formData.avatar : undefined,
      });
      
      showSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err?.message || "Failed to update profile");
      showError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Business Profile</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <img 
                src={formData.avatar} 
                alt="Business Logo" 
                className="w-24 h-24 rounded-2xl shadow-md ring-4 ring-gray-50 object-cover"
              />
              <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900">Company Logo</h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload a logo to display on invoices and reports.<br/>
                Recommended size: 500x500px.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Business Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  disabled={saving}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
