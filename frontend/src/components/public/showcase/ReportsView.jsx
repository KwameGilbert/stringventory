import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const ReportsView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} 
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h3>
        <p className="text-xs text-slate-400 font-medium">In-depth analysis of your business performance</p>
      </div>
      <div className="flex gap-2">
         <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4" /> This Year <ChevronDown className="w-3 h-3" />
         </button>
         <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all">
            <Download className="w-4 h-4" /> Export Report
         </button>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-4">
       {[
         { label: "Gross Revenue", value: "$458,240.00", trend: "+12.5%", ups: true },
         { label: "Net Profit", value: "$124,500.00", trend: "+8.2%", ups: true },
         { label: "Avg. Order Value", value: "$324.00", trend: "-2.1%", ups: false },
         { label: "Customer LTV", value: "$1,240.00", trend: "+5.4%", ups: true }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-xl font-bold text-slate-900">{stat.value}</h4>
            <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${stat.ups ? 'text-emerald-500' : 'text-rose-500'}`}>
               {stat.ups ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
               {stat.trend} <span className="text-slate-300 font-medium ml-1">vs last period</span>
            </div>
         </div>
       ))}
    </div>

    <div className="grid grid-cols-12 gap-6">
       {/* Main Performance Chart */}
       <div className="col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h4 className="font-semibold text-slate-900 text-sm">Revenue vs Expenses</h4>
             <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Revenue</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Expenses</div>
             </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 px-2 relative">
             <div className="absolute inset-0 border-b border-slate-50 flex flex-col justify-between pointer-events-none opacity-50">
               <div className="h-px w-full bg-slate-50" /><div className="h-px w-full bg-slate-50" /><div className="h-px w-full bg-slate-100" />
             </div>
             {[45, 62, 58, 75, 42, 85, 92, 54, 78, 95, 64, 82].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                   <div className="w-full flex items-end gap-1 h-48">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${v}%` }} className="flex-1 bg-emerald-500 rounded-t-sm group-hover:bg-emerald-600 transition-colors" />
                      <motion.div initial={{ height: 0 }} animate={{ height: `${v*0.6}%` }} transition={{ delay: 0.2 }} className="flex-1 bg-slate-100 rounded-t-sm" />
                   </div>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                     {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                   </span>
                </div>
             ))}
          </div>
       </div>

       {/* Pie Chart / Distribution */}
       <div className="col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h4 className="font-semibold text-slate-900 text-sm mb-6">Sales Distribution</h4>
          <div className="flex-1 flex items-center justify-center relative py-4">
             <svg className="w-32 h-32 rotate-[-90deg]">
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="314" strokeDashoffset="80" strokeLinecap="round" />
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="314" strokeDashoffset="260" strokeLinecap="round" />
               <circle cx="64" cy="64" r="50" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="314" strokeDashoffset="200" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800">84%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Growth</span>
             </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[{l: 'Retail', c: 'bg-emerald-500'}, {l: 'Wholesale', c: 'bg-sky-500'}, {l: 'Digital', c: 'bg-purple-500'}, {l: 'Other', c: 'bg-slate-200'}].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.c}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.l}</span>
              </div>
            ))}
          </div>
       </div>
    </div>
  </motion.div>
);

export default ReportsView;
