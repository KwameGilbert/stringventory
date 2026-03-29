import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle, Phone, Save, ArrowLeft, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "../../../utils/alerts";
import userService from "../../../services/userService";
import roleService from "../../../services/roleService";
import { BUSINESS_ROLES } from "../../../services/roleService";

const COUNTRY_CODES = [
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+254", flag: "🇰🇪", label: "KE" },
  { code: "+256", flag: "🇺🇬", label: "UG" },
  { code: "+255", flag: "🇹🇿", label: "TZ" },
  { code: "+237", flag: "🇨🇲", label: "CM" },
  { code: "+225", flag: "🇨🇮", label: "CI" },
  { code: "+228", flag: "🇹🇬", label: "TG" },
  { code: "+229", flag: "🇧🇯", label: "BJ" },
  { code: "+221", flag: "🇸🇳", label: "SN" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+966", flag: "🇸🇦", label: "SA" },
];

const extractRoles = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.roles)) return payload.roles;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.roles)) return payload.data.roles;

  return [];
};

const extractUser = (response) => {
  const payload = response?.data || response || {};

  if (payload?.user) return payload.user;
  if (payload?.data?.user) return payload.data.user;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

const normalizeRoleForApi = (roleValue) => {
  const raw = String(roleValue || "").trim().toLowerCase();
  if (!raw) return "";

  if (["ceo", "owner", "admin", "administrator", "superadmin", "super_admin"].includes(raw)) {
    return "ceo";
  }
  if (["manager", "management"].includes(raw)) {
    return "manager";
  }
  if (["sales", "salesperson", "sales_person", "sales rep", "sales_rep"].includes(raw)) {
    return "salesperson";
  }

  return raw;
};

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState(BUSINESS_ROLES);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+233",
    phone: "",
    role: "",
    roleId: "",
    isActive: true,
    mfaEnabled: false,
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          userService.getUserById(id),
          roleService.getRoles(),
        ]);

        const user = extractUser(userRes);
        const fetchedRoles = extractRoles(rolesRes);
        if (fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
        }

        if (!user?.id && !user?.email) {
          showError("User not found");
          navigate("/dashboard/users");
          return;
        }

        const resolvedRoleId = user.roleId || user.role?.id || "";
        const resolvedRoleName = user.role?.name || user.role || user.roleName || "";

        const existingPhone = user.phone || "";
        const knownCodes = COUNTRY_CODES.map((c) => c.code).sort((a, b) => b.length - a.length);
        let parsedCode = "+233";
        let parsedNumber = existingPhone;
        for (const code of knownCodes) {
          if (existingPhone.startsWith(code)) {
            parsedCode = code;
            parsedNumber = existingPhone.slice(code.length);
            break;
          }
        }

        setFormData({
          firstName: user.firstName || user.first_name || "",
          lastName: user.lastName || user.last_name || "",
          email: user.email || "",
          countryCode: parsedCode,
          phone: parsedNumber,
          role: typeof resolvedRoleName === "string" ? resolvedRoleName : "",
          roleId: resolvedRoleId ? String(resolvedRoleId) : "",
          isActive: user?.isActive ?? String(user?.status || "").toLowerCase() === "active",
          mfaEnabled: user?.mfaEnabled ?? user?.twoFactorEnabled ?? false,
        });
      } catch (error) {
        console.error("Error fetching user", error);
        showError(error?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, navigate]);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    const selectedRole = roles.find((r) => String(r.id) === value || String(r.name) === value);
    setFormData({
      ...formData,
      role: selectedRole?.name || "",
      roleId: selectedRole?._fallback ? "" : String(selectedRole?.id || ""),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? `${formData.countryCode}${formData.phone}` : undefined,
        role: formData.role ? normalizeRoleForApi(formData.role) : undefined,
        status: formData.isActive ? "active" : "inactive",
        twoFactorEnabled: formData.mfaEnabled,
      };
      if (formData.roleId) payload.roleId = formData.roleId;

      // Validate password if provided
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          showError("Password must be at least 8 characters.");
          setSubmitting(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          showError("Passwords do not match.");
          setSubmitting(false);
          return;
        }
      }

      await userService.updateUser(id, payload);
      
      // If password was provided, call the dedicated reset endpoint separately
      if (formData.newPassword) {
        await userService.resetPassword(id, {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        });
      }

      showSuccess("User updated successfully");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Failed to update user", error);
      showError(error?.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <div className="p-8 text-center text-gray-500">Loading user data...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-4 ">
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
                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      className="pl-10 pr-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white text-sm w-28"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({...formData, phone: value});
                    }}
                    className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="XX XXX XXXX"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    value={formData.roleId || formData.role}
                    onChange={handleRoleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-white"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id || role.name} value={role.id || role.name}>
                        {role.name || role.displayName}
                      </option>
                    ))}
                  </select>
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

              <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Reset Password <span className="text-gray-400 font-normal">(optional — leave blank to keep current)</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Repeat new password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
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
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <Save size={18} />
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

