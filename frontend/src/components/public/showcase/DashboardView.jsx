import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const DashboardView = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-4 gap-4">
      {[
        { label: "Total Revenue", value: "$128,430", trend: "+12.5%", isUp: true, color: "text-emerald-600" },
        { label: "Active Orders", value: "1,240", trend: "+8.2%", isUp: true, color: "text-sky-600" },
        { label: "Stock Level", value: "84%", trend: "-2.1%", isUp: false, color: "text-amber-600" },
        { label: "Total Customers", value: "12,400", trend: "+5.4%", isUp: true, color: "text-purple-600" }
      ].map((stat, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
          <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
          <div className={`mt-2 flex items-center text-[10px] font-bold ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
             {stat.isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
             {stat.trend}
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900 text-sm">Monthly Performance</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-slate-500">Sales</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[10px] font-bold text-slate-500">Expenses</span></div>
          </div>
        </div>
        <div className="h-48 w-full">
          <svg viewBox="0 0 800 200" className="w-full h-full">
             <path d="M0,150 Q100,160 150,110 T300,90 T450,130 T600,40 T800,70 L800,200 L0,200 Z" fill="url(#chartGrad)" />
             <path d="M0,150 Q100,160 150,110 T300,90 T450,130 T600,40 T800,70" fill="none" stroke="#10b981" strokeWidth="4" />
             <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.1" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
          </svg>
        </div>
      </div>
      <div className="col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-bold text-slate-900 text-sm mb-4 w-full">Payment Distribution</h3>
          <div className="relative w-32 h-32">
             <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" />
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="251" strokeDashoffset="200" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-800">74%</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
            {['Momo', 'Cash', 'Card', 'Bank'].map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className={`w-2 h-2 rounded-full ${i===0?'bg-emerald-500':i===1?'bg-purple-500':i===2?'bg-sky-500':'bg-amber-500'}`} />
                {m}
              </div>
            ))}
          </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardView;
