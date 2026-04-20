import React from "react";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, 
  FileText, 
  RefreshCcw, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Eye,
  ArrowRightLeft,
  ShoppingBag,
  CreditCard
} from "lucide-react";

/**
 * Financial Transactions View
 * Displays inflow/outflow stats and a detailed ledger of transactions.
 */
const TransactionsView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header Section */}
    <div className="flex justify-between items-end mb-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm shadow-rose-100">
           <ArrowRightLeft className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Financial Transactions</h3>
          <p className="text-xs text-slate-400 font-medium">Real-time ledger of all company cash flow</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
         <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:bg-black transition-all">
           <RefreshCcw className="w-4 h-4" />
         </button>
      </div>
    </div>

    {/* Stat Cards Row */}
    <div className="grid grid-cols-3 gap-3">
       {[
         { label: "Total Inflow", value: "€390,470.00", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", isPositive: true },
         { label: "Total Outflow", value: "-€755,922.00", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50", isPositive: false },
         { label: "Net Balance", value: "-€365,452.00", icon: DollarSign, color: "text-rose-500", bg: "bg-sky-50", isNeutral: true }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-4 rounded-[0.9rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
               <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.isNeutral ? 'text-sky-500' : stat.color}`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <h4 className={`text-2xl font-semibold tracking-tight ${stat.isNeutral ? 'text-rose-500' : stat.isPositive ? 'text-slate-900' : 'text-slate-900'}`}>
                    {stat.value}
                  </h4>
               </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 p-2 opacity-[0.03] rotate-12">
               <stat.icon className="w-20 h-20" />
            </div>
         </div>
       ))}
    </div>

    {/* Search & Filter Bar */}
    <div className="flex gap-4">
       <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-4 py-3.5 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
          />
       </div>
       <button className="flex items-center gap-4 px-6 py-3.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-sm">
          <span>All Transaction Types</span>
          <Filter className="w-4 h-4 text-slate-400" />
       </button>
    </div>

    {/* Transactions Table */}
    <div className="bg-white rounded-[1rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
       <table className="w-full text-left">
          <thead>
             <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em]">Reference</th>
                <th className="px-6 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-center">Type</th>
                <th className="px-6 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-center">Date</th>
                <th className="px-6 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-center">Payment</th>
                <th className="px-6 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-center">Amount</th>
                <th className="px-6 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-center">Status</th>
                <th className="px-8 py-6 text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { ref: "TX-13", orderId: "PO-9BDC66", type: "Purchase", icon: ShoppingBag, color: "text-sky-500", date: "Apr 9, 2026, 03:07 PM", payment: "Bank Transfer", amount: "--€24,000.00", isNegative: true },
               { ref: "TX-12", orderId: "ORD-2E272A50", type: "Order", icon: CreditCard, color: "text-emerald-500", date: "Apr 8, 2026, 09:16 PM", payment: "Cash", amount: "+€2,010.00", isNegative: false },
               { ref: "TX-11", orderId: "ORD-72D1573A", type: "Order", icon: CreditCard, color: "text-emerald-500", date: "Apr 8, 2026, 09:06 PM", payment: "Mobile Money", amount: "+€84,540.00", isNegative: false }
             ].map((tx, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-tighter mb-0.5">{tx.ref}</span>
                        <span className="text-xs font-semibold text-slate-900 tracking-tight">{tx.orderId}</span>
                     </div>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${tx.color.replace('text', 'bg')}/10 flex items-center justify-center ${tx.color}`}>
                           <tx.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{tx.type}</span>
                     </div>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-bold text-slate-500 text-center">{tx.date}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-500 text-center">{tx.payment}</td>
                  <td className={`px-6 py-6 text-[13px] font-extrabold text-center ${tx.isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                     {tx.amount}
                  </td>
                  <td className="px-6 py-6 text-center">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-semibold uppercase tracking-widest ring-1 ring-emerald-100/50 ring-inset">
                        Completed
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Eye className="w-4.5 h-4.5" /></button>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </motion.div>
);

export default TransactionsView;
