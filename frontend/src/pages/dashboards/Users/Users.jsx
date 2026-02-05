import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserList from "../../../components/admin/Users/UserList";
import ActivityLogs from "../../../components/admin/Users/ActivityLogs";
import { showSuccess, confirmDelete } from "../../../utils/alerts";
import { PERMISSIONS } from "../../../constants/permissions";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, logsRes] = await Promise.all([
          axios.get("/data/users.json"),
          axios.get("/data/roles.json"),
          axios.get("/data/activity-logs.json")
        ]);
        
        const fetchedUsers = usersRes.data;
        const fetchedRoles = rolesRes.data;
        const fetchedLogs = logsRes.data;

        // Mock permission data assignment for existing users if missing
        const usersWithPermissions = fetchedUsers.map(user => {
             // Assign some default permissions based on their old role_id for demo purposes
             let defaultPerms = [];
             const role = fetchedRoles.find(r => r.id === user.role_id);
             if (role?.name === 'Administrator') defaultPerms = Object.keys(PERMISSIONS);
             if (role?.name === 'Sales') defaultPerms = ["VIEW_DASHBOARD", "VIEW_PRODUCTS", "VIEW_ORDERS"];

             return {
                 ...user,
                 roleName: role?.name || "User",
                 permissions: user.permissions || defaultPerms
             };
        });

        // Map user names to logs
        const mappedLogs = fetchedLogs.map(log => {
          const user = fetchedUsers.find(u => u.id === log.userId);
          return {
            ...log,
            userName: user ? `${user.firstName} ${user.lastName}` : "Unknown User"
          };
        });

        setUsers(usersWithPermissions);
        setRoles(fetchedRoles);
        setLogs(mappedLogs);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = () => {
    navigate("/dashboard/users/new");
  };

  const handleEditUser = (user) => {
    navigate(`/dashboard/users/${user.id}/edit`);
  };

  const handleDeleteUser = async (id) => {
    const result = await confirmDelete("this user");
    if (result.isConfirmed) {
      setUsers(users.map(u => u.id === id ? { ...u, isActive: false } : u));
      showSuccess("User deactivated successfully");
    }
  };



  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roleName.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

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
                  <option key={role.id} value={role.name}>{role.name}</option>
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
