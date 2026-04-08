import { useEffect, useState } from "react";
import { User, Mail, Shield, CheckCircle, Phone, Lock, Save, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../../utils/alerts";
import { handleApiError } from "../../../utils/errorHandler";
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

export default function AddUser() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
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
    password: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getRoles();
        const fetchedRoles = extractRoles(response);
        if (fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
        }
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    const selectedRole = roles.find((r) => String(r.id) === value || String(r.name) === value);
    setFormData({
      ...formData,
      role: selectedRole?.name || "",
      roleId: selectedRole?._fallback ? "" : String(selectedRole?.id || ""),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.role) {
      showError("Please select a role");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone ? `${formData.countryCode}${formData.phone}` : undefined,
        password: formData.password,
        role: normalizeRoleForApi(formData.role),
        status: formData.isActive ? "active" : "inactive",
        twoFactorEnabled: formData.mfaEnabled,
      };
      if (formData.roleId) payload.roleId = formData.roleId;
      await userService.createUser(payload);

      showSuccess("User created successfully");
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Failed to create user", error);
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-500 text-sm">Create a new team member and assign a role</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="john@example.com"
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
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
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
                    setFormData({ ...formData, phone: value });
                  }}
                  className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="XX XXX XXXX"
                  maxLength={10}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <select
                  required
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
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
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
                    onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
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
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
