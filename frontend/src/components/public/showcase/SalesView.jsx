import React from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, CreditCard } from "lucide-react";

const SalesView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
     <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
        <button className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 hover:gap-3 transition-all">View All Sales <ArrowRightLeft className="w-3.5 h-3.5" /></button>
     </div>
     <div className="space-y-3">
        {[
          { customer: "Johnathan Smith", items: 3, total: "$1,240", status: "Completed", time: "2 mins ago" },
          { customer: "Sarah Williams", items: 1, total: "$89.00", status: "Pending", time: "15 mins ago" },
          { customer: "Michael Chen", items: 5, total: "$3,450", status: "Completed", time: "1 hour ago" },
          { customer: "Emma Davis", items: 2, total: "$230.00", status: "Refunded", time: "3 hours ago" }
        ].map((sale, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <CreditCard className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 text-xs">{sale.customer}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{sale.items} items purchased • {sale.time}</p>
               </div>
            </div>
            <div className="text-right">
               <h4 className="font-semibold text-slate-900 text-xs">{sale.total}</h4>
               <p className={`text-[10px] font-semibold uppercase tracking-tight ${sale.status === 'Completed' ? 'text-emerald-500' : sale.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'}`}>{sale.status}</p>
            </div>
          </div>
        ))}
     </div>
  </motion.div>
);

export default SalesView;
