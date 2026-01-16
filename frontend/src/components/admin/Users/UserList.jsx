import { useState } from "react";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  User,
  Eye
} from "lucide-react";

export default function UserList({ users, onEdit, onDelete }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const getRoleIcon = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "super admin": return <ShieldAlert size={16} className="text-rose-600" />;
      case "admin": return <ShieldCheck size={16} className="text-emerald-600" />;
      case "manager": return <Shield size={16} className="text-blue-600" />;
      default: return <User size={16} className="text-gray-600" />;
    }
  };

  const getRoleBadge = (roleName) => {
    const styles = {
      "super admin": "bg-rose-100 text-rose-700 border-rose-200",
      "admin": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "manager": "bg-blue-100 text-blue-700 border-blue-200",
      "staff": "bg-gray-100 text-gray-700 border-gray-200"
    };
    return styles[roleName?.toLowerCase()] || styles["staff"];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={`${user.firstName} ${user.lastName}`} 
                      className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.roleName)}`}>
                    {getRoleIcon(user.roleName)}
                    {user.roleName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-gray-500"}`}></span>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.lastLoginAt ? (
                    <>
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                      <span className="text-xs text-gray-400 ml-1">
                        {new Date(user.lastLoginAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenu === user.id && (
                    <div className="absolute right-8 top-8 z-10 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                       <button
                        onClick={() => {
                          const win = window.open(`/dashboard/users/${user.id}`, '_self');
                          win.focus();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => {
                          onEdit(user);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          onDelete(user.id);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Deactivate
                      </button>
                    </div>
                  )}
                  {/* Backdrop to close menu */}
                  {activeMenu === user.id && (
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setActiveMenu(null)}
                    ></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
