import React from "react";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Package,
  RefreshCw,
  DollarSign,
  Clock,
  Box
} from "lucide-react";

const InventoryView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header Section */}
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Inventory Management</h3>
        <p className="text-xs text-slate-400 font-medium">Stock Intake • 8 total batches</p>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
      </div>
    </div>

    {/* Search & Filter Bar */}
    <div className="flex gap-4">
       <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products, batches, suppliers..." 
            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
          />
       </div>
       <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4 text-slate-400" />
          All Categories
       </button>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-4 gap-4">
       {[
         { label: "Total Batches", value: "8", icon: Package, color: "text-sky-500", bg: "bg-sky-50" },
         { label: "Total Stock", value: "5,014", icon: RefreshCw, color: "text-emerald-500", bg: "bg-emerald-50" },
         { label: "Total Value", value: "€527,920.00", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50/50" },
         { label: "Expiring Soon", value: "1", sub: "batches", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
               <h4 className="text-lg font-bold text-slate-900 leading-none">{stat.value}</h4>
               {stat.sub && <p className="text-[9px] font-bold text-slate-300 mt-0.5">{stat.sub}</p>}
            </div>
         </div>
       ))}
    </div>

    {/* Inventory Table */}
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
       <table className="w-full text-left">
          <thead>
             <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch #</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Cost</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { name: "Puma", cat: "BEVERAGES", batch: "BATCH-1", sup: "Puma distribution agency", cost: "€120.00", qty: "3620", total: "€434,400.00", entry: "Mar 29, 2026", expiry: "APR 3, 2026", expType: "critical" },
               { name: "Snark SN-5X Clip-On Tuner", cat: "ACCESSORIES", batch: "BATCH-2", sup: "Pro Sound Imports", cost: "€30.00", qty: "240", total: "€7,200.00", entry: "Mar 29, 2026", expiry: "APR 4, 2026", expType: "warning" },
               { name: "Hal Leonard Guitar Chord...", cat: "UNCATEGORIZED", batch: "BATCH-3", sup: "Pro Sound Imports", cost: "€80.00", qty: "254", total: "€20,320.00", entry: "Mar 29, 2026", expiry: "JUN 10, 2026", expType: "normal" }
             ].map((item, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                           <Box className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-800">{item.name}</p>
                           <p className="text-[9px] font-semibold text-slate-400 uppercase">{item.cat}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.batch}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-500 max-w-[120px] truncate">{item.sup}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-800">{item.cost}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{item.qty}</td>
                  <td className="px-6 py-4 text-xs font-extrabold text-emerald-600">{item.total}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{item.entry}</td>
                  <td className="px-6 py-4">
                     <div className={`text-[9px] font-bold uppercase ${
                        item.expType === 'critical' ? 'text-rose-500' : item.expType === 'warning' ? 'text-amber-500' : 'text-slate-500'
                     }`}>
                        {item.expiry}
                     </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                     <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-slate-300 hover:text-sky-500 transition-all"><Box className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Eye className="w-4 h-4" /></button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </motion.div>
);

export default InventoryView;
