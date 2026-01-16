import { useState } from "react";
import { X, User, Mail, Shield, CheckCircle, Phone, ShieldCheck, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { PERMISSION_GROUPS, PERMISSIONS } from "../../../constants/permissions";

export default function UserForm({ user, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    // Initialize state from props to avoid cascading renders
    if (user) {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        // role_id: user.role_id, // DEPRECATED: Using direct permissions
        roleName: user.roleName || "", // Optional display name for role template
        permissions: user.permissions || [],
        isActive: user.isActive,
        mfaEnabled: user.mfaEnabled || false,
        password: ""
      };
    }
    // Default state for new user
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      // role_id: "",
      roleName: "",
      permissions: [],
      isActive: true,
      mfaEnabled: false,
      password: ""
    };
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
              // Deselect all
              newPermissions = newPermissions.filter(p => !categoryPermissions.some(cp => cp.key === p));
          } else {
              // Select all
              const missing = categoryPermissions
                  .map(cp => cp.key)
                  .filter(key => !newPermissions.includes(key));
              newPermissions = [...newPermissions, ...missing];
          }
          return { ...prev, permissions: newPermissions };
      });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                  placeholder="John"
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
                  placeholder="Doe"
                />
              </div>
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
                placeholder="john@example.com"
              />
            </div>
          </div>

          {!user && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
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
          )}

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

          <div className="grid grid-cols-2 gap-4">
             {/* Role & Status (Existing) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role Title (Optional)</label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.roleName || ""}
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
          </div>

          {/* Permissions Section */}
          <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600"/>
                  Permissions
              </h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {PERMISSION_GROUPS.map((group) => {
                      const isExpanded = expandedGroups[group.category];
                      const selectedCount = group.permissions.filter(p => formData.permissions.includes(p.key)).length;
                      const allSelected = selectedCount === group.permissions.length;

                      return (
                          <div key={group.category} className="border-b border-gray-100 last:border-0">
                              <div 
                                  className="flex items-center justify-between p-3 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => toggleGroup(group.category)}
                              >
                                  <div className="flex items-center gap-2">
                                      {isExpanded ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400"/>}
                                      <span className="text-sm font-medium text-gray-700">{group.category}</span>
                                      {selectedCount > 0 && (
                                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                              {selectedCount}/{group.permissions.length}
                                          </span>
                                      )}
                                  </div>
                                  <button
                                      type="button"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCategoryPermissions(group.category, group.permissions);
                                      }}
                                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                  >
                                      {allSelected ? "Deselect All" : "Select All"}
                                  </button>
                              </div>
                              
                              {isExpanded && (
                                  <div className="p-3 grid grid-cols-2 gap-2 bg-white animate-in slide-in-from-top-2">
                                      {group.permissions.map(perm => (
                                          <label key={perm.key} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded text-sm">
                                              <input
                                                  type="checkbox"
                                                  checked={formData.permissions.includes(perm.key)}
                                                  onChange={() => handlePermissionChange(perm.key)}
                                                  className="rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                              />
                                              <span className="text-gray-600">{perm.label}</span>
                                          </label>
                                      ))}
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* MFA Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
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

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              {user ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
