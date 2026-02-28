import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserList from "../../../components/admin/Users/UserList";
import ActivityLogs from "../../../components/admin/Users/ActivityLogs";
import { showSuccess, showError, confirmDelete } from "../../../utils/alerts";
import userService from "../../../services/userService";

const toRoleLabel = (roleValue) => {
  if (!roleValue) return "User";
  const raw = String(roleValue).replace(/[_-]/g, " ").trim();
  return raw
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const extractUsers = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.users)) return payload.data.users;

  return [];
};

const normalizeUser = (user) => {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const roleValue = user?.roleName || user?.role || user?.role?.name || "User";

  return {
    ...user,
    firstName,
    lastName,
    roleName: toRoleLabel(roleValue),
    isActive: user?.isActive ?? user?.status === "active",
    avatar:
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`.trim() || "User")}&background=random&color=fff`,
  };
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient permissions") || message.includes("forbidden");
};

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [logs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setPermissionDenied(false);
        const usersRes = await userService.getUsers();
        const fetchedUsers = extractUsers(usersRes).map(normalizeUser);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching user data", error);
        if (isForbiddenError(error)) {
          setPermissionDenied(true);
          return;
        }
        showError(error?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roles = Array.from(new Set(users.map((user) => user.roleName).filter(Boolean)));

  const handleAddUser = () => {
    navigate("/dashboard/users/new");
  };

  const handleEditUser = (user) => {
    navigate(`/dashboard/users/${user.id}/edit`);
  };

  const handleDeleteUser = async (id) => {
    const result = await confirmDelete("this user");
    if (result.isConfirmed) {
      try {
        await userService.deleteUser(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        showSuccess("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user", error);
        showError(error?.message || "Failed to delete user");
      }
    }
  };



  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          String(user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roleName.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading users...</div>;
  }

  if (permissionDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to view users. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-500 text-sm">Manage system access and team members</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <UserList 
            users={filteredUsers} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser} 
          />
        </div>

        <div className="lg:col-span-1">
          <ActivityLogs logs={logs} />
        </div>
      </div>

    </div>
  );
}
