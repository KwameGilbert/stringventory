import React from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const SummarySection = ({ title, fields, onEdit }) => (
  <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm relative group overflow-hidden">
    <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="relative z-10 flex justify-between items-start mb-4">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
      <button 
        onClick={onEdit}
        className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <Pencil size={12} className="stroke-[2]" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
      </button>
    </div>
    
    <div className="relative z-10 space-y-2">
      {fields.map((f, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest shrink-0">{f.label}</span>
          <span className="text-xs font-medium text-slate-700 text-right overflow-hidden text-ellipsis">{f.value || 'Not provided'}</span>
        </div>
      ))}
    </div>
  </div>
);

const Step5_ConfirmationForm = ({ formData, setStep }) => {
  const plan = formData.plan || { tier: 'Pro', price: '79', interval: 'mo' };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Confirm Your Details</h1>
        <p className="text-slate-500 font-medium">Review everything before we get you started</p>
      </div>

      <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Plan */}
        <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm flex justify-between items-center group relative overflow-hidden md:col-span-2">
           <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Selected Plan</h3>
                  <button onClick={() => setStep(1)} className="text-emerald-600 hover:scale-110 transition-transform">
                    <Pencil size={12} className="stroke-[2]" />
                  </button>
               </div>
               <p className="text-lg font-semibold text-slate-900">{plan.tier}</p>
               <p className="text-[10px] text-slate-400 font-medium">For growing businesses with advanced needs</p>
            </div>
            <div className="text-right">
               <p className="text-xl font-semibold text-slate-900">${plan.price}/{plan.interval}</p>
            </div>
        </div>

        {/* Company Info */}
        <SummarySection 
          title="Company Info"
          onEdit={() => setStep(2)}
          fields={[
            { label: 'Name', value: formData.companyName },
            { label: 'Subdomain', value: formData.subdomain ? `${formData.subdomain}.stringventory.com` : '' },
            { label: 'Email', value: formData.contactEmail },
            { label: 'Phone', value: `${formData.countryCode || 'GH'} ${formData.phone || ''}` },
          ]}
        />

        {/* Admin Access */}
        <SummarySection 
          title="Admin Access"
          onEdit={() => setStep(4)}
          fields={[
            { label: 'Admin Email', value: formData.adminEmail },
            { label: 'Username', value: formData.adminUsername }
          ]}
        />

        {/* Billing & Payment */}
        <SummarySection 
          title="Billing & Payment"
          onEdit={() => setStep(3)}
          fields={[
            { label: 'Currency', value: 'GHS' },
            { label: 'Provider', value: formData.paymentProvider || 'Paystack' },
            { label: 'Country', value: 'Ghana' }
          ]}
        />

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col justify-center">
           <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
             By clicking "Complete Registration", you agree to our <span className="text-emerald-600 font-bold underline cursor-pointer">Terms</span> and <span className="text-emerald-600 font-bold underline cursor-pointer">Privacy Policy</span>.
           </p>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default Step5_ConfirmationForm;
