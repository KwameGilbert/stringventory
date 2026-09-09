import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

const CheckoutTrustBar = () => {
  return (
    <div className="mt-12 flex flex-col items-center gap-6 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck size={24} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SSL SECURE</span>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex flex-col items-center gap-1">
          <Zap size={24} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">INSTANT ACTIVATION</span>
        </div>
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
        © 2024 PinnexVentures Global • All Rights Reserved
      </p>
    </div>
  );
};

export default CheckoutTrustBar;
