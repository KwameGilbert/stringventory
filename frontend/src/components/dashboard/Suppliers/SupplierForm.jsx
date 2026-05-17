import { useState, useEffect } from "react";
import { Save, Building2, User, Mail, Phone, MapPin, Truck, ArrowLeft, Info, Sliders } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SupplierForm = ({ initialData = {}, onSubmit, title, subTitle, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    notes: "",
    ...initialData,
  });

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/suppliers")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
      >
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="font-semibold text-sm">Back to Suppliers Catalog</span>
      </button>

      {/* Header Banner */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="p-3.5 rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20 text-white flex items-center justify-center shrink-0">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">{subTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Details Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-100 flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wider">Company Details</h3>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  placeholder="e.g. Global Tech Distribution"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Account Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-100 bg-purple-100 flex items-center gap-2.5">
            <User className="w-4 h-4 text-purple-700" />
            <h3 className="font-bold text-purple-950 text-sm uppercase tracking-wider">Contact Information</h3>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Contact Person <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs font-mono"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs font-mono"
                  placeholder="+233 20 123 4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs resize-none"
                  placeholder="Street address, City, Region"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3.5 pt-4">
          <Link
            to="/dashboard/suppliers"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all text-xs shadow-2xs active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold transition-all flex items-center gap-2 text-xs shadow-sm shadow-slate-900/20 active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            <span>{isSubmitting ? "Saving..." : "Save Supplier"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
