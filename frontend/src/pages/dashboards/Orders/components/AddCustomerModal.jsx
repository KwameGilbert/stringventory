import { useState } from "react";
import { Save, User, Building2, Phone, Mail, MapPin, X } from "lucide-react";
import customerService from "../../../../services/customerService";
import { showError, showSuccess } from "../../../../utils/alerts";

const splitName = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

export default function AddCustomerModal({ isOpen, onClose, onCustomerAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { firstName, lastName } = splitName(formData.name);

    try {
      const response = await customerService.createCustomer({
        firstName,
        lastName,
        businessName: formData.businessName,
        email: formData.email || null,
        phone: formData.phone,
        address: formData.address,
        status: "active",
      });
      
      const newCustomer = response?.data || response;

      showSuccess("Customer created successfully");
      
      // Reset form
      setFormData({
         name: "",
         businessName: "",
         email: "",
         phone: "",
         address: "",
      });
      
      onCustomerAdded(newCustomer);
      onClose();
    } catch (error) {
      console.error("Failed to create customer", error);
      showError(error?.message || "Failed to create customer");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
            <p className="text-sm text-gray-500">Create a quick customer profile</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
            <form id="add-customer-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-100">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    </div>
                </div>
                
                <div className="p-5 space-y-4">
                    {/* Customer Name */}
                    <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                        Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                        placeholder="e.g., John Okonkwo"
                        required
                    />
                    </div>

                    {/* Business Name */}
                    <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                        placeholder="e.g., J&K Supermarket"
                        required
                    />
                    </div>
                </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-50">
                    <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-100">
                        <Phone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Contact Details</h3>
                    </div>
                    </div>
                </div>
                
                <div className="p-5 space-y-4">
                    {/* Phone */}
                    <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm"
                        placeholder="+234 801 234 5678"
                        required
                    />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm"
                        placeholder="john@example.com"
                    />
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        Business Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm resize-none"
                        placeholder="45 Market Road, Lagos, Nigeria"
                        required
                    />
                    </div>
                </div>
                </div>
            </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-customer-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-900/20 disabled:opacity-50"
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
                <Save size={16} />
            )}
            {loading ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}
