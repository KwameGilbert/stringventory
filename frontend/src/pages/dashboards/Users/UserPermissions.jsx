import { useState, useEffect } from "react";
import { Save, ArrowLeft, Shield } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { PERMISSION_GROUPS } from "../../../constants/permissions";
import { showSuccess } from "../../../utils/alerts";

export default function UserPermissions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const usersRes = await axios.get("/data/users.json");
            const user = usersRes.data.find(u => u.id === parseInt(id) || u.id === id);
            
            if (user) {
                setPermissions(user.permissions || []);
                setUserName(`${user.firstName} ${user.lastName}`);
            }
        } catch (error) {
            console.error("Error fetching user", error);
        } finally {
            setLoading(false);
        }
    };
    
    if (id) fetchUser();
  }, [id]);

  const handlePermissionChange = (permissionKey) => {
    setPermissions(prev => {
        return prev.includes(permissionKey)
            ? prev.filter(p => p !== permissionKey)
            : [...prev, permissionKey];
    });
  };

  const toggleCategoryPermissions = (category, categoryPermissions) => {
      setPermissions(prev => {
          const allSelected = categoryPermissions.every(p => prev.includes(p.key));
          if (allSelected) {
              return prev.filter(p => !categoryPermissions.some(cp => cp.key === p));
          } else {
              const missing = categoryPermissions.map(cp => cp.key).filter(key => !prev.includes(key));
              return [...prev, ...missing];
          }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating permissions for", id, permissions);
    showSuccess("Permissions updated successfully");
    navigate("/dashboard/users");
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading permissions...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/dashboard/users")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Permissions</h1>
          <p className="text-gray-500 text-sm">Editing access controls for <span className="font-semibold text-emerald-600">{userName}</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERMISSION_GROUPS.map((group) => {
                    const selectedCount = group.permissions.filter(p => permissions.includes(p.key)).length;
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
                                            checked={permissions.includes(perm.key)}
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

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
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
                    Save Permissions
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
