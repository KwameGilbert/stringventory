import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, Phone, Save, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showSuccess } from "../../../utils/alerts";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleName: "",
    isActive: true,
    mfaEnabled: false,
    permissions: [] // Kept for state consistency, though not edited here
  });

  useEffect(() => {
    // Determine source
    const fetchUser = async () => {
        try {
            // Mock fetching from local "database" or JSON
            // For now, we will try to find in the local cache or default to dummy if not found
            // In real app, this is an API call: await axios.get(`/api/users/${id}`)
            
            // Simulating fetch
            const usersRes = await axios.get("/data/users.json");
            const user = usersRes.data.find(u => u.id === parseInt(id) || u.id === id);
            
            if (user) {
                setFormData({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || "",
                    roleName: user.roleName || user.role || "",
                    isActive: user.isActive !== false, // default true
                    mfaEnabled: user.mfaEnabled || false,
                    permissions: user.permissions || []
                });
            }
        } catch (error) {
            console.error("Error fetching user", error);
        } finally {
            setLoading(false);
        }
    };
    
    if (id) fetchUser();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user:", id, formData);
    showSuccess("User updated successfully");
    navigate("/dashboard/users");
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading user data...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/users")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User Profile</h1>
          <p className="text-gray-500 text-sm">Update personal information</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role Title</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.mfaEnabled} 
                      onChange={(e) => setFormData({...formData, mfaEnabled: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/users")}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
