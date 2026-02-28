import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../../services/userService";
import {
  ArrowLeft,
  Clock,
  Smartphone,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Laptop,
} from "lucide-react";

const toRoleLabel = (roleValue) => {
  if (!roleValue) return "User";
  const raw = String(roleValue).replace(/[_-]/g, " ").trim();
  return raw
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const extractUser = (response) => {
  const payload = response?.data || response || {};
  return payload?.user || payload?.data?.user || payload?.data || payload;
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient") || message.includes("forbidden");
};

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setAccessDenied(false);
        const userRes = await userService.getUserById(id);
        const currentUser = extractUser(userRes);

        if (!currentUser?.id) {
          setUser(null);
          setSessions([]);
          setLoginHistory([]);
          return;
        }

        const normalizedUser = {
          ...currentUser,
          roleName: toRoleLabel(currentUser?.roleName || currentUser?.role || currentUser?.role?.name),
          roleDesc: currentUser?.role?.description || currentUser?.roleDescription || "",
          isActive: currentUser?.isActive ?? currentUser?.status === "active",
          avatar:
            currentUser?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "User")}&background=random&color=fff`,
        };

        setUser(normalizedUser);
        setSessions(currentUser?.sessions || currentUser?.authSessions || []);
        setLoginHistory(currentUser?.loginHistory || currentUser?.loginAttempts || []);
      } catch (error) {
        console.error("Error fetching user details", error);
        if (isForbiddenError(error)) {
          setAccessDenied(true);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (accessDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Access denied</h2>
          <p className="text-sm text-gray-500">You do not have access to view user details.</p>
          <button
            onClick={() => navigate("/dashboard/users")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/users")}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-500 text-sm">View user account details</p>
        </div>
      </div>

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
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-100">
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
              <h3 className="font-semibold text-gray-900">Account Information</h3>
              <div className="space-y-3">
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
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Role:</span> {user.roleName}
                </div>
                {user.roleDesc && <p className="text-xs text-gray-500">{user.roleDesc}</p>}
              </div>
            </div>

            <div className="col-span-2">
              <div className="border-b border-gray-100 mb-6">
                <div className="flex gap-6">
                  {["sessions", "history"].map((tab) => (
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

              <div className="min-h-[200px]">
                {activeTab === "sessions" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${session.isCurrent ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                            {String(session.device || "").toLowerCase().includes("phone") ? <Smartphone size={20} /> : <Laptop size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{session.device || "Unknown device"}</p>
                              {session.isCurrent && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Current</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{session.location} • {session.ipAddress}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Last active: {session.lastActive ? new Date(session.lastActive).toLocaleString() : "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {sessions.length === 0 && <p className="text-gray-500 italic">No active sessions found.</p>}
                  </div>
                )}

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
                                {String(login.status || "unknown").charAt(0).toUpperCase() + String(login.status || "unknown").slice(1)}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {login.timestamp ? new Date(login.timestamp).toLocaleString() : "N/A"}
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
