import React from "react";
import { CreditCard, ShieldCheck, ChevronDown, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

const Step3_BillingForm = ({ formData, setFormData }) => {
  const providers = [
    {
      id: 'paystack',
      name: 'Paystack',
      badge: 'Recommended',
      badge2: 'Best for Africa',
      description: 'African payment processing with local payment methods',
      methods: ['Cards', 'Bank Transfer', 'Mobile Money'],
      color: 'emerald'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'International payment processing with credit/debit cards',
      methods: ['Credit Cards', 'Debit Cards'],
      color: 'blue'
    }
  ];

  const selectedProvider = formData.paymentProvider || 'paystack';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Billing Setup</h1>
        <p className="text-slate-500 font-medium">Set up your currency and payment preferences</p>
      </div>

      <div className="space-y-6">
        {/* Currency Section */}
        <div className="space-y-3">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Currency</label>
          <div className="p-5 border-2 border-slate-900 rounded-2xl flex items-center justify-between bg-white shadow-lg">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-semibold text-slate-600">GH</div>
                <div>
                   <p className="font-semibold text-slate-900">Ghanaian Cedi</p>
                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">GHS • GH₵ • Example: GH₵1,234.56</p>
                </div>
             </div>
             <CheckCircle2 className="w-6 h-6 text-slate-900" />
          </div>
          <div className="flex items-center justify-between px-1">
             <p className="text-[10px] text-slate-400 font-medium">Auto-selected based on your country.</p>
             <button className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">Change <ChevronDown size={12} /></button>
          </div>
        </div>

        {/* Payment Provider Section */}
        <div className="space-y-4">
          <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1">Payment Provider</label>
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-600">
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Payment country: <span className="text-slate-900 font-bold">Ghana</span></span>
             </div>
             <button className="text-emerald-600 uppercase tracking-widest text-[9px] font-bold flex items-center gap-1">Change <ChevronDown size={10} /></button>
          </div>

          <div className="space-y-3">
            {providers.map((p) => (
              <div 
                key={p.id}
                onClick={() => setFormData(prev => ({ ...prev, paymentProvider: p.id }))}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedProvider === p.id 
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-md' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                 <div className="flex items-start gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                      selectedProvider === p.id ? 'border-emerald-500' : 'border-slate-200'
                    }`}>
                       {selectedProvider === p.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded bg-${p.color}-500 flex items-center justify-center text-white text-[10px] font-bold`}>
                             {p.name[0]}
                          </div>
                          <span className="font-bold text-slate-900">{p.name}</span>
                          {p.badge && <span className="bg-slate-900 text-white text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest">{p.badge}</span>}
                          {p.badge2 && <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest">{p.badge2}</span>}
                       </div>
                       <p className="text-[11px] text-slate-500 font-medium mb-3">{p.description}</p>
                       <div className="flex gap-4">
                          {p.methods.map((m, i) => (
                            <div key={i} className="flex items-center gap-1.5 opacity-60 grayscale">
                               <CreditCard className="w-3 h-3" />
                               <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{m}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    {selectedProvider === p.id && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                 </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-3">
             <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
             <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">
                Paystack for Ghana — GHS, USD via card, bank transfer, mobile money
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Globe = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

export default Step3_BillingForm;
