import React from "react";
import { motion } from "framer-motion";
import { 
  RefreshCcw, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Eye 
} from "lucide-react";

const RefundsView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} 
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="space-y-6"
  >
    {/* Stat Cards */}
    <div className="grid grid-cols-4 gap-4">
       {[
         { label: "Total Requests", value: "1", icon: RefreshCcw, color: "text-sky-500", bg: "bg-sky-50" },
         { label: "Pending", value: "1", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
         { label: "Completed", value: "0", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
         { label: "Total Refunded", value: "€0.00", icon: DollarSign, color: "text-rose-500", bg: "bg-rose-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
               <h4 className="text-xl font-bold text-slate-900 leading-none">{stat.value}</h4>
            </div>
         </div>
       ))}
    </div>

    {/* Refunds Table */}
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
       <table className="w-full text-left">
          <thead>
             <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refund ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Customer</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Order #</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { id: "#1", customer: "Rose", order: "ORD-2E272A50", date: "Apr 9, 2026", amount: "€670.00", status: "PENDING" }
             ].map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">{item.id}</td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900 text-center">{item.customer}</td>
                  <td className="px-6 py-6 text-xs font-bold text-sky-600 text-center cursor-pointer hover:underline uppercase">{item.order}</td>
                  <td className="px-6 py-6 text-xs font-semibold text-slate-500 text-center">{item.date}</td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900 text-center">{item.amount}</td>
                  <td className="px-6 py-6 text-center">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-bold uppercase ring-1 ring-amber-100 ring-inset">
                        <Clock className="w-3 h-3" /> {item.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button className="inline-flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">View</span>
                     </button>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>

    {/* Footer attribution matching the screenshot */}
    <div className="pt-20 flex justify-between items-center text-[10px] font-medium text-slate-400 italic">
       <p>© 2026 StringVentory. All rights reserved.</p>
       <p>Developed by <span className="text-emerald-500 font-bold not-italic">StringTech</span></p>
    </div>
  </motion.div>
);

export default RefundsView;
