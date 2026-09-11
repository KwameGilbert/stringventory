import React, { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Step4_AdminAccountForm = ({ formData, setFormData }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Create Your Admin Account</h1>
        <p className="text-slate-500 font-medium px-4">
          This is your master login — full control over your business data, users, and settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Admin Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
            <div className="relative">
               <input 
                 name="adminEmail"
                 type="email" 
                 value={formData.adminEmail || ''}
                 onChange={handleChange}
                 placeholder="abena@gmail.com" 
                 className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
               />
            </div>
          </div>

          {/* Admin Username */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Admin Username</label>
            <div className="relative">
               <input 
                 name="adminUsername"
                 type="text" 
                 value={formData.adminUsername || ''}
                 onChange={handleChange}
                 placeholder="abena" 
                 className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
               />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
               <input 
                 name="password"
                 type={showPass ? "text" : "password"} 
                 value={formData.password || ''}
                 onChange={handleChange}
                 placeholder="••••••••" 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
               />
               <button 
                 type="button"
                 onClick={() => setShowPass(!showPass)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
               >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
               <input 
                 name="confirmPassword"
                 type={showConfirm ? "text" : "password"} 
                 value={formData.confirmPassword || ''}
                 onChange={handleChange}
                 placeholder="••••••••" 
                 className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
               />
               <button 
                 type="button"
                 onClick={() => setShowConfirm(!showConfirm)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
               >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Step4_AdminAccountForm;
