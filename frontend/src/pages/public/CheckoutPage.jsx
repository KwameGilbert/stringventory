import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Building2, 
  CreditCard, 
  Lock, 
  Mail, 
  ShieldCheck,
  Zap,
  Star
} from "lucide-react";

/**
 * CheckoutPage
 * A premium, full-page signup and plan selection experience.
 */
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get plan details from state or use fallback
  const selectedPlan = location.state?.tier ? location.state : {
    tier: "Pro",
    price: "79",
    description: "Everything you need to scale your growing retail business.",
    features: ["Unlimited Products", "Up to 5 Store Locations", "Advanced Financial Reports"]
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    country: "USA",
    teamSize: "1-5",
  });

  const steps = [
    { id: 1, title: "Account", icon: User },
    { id: 2, title: "Business", icon: Building2 },
    { id: 3, title: "Payment", icon: CreditCard },
  ];

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* LEFT COLUMN: Signup Wizard */}
      <div className="flex-1 flex flex-col px-6 lg:px-20 py-12 lg:py-20 relative overflow-y-auto">
        {/* Logo / Back link */}
        <div className="max-w-xl mx-auto w-full mb-16 flex justify-between items-center">
           <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                 <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">StringVentory</span>
           </Link>
           <Link to="/#pricing" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to pricing
           </Link>
        </div>

        {/* Wizard Container */}
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
           {/* Progress Header */}
           <div className="mb-12">
              <div className="flex items-center gap-8">
                 {steps.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          step === s.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                          step > s.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'
                       }`}>
                          {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                       </div>
                       <span className={`text-[11px] font-bold uppercase tracking-widest ${
                          step === s.id ? 'text-slate-900' : 'text-slate-400'
                       }`}>{s.title}</span>
                       {s.id < 3 && <div className="w-12 h-px bg-slate-100 ml-4 hidden sm:block" />}
                    </div>
                 ))}
              </div>
           </div>

           <div className="flex-1">
              <AnimatePresence mode="wait">
                 {step === 1 && (
                   <motion.div 
                     key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                   >
                      <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create your account</h1>
                        <p className="text-slate-500 font-medium">Start your 14-day free trial. No strings attached.</p>
                      </div>

                      <div className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                               <input 
                                 type="email" placeholder="name@company.com" 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Choose Password</label>
                            <div className="relative">
                               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                               <input 
                                 type="password" placeholder="••••••••" 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
                               />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium ml-1">Must be at least 8 characters long.</p>
                         </div>
                      </div>
                   </motion.div>
                 )}

                 {step === 2 && (
                   <motion.div 
                     key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                   >
                      <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">About your business</h1>
                        <p className="text-slate-500 font-medium">Help us personalize your StringVentory experience.</p>
                      </div>

                      <div className="space-y-5">
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                            <div className="relative">
                               <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                               <input 
                                 type="text" placeholder="StringVentory Inc." 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
                               />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                               <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Region</label>
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none appearance-none">
                                  <option>North America</option>
                                  <option>Europe</option>
                                  <option>Africa</option>
                                  <option>Asia Pacific</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Team Size</label>
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none appearance-none">
                                  <option>1-5 members</option>
                                  <option>6-20 members</option>
                                  <option>21-50 members</option>
                                  <option>50+ members</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 )}

                 {step === 3 && (
                   <motion.div 
                     key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                   >
                      <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Security & Verification</h1>
                        <p className="text-slate-500 font-medium">Verify your identity and setup your trial.</p>
                      </div>

                      <div className="space-y-6">
                         <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center text-center">
                            <CreditCard className="w-16 h-16 text-slate-200 mb-4" />
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Simulated Checkout</h4>
                            <p className="text-sm text-slate-400 font-medium px-8">No charge is made today. You are starting a free 14-day trial of the {selectedPlan.tier} plan.</p>
                            
                            <div className="w-full mt-8 space-y-4">
                               <input 
                                 type="text" placeholder="Card Number" 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none" 
                               />
                               <div className="grid grid-cols-2 gap-4">
                                  <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none" />
                                  <input type="text" placeholder="CVV" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none" />
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                            <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                              StringVentory uses 256-bit SSL encryption to protect your data. Your connection to our servers is fully secure.
                            </p>
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Actions */}
           <div className="mt-12 flex items-center gap-4">
              {step > 1 && (
                 <button 
                   onClick={prevStep} 
                   className="flex-1 py-5 border border-slate-100 rounded-2xl text-slate-500 font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
                 >
                    Previous
                 </button>
              )}
              <button 
                onClick={step === 3 ? () => navigate("/") : nextStep}
                className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {step === 3 ? 'Start Free Trial' : 'Continue'} <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Footer info */}
        <div className="max-w-xl mx-auto w-full mt-20 pt-8 border-t border-slate-100 pb-12 flex justify-between items-center opacity-40">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2024 StringVentory Inc.</p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Policy • Terms of Service</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div className="w-full lg:w-[450px] bg-slate-900 text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-12 lg:p-16 flex flex-col">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
         
         <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20">
               <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
               <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Order Summary</span>
            </span>
            
            <h2 className="text-3xl font-bold mb-2">{selectedPlan.tier} Plan</h2>
            <p className="text-slate-400 font-medium mb-10">{selectedPlan.description}</p>
            
            <div className="space-y-10">
               <div className="pb-10 border-b border-white/5">
                  <div className="flex justify-between items-baseline mb-2">
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Subscription</span>
                     <div className="text-right">
                        <span className="text-3xl font-bold">${selectedPlan.price}</span>
                        <span className="text-slate-500 ml-1">/{selectedPlan.interval}</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Setup Fee</span>
                     <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">$0.00 FREE</span>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Plan Benefits</h4>
                  <div className="space-y-4">
                     {selectedPlan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-4">
                           <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                           </div>
                           <span className="text-sm text-slate-300 font-medium">{f}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Trust badges */}
               <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                    "StringVentory has completely transformed how we manage our 12 stores. The automation alone saved us 20 hours a week."
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                     <div className="w-8 h-8 rounded-full bg-slate-700" />
                     <div>
                        <p className="text-[11px] font-bold">Sarah Williams</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">CEO, GreenRetail</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
