import React from "react";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="relative">
        {/* Outer pulse */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
        
        {/* Main Spinner */}
        <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Loading experience...</h3>
        <p className="text-sm text-gray-500">Preparing your workspace</p>
      </div>
    </div>
  );
};

export default PageLoader;
