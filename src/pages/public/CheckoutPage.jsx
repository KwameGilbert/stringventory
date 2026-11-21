import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Building2,
  CreditCard,
  ShieldCheck,
  Wallet,
  Layout
} from "lucide-react";

// Modular Components
import CheckoutHeader from "../../components/public/checkout/CheckoutHeader";
import CheckoutTrustBar from "../../components/public/checkout/CheckoutTrustBar";
import Step1_ChoosePlan from "../../components/public/registration/Step1_ChoosePlan";
import Step2_CompanyForm from "../../components/public/registration/Step2_CompanyForm";
import Step3_BillingForm from "../../components/public/registration/Step3_BillingForm";
import Step4_AdminAccountForm from "../../components/public/registration/Step4_AdminAccountForm";
import Step5_ConfirmationForm from "../../components/public/registration/Step5_ConfirmationForm";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialPlan = location.state?.tier ? location.state : {
    tier: "Pro",
    price: "79",
    interval: "mo",
    description: "Everything you need to scale your growing retail business.",
    features: ["Unlimited Products", "Up to 5 Store Locations", "Advanced Financial Reports"]
  };

  const [step, setStep] = useState(initialPlan ? 2 : 1);
  const [formData, setFormData] = useState({
    plan: initialPlan,
    companyName: "",
    subdomain: "",
    contactEmail: "",
    howHeard: "",
    phone: "",
    countryCode: "GH",
    currency: "GHS",
    paymentProvider: "paystack",
    adminEmail: "",
    adminUsername: "",
    password: "",
    confirmPassword: "",
    showAdditional: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: "Choose Plan", icon: Layout },
    { id: 2, title: "Company Info", icon: Building2 },
    { id: 3, title: "Billing Setup", icon: Wallet },
    { id: 4, title: "Admin Account", icon: ShieldCheck },
    { id: 5, title: "Confirmation", icon: CheckCircle2 },
  ];

  const handleNext = async () => {
    if (step === 5) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      navigate("/login", { state: { registered: true } });
    } else {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      <CheckoutHeader step={step} steps={steps} setStep={setStep} />

      <main className="max-w-4xl mx-auto px-6 pb-20 pt-4">
         <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-12 min-h-[400px]">
               <AnimatePresence mode="wait">
                  {step === 1 && <Step1_ChoosePlan key="step1" formData={formData} setFormData={setFormData} />}
                  {step === 2 && <Step2_CompanyForm key="step2" formData={formData} setFormData={setFormData} />}
                  {step === 3 && <Step3_BillingForm key="step3" formData={formData} setFormData={setFormData} />}
                  {step === 4 && <Step4_AdminAccountForm key="step4" formData={formData} setFormData={setFormData} />}
                  {step === 5 && <Step5_ConfirmationForm key="step5" formData={formData} setStep={setStep} />}
               </AnimatePresence>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
               <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${
                     step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-900'
                  }`}
               >
                  <ArrowLeft size={16} />
                  <span>Back</span>
               </button>

               <button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${
                     step === 5 
                       ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20' 
                       : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20'
                  }`}
               >
                  {isSubmitting ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>
                        <span>{step === 5 ? 'Complete Registration' : 'Next'}</span>
                        {step === 5 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                     </>
                  )}
               </button>
            </div>
         </div>

         <CheckoutTrustBar />
      </main>
    </div>
  );
};

export default CheckoutPage;
