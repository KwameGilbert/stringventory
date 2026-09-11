import React from "react";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  FileCode,
  Clock,
  Box,
  CheckCircle2
} from "lucide-react";

const PurchasesView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header Section */}
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Purchases</h3>
        <p className="text-xs text-slate-400 font-medium">Manage purchase orders and stock receiving</p>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
         <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-black transition-all">
           + New Purchase
         </button>
      </div>
    </div>

    {/* Search bar */}
    <div className="flex gap-4">
       <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search waybill or supplier..." 
            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
          />
       </div>
       <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4 text-slate-400" />
          All Status
       </button>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-4 gap-4">
       {[
         { label: "Total Purchases", value: "5", icon: FileCode, color: "text-sky-500", bg: "bg-sky-50" },
         { label: "Pending", value: "0", icon: Clock, color: "text-slate-400", bg: "bg-slate-50" },
         { label: "Partial", value: "0", icon: Box, color: "text-amber-500", bg: "bg-amber-50" },
         { label: "Received", value: "5", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
               <h4 className="text-xl font-semibold text-slate-900 leading-none">{stat.value}</h4>
            </div>
         </div>
       ))}
    </div>

    {/* Purchases Table */}
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
       <table className="w-full text-left">
          <thead>
             <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waybill</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created By</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { wb: "waybill 4", sup: "D'Addario Africa Ltd", date: "09 Apr 2026", amt: "€1,844.14", status: "RECEIVED", by: "Ceo - Anthony Afriyie" },
               { wb: "KJN/KNM", sup: "JEMPAUL VENTURES", date: "08 Apr 2026", amt: "€4,610.34", status: "RECEIVED", by: "Ceo - Anthony Afriyie" },
               { wb: "waybill 3", sup: "Global Tech Distribution", date: "30 Mar 2026", amt: "€1,229.42", status: "RECEIVED", by: "Ceo - Anthony Afriyie" },
               { wb: "234", sup: "Global Tech Distribution", date: "29 Mar 2026", amt: "€46,165.64", status: "RECEIVED", by: "Ceo - Anthony Afriyie" },
               { wb: "123", sup: "Ernie Ball Distributors GH", date: "29 Mar 2026", amt: "€4,226.15", status: "RECEIVED", by: "Ceo - Anthony Afriyie" }
             ].map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 text-xs font-bold text-slate-800">{item.wb}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-slate-500">{item.sup}</td>
                  <td className="px-6 py-6 text-[11px] font-bold text-slate-500">{item.date}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-900">{item.amt}</td>
                  <td className="px-6 py-6 font-bold">
                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">
                        {item.status}
                     </span>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-bold text-slate-500">{item.by}</td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </motion.div>
);

export default PurchasesView;
