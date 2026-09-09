import React, { useState } from "react";
import { Building2, Globe, Mail, Phone, ChevronDown, CheckSquare, Square, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const Step2_CompanyForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'available' | 'taken' | 'invalid'

  const handleSubdomainChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, subdomain: value }));
    setAvailabilityStatus(null); // Reset status on change
  };

  const checkAvailability = async (e) => {
    e.preventDefault();
    const subdomain = formData.subdomain;
    
    if (!subdomain || subdomain.length < 3) {
      setAvailabilityStatus('invalid');
      return;
    }
    
    const regex = /^[a-z0-9-]+$/i;
    if (!regex.test(subdomain)) {
      setAvailabilityStatus('invalid');
      return;
    }

    setIsChecking(true);
    setAvailabilityStatus(null);
    
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Logic: subdomains with 'taken' in them are taken, rest are 70% available
    const isMockAvailable = !subdomain.toLowerCase().includes('taken') && Math.random() > 0.3;
    setAvailabilityStatus(isMockAvailable ? 'available' : 'taken');
    setIsChecking(false);
  };

  const toggleAdditional = () => {
    setFormData(prev => ({ ...prev, showAdditional: !prev.showAdditional }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Company Information</h1>
        <p className="text-slate-500 font-medium">Tell us about your business</p>
      </div>
      <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
          <input 
            name="companyName"
            type="text" 
            value={formData.companyName || ''}
            onChange={handleChange}
            placeholder="Acme Inc." 
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
          />
          
        </div>

        {/* Subdomain */}
        <div className="space-y-1.5 md:col-span-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Subdomain</label>
            {availabilityStatus === 'available' && (
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                <CheckCircle2 size={12} /> Available
              </span>
            )}
            {availabilityStatus === 'taken' && (
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter flex items-center gap-1">
                <AlertCircle size={12} /> Occupied
              </span>
            )}
            {availabilityStatus === 'invalid' && (
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter flex items-center gap-1">
                Invalid Characters
              </span>
            )}
          </div>
          <div className="relative flex items-center group">
            <input 
              name="subdomain"
              type="text" 
              value={formData.subdomain || ''}
              onChange={handleSubdomainChange}
              placeholder="your-company" 
              className={`w-full bg-white border ${
                availabilityStatus === 'available' ? 'border-emerald-500 focus:ring-emerald-500/10' : 
                availabilityStatus === 'taken' ? 'border-rose-300 focus:ring-rose-500/10' : 
                'border-slate-200 focus:ring-emerald-500/10'
              } rounded-xl pl-4 pr-12 md:pr-40 py-3.5 text-sm font-medium text-slate-900 focus:border-emerald-500 transition-all outline-none`}
            />
        
            
            <div className="absolute right-2 flex items-center gap-2">
              <span className="text-slate-800 text-[10px] font-bold hidden md:block">.pinnexventures.com</span>
              <button 
                onClick={checkAvailability}
                disabled={isChecking || !formData.subdomain}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                  isChecking 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : availabilityStatus === 'available'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                }`}
              >
                {isChecking ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  availabilityStatus === 'available' ? 'Verified' : 'Check'
                )}
              </button>
            </div>
          </div>
          {formData.subdomain && (
            <p className="text-[10px] text-slate-400 font-medium ml-1 mt-1 animate-fade-in">
              Your site will be live at: <span className="text-slate-900 font-bold">{formData.subdomain.toLowerCase()}.pinnexventures.com</span>
            </p>
          )}
        </div>

        {/* Contact Email */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Contact Email</label>
          <input 
            name="contactEmail"
            type="email" 
            value={formData.contactEmail || ''}
            onChange={handleChange}
            placeholder="contact@example.com" 
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
          />
        </div>

        {/* How did you hear about us? */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">How did you hear about us? <span className="text-red-500">*</span></label>
          <div className="relative">
            <select 
              name="howHeard"
              value={formData.howHeard || ''}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>Select an option...</option>
              <option value="google">Google Search</option>
              <option value="social">Social Media</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Contact Phone */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Contact Phone <span className="text-red-500">*</span></label>
          <div className="flex gap-3">
            <div className="w-28 relative">
              <select 
                name="countryCode"
                value={formData.countryCode || 'GH'}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="GH">GH +233</option>
                <option value="NG">NG +234</option>
                <option value="US">US +1</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 pointer-events-none" />
            </div>
            <input 
              name="phone"
              type="text" 
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="23 123 4567" 
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

        {/* Add additional details checkbox */}
        <button 
          onClick={toggleAdditional}
          className="flex items-center gap-3 group mt-4"
        >
          {formData.showAdditional ? (
            <CheckSquare className="w-5 h-5 text-emerald-500" />
          ) : (
            <div className="w-5 h-5 border-2 border-slate-200 rounded-lg group-hover:border-emerald-500 transition-colors" />
          )}
          <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">Add additional company details (country, address)</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Step2_CompanyForm;
