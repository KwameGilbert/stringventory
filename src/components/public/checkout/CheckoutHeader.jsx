import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const CheckoutHeader = ({ step, steps, setStep }) => {
  return (
    <div className="pt-10 pb-6 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Step Counter */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">
          Step {step} of 5 — About 2 minutes
        </p>

        {/* Stepper Breadcrumbs */}
        <div className="w-full max-w-3xl flex items-center justify-between relative px-4">
          {steps.map((s, index) => (
            <React.Fragment key={s.id}>
              <div 
                className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group"
                onClick={() => step > s.id && setStep(s.id)}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  step === s.id 
                    ? 'bg-[#1E293B] text-white shadow-2xl shadow-slate-900/20 scale-110' 
                    : step > s.id 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
                      : 'bg-white text-slate-300 border border-slate-200'
                }`}>
                  {step > s.id ? <CheckCircle2 size={16} className="md:size-[18px]" /> : <s.icon size={16} className="md:size-[18px]" />}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors text-center absolute -bottom-6 w-24 hidden md:block ${
                  step === s.id ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-200 mx-1 md:mx-2 -mt-8 relative z-0">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step > s.id ? "100%" : "0%" }}
                    className="h-full bg-emerald-500"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
