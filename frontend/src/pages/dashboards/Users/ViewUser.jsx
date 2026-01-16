import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Shield, 
  Clock, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  XCircle,
  ShieldCheck,
  ShieldAlert,
  User,
  Monitor,
  Laptop
} from "lucide-react";

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("permissions"); // permissions, sessions, history

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, rolePermsRes, permsRes, sessionsRes, historyRes] = await Promise.all([
          axios.get("/data/users.json"),
          axios.get("/data/roles.json"),
          axios.get("/data/role-permissions.json"),
          axios.get("/data/permissions.json"),
          axios.get("/data/auth-sessions.json"),
          axios.get("/data/login-attempts.json")
        ]);

        const currentUser = usersRes.data.find(u => u.id === id);
        const role = rolesRes.data.find(r => r.id === currentUser?.role_id);
        
        // Get Permissions
        const rolePermIds = rolePermsRes.data.find(rp => rp.roleId === currentUser?.role_id)?.permissionIds || [];
        const userPermissions = permsRes.data.filter(p => rolePermIds.includes(p.id));

        // Get Sessions
        const userSessions = sessionsRes.data.filter(s => s.userId === id);

        // Get History
        const userHistory = historyRes.data.filter(h => h.userId === id);

        setUser({ ...currentUser, roleName: role?.name || "Unknown", roleDesc: role?.description });
        setPermissions(userPermissions);
        setSessions(userSessions);
        setLoginHistory(userHistory);
      } catch (error) {
        console.error("Error fetching user details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/users")}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-500 text-sm">View and manage user access details</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <img 
                src={user.avatar} 
                alt={user.firstName} 
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white"
              />
              <div className="mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">{user.email}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    user.roleName === 'super admin' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    user.roleName === 'admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {user.roleName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {user.isActive ? "Active Account" : "Inactive Account"}
                </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <span>{user.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <span>Last Login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <span>MFA: {user.mfaEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="border-b border-gray-100 mb-6">
                <div className="flex gap-6">
                  {["permissions", "sessions", "history"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                        activeTab === tab 
                          ? "text-emerald-600" 
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

               {/* TAB CONTENT */}
              <div className="min-h-[200px]">
                {/* Permissions Tab */}
                {activeTab === "permissions" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Assigned Role: {user.roleName}</h4>
                      <p className="text-sm text-gray-500">{user.roleDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {permissions.map((perm) => (
                        <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                          <CheckCircle size={16} className="text-emerald-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                            <p className="text-xs text-gray-500">{perm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sessions Tab */}
                {activeTab === "sessions" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${session.isCurrent ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                             {session.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Laptop size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{session.device}</p>
                              {session.isCurrent && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Current</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{session.location} • {session.ipAddress}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Last active: {new Date(session.lastActive).toLocaleString()}</p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <button className="text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                    {sessions.length === 0 && <p className="text-gray-500 italic">No active sessions found.</p>}
                  </div>
                )}

                {/* Login History Tab */}
                {activeTab === "history" && (
                   <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                          <th className="pb-3 pl-2">Status</th>
                          <th className="pb-3">Date & Time</th>
                          <th className="pb-3">Device</th>
                          <th className="pb-3">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {loginHistory.map((login) => (
                          <tr key={login.id}>
                            <td className="py-3 pl-2">
                               <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                                login.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              }`}>
                                {login.status === "success" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                {login.status.charAt(0).toUpperCase() + login.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {new Date(login.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 text-sm text-gray-900 font-medium">
                              {login.device}
                            </td>
                            <td className="py-3 text-sm text-gray-500 font-mono">
                              {login.ipAddress}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loginHistory.length === 0 && <p className="text-gray-500 italic text-center py-4">No login history available.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
