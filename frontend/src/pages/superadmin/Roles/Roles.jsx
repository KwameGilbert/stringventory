import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';
import { DEFAULT_ROLES } from '../../../constants/features';

export default function Roles() {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleCreateRole = () => {
    // TODO: Implement create role modal
    alert('Create role modal - coming soon!');
  };

  const getRoleStats = (roleId) => {
    // Mock stats - in real app, this would come from API
    const stats = {
      'business_admin': 284,
      'manager': 156,
      'sales': 432,
      'warehouse': 189,
      'accountant': 95,
      'viewer': 67
    };
    return stats[roleId] || 0;
  };

  const handleDeleteRole = (roleId) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Roles</h1>
          <p className="text-gray-600">Manage roles and permissions for business users</p>
        </div>
        <button
          onClick={handleCreateRole}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Users with Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(roles.reduce((acc, role) => {
                  acc[role.id] = getRoleStats(role.id);
                  return acc;
                }, {})).reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.isSystemRole).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  role.isSystemRole ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    role.isSystemRole ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  {role.isSystemRole && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full mt-1">
                      System
                    </span>
                  )}
                </div>
              </div>
              
              {!role.isSystemRole && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Edit Role"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{role.description}</p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Users</p>
                <p className="text-lg font-bold text-gray-900">{getRoleStats(role.id)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Permissions</p>
                <p className="text-lg font-bold text-gray-900">
                  {role.permissions[0] === '*' ? 'All' : role.permissions.length}
                </p>
              </div>
            </div>

            {/* View Permissions Button */}
            <button
              onClick={() => setSelectedRole(role)}
              className="w-full mt-4 px-4 py-2 border border-purple-200 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors"
            >
              View Permissions
            </button>
          </div>
        ))}
      </div>

      {/* Role Details Modal (simplified - would be a full modal in production) */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedRole.description}</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Permissions</h3>
              {selectedRole.permissions[0] === '*' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-900 font-medium">All Permissions</p>
                  <p className="text-purple-700 text-sm mt-1">
                    This role has access to all features and capabilities
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedRole.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {!selectedRole.isSystemRole && (
                <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  Edit Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
