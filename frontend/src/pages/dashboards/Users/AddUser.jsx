import { useState } from "react";
import { User, Mail, Shield, CheckCircle, Phone, Lock, Save, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PERMISSION_GROUPS } from "../../../constants/permissions";
import { showSuccess } from "../../../utils/alerts";

export default function AddUser() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleName: "",
    permissions: [],
    isActive: true,
    mfaEnabled: false,
    password: ""
  });

  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (category) => {
    setExpandedGroups(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handlePermissionChange = (permissionKey) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey];
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleCategoryPermissions = (category, categoryPermissions) => {
    setFormData(prev => {
      const allSelected = categoryPermissions.every(p => prev.permissions.includes(p.key));
      let newPermissions = [...prev.permissions];
      if (allSelected) {
        newPermissions = newPermissions.filter(p => !categoryPermissions.some(cp => cp.key === p));
      } else {
        const missing = categoryPermissions.map(cp => cp.key).filter(key => !newPermissions.includes(key));
        newPermissions = [...newPermissions, ...missing];
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app: API call here
    console.log("Creating user:", formData);
    showSuccess("User created successfully");
    navigate("/dashboard/users");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/users")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-500 text-sm">Create a new system user and assign permissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "details"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-emerald-500 hover:border-emerald-200"
          }`}
        >
          User Details
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "permissions"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-emerald-500 hover:border-emerald-200"
          }`}
        >
          Permissions
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-left-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="john@example.com"
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
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role Title (Optional)</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Sales Manager"
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
            
            <div className="flex justify-end pt-4">
               <button
                  type="button"
                  onClick={() => setActiveTab("permissions")}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/20 transition-all"
               >
                  Next: Permissions
               </button>
            </div>
          </div>
        )}

        {/* PERMISSIONS TAB */}
        {activeTab === "permissions" && (
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-2">
              <div className="mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Assign Permissions</h3>
                 <p className="text-gray-500 text-sm">Select specific capabilities for this user</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERMISSION_GROUPS.map((group) => {
                      const selectedCount = group.permissions.filter(p => formData.permissions.includes(p.key)).length;
                      const allSelected = selectedCount === group.permissions.length;

                      return (
                          <div key={group.category} className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors">
                              <div className="bg-gray-50/50 p-3 flex justify-between items-center border-b border-gray-100">
                                  <span className="font-semibold text-gray-800 text-sm">{group.category}</span>
                                  <button
                                      type="button"
                                      onClick={() => toggleCategoryPermissions(group.category, group.permissions)}
                                      className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                                  >
                                      {allSelected ? "None" : "All"}
                                  </button>
                              </div>
                              <div className="p-3 grid grid-cols-2 gap-2">
                                  {group.permissions.map(perm => (
                                      <label key={perm.key} className="flex items-start gap-2 cursor-pointer p-1 rounded hover:bg-gray-50 text-sm">
                                          <input
                                              type="checkbox"
                                              className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                              checked={formData.permissions.includes(perm.key)}
                                              onChange={() => handlePermissionChange(perm.key)}
                                          />
                                          <span className="text-gray-600 leading-tight">{perm.label}</span>
                                      </label>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-6 gap-4">
                 <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                 >
                    Back to Details
                 </button>
                 <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/20 transition-all"
                 >
                    <Save size={18} />
                    Create User
                 </button>
              </div>
           </div>
        )}

      </form>
    </div>
  );
}
