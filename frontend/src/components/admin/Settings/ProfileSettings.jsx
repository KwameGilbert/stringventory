import { useState } from "react";
import { User, Mail, Phone, MapPin, Globe, Camera } from "lucide-react";
import { showSuccess } from "../../../utils/alerts";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    businessName: "WholeSys Inc",
    email: "contact@wholesys.com",
    phone: "+233 24 567 8900",
    address: "123 Business Avenue, Accra, Ghana",
    website: "www.wholesys.com",
    avatar: "https://ui-avatars.com/api/?name=WholeSys+Inc&background=10b981&color=fff"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showSuccess("Profile updated successfully");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Business Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row gap-6 mb-8">
          <div className="relative group cursor-pointer">
            <img 
              src={formData.avatar} 
              alt="Business Logo" 
              className="w-24 h-24 rounded-2xl shadow-md ring-4 ring-gray-50 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900">Company Logo</h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload a logo to display on invoices and reports.<br/>
              Recommended size: 500x500px.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Business Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
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
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
