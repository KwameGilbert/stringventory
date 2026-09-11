import React from "react";
import { motion } from "framer-motion";
import { 
  Receipt, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Trash2,
  Calendar,
  CreditCard
} from "lucide-react";

const ExpensesView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Expenses</h3>
        <p className="text-xs text-slate-400 font-medium">Track and manage your business's non-inventory spending</p>
      </div>
      <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all">
         + Add Expense
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4">
       {[
         { label: "Total Monthly Expenses", value: "$42,850.00", icon: Receipt, color: "text-rose-500", bg: "bg-rose-50" },
         { label: "Highest Category", value: "Salaries", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
         { label: "Pending Approval", value: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
            </div>
         </div>
       ))}
    </div>

    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
       <div className="p-4 border-b border-slate-50 flex gap-4">
          <div className="flex-1 relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
             <input type="text" placeholder="Search expenses..." className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 outline-none" />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 flex items-center gap-2 hover:bg-slate-50 transition-all">
             <Filter className="w-4 h-4 text-slate-300" /> All Categories
          </button>
       </div>

       <table className="w-full text-left">
          <thead>
             <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Amount</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { desc: "Electricity Bill - Oct", cat: "Rent & Utilities", date: "Oct 20, 2024", amt: "$450.00", status: "Paid" },
               { desc: "Google Ads Campaigns", cat: "Marketing", date: "Oct 18, 2024", amt: "$1,200.00", status: "Pending" },
               { desc: "New Office Chairs (8x)", cat: "Maintenance", date: "Oct 15, 2024", amt: "$2,400.00", status: "Paid" },
               { desc: "Monthly Rent - Office", cat: "Rent & Utilities", date: "Oct 01, 2024", amt: "$3,800.00", status: "Paid" },
               { desc: "Coffee & Snacks", cat: "Office Supplies", date: "Oct 22, 2024", amt: "$120.00", status: "Paid" }
             ].map((exp, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><CreditCard className="w-4 h-4 text-slate-400" /></div>
                     <span className="text-xs font-semibold text-slate-900">{exp.desc}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{exp.cat}</td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-slate-400">{exp.date}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-900">{exp.amt}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                        exp.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                     }`}>
                        {exp.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-300 hover:text-emerald-500 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </motion.div>
);

export default ExpensesView;
