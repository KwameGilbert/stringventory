import React from "react";
import { Check, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const PlanCard = ({ plan, isSelected, onSelect }) => {
  const isPro = plan.tier === "Pro";
  
  return (
    <div 
      onClick={() => onSelect(plan)}
      className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? "border-emerald-500 bg-emerald-50/30 shadow-md shadow-emerald-500/10" 
          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Check className="text-white w-5 h-5" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">{plan.tier}</h3>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{plan.interval === 'mo' ? 'Monthly Billing' : 'Annual Billing'}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-900">${plan.price}</span>
          <span className="text-slate-400 text-xs font-semibold uppercase ml-1">/{plan.interval}</span>
        </div>
      </div>

      <div className="space-y-2">
        {plan.features.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-500' : 'bg-slate-100'}`}>
              <Check className={`w-2.5 h-2.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <span className="text-xs font-medium text-slate-500">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step1_ChoosePlan = ({ formData, setFormData }) => {
  const plans = [
    {
      tier: "Basic",
      price: "29",
      interval: "mo",
      description: "Perfect for small shops and individual retailers getting started.",
      features: ["Up to 500 Products", "Single Store Location", "Basic Analytics"]
    },
    {
      tier: "Pro",
      price: "79",
      interval: "mo",
      description: "Everything you need to scale your growing retail business.",
      features: ["Unlimited Products", "Up to 5 Store Locations", "Advanced Financial Reports"],
      highlighted: true
    },
    {
      tier: "Enterprise",
      price: "199",
      interval: "mo",
      description: "Advanced features for high-volume, multi-national retailers.",
      features: ["Unlimited Everything", "Custom API Integrations", "Dedicated Account Manager"]
    }
  ];

  const currentPlan = formData.plan || plans[1];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-1 tracking-tight">Choose your plan</h1>
        <p className="text-slate-500 font-medium text-md">Select the tier that best fits your business needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.tier} 
            plan={plan} 
            isSelected={currentPlan.tier === plan.tier}
            onSelect={(p) => setFormData(prev => ({ ...prev, plan: p }))}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Step1_ChoosePlan;
