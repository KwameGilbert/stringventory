import { useState } from "react";
import { Save, ArrowLeft, User, Building2, Phone, Mail, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateCustomer() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerData = {
      id: Date.now(),
      ...formData,
      totalOrders: 0,
      totalSpent: 0,
      status: "active",
      joinedDate: new Date().toISOString().split('T')[0],
      lastOrderDate: null,
    };
    console.log("Creating customer:", customerData);
    navigate("/dashboard/customers");
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/customers")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Customers</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
        <p className="text-gray-500 text-sm">Create a new customer profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Customer and business details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                placeholder="e.g., John Okonkwo"
                required
              />
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                placeholder="e.g., J&K Supermarket"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-violet-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contact Details</h3>
                <p className="text-xs text-gray-500">How to reach the customer</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-sm"
                placeholder="+234 801 234 5678"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-sm"
                placeholder="john@example.com"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Business Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-sm resize-none"
                placeholder="45 Market Road, Lagos, Nigeria"
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/dashboard/customers"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-900/20"
          >
            <Save size={18} />
            Save Customer
          </button>
        </div>
      </form>
    </div>
  );
}
