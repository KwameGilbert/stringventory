import React from "react";
import { motion } from "framer-motion";
import { Truck, FileSpreadsheet, FileText, Search, Filter, ChevronRight, User, Mail, Phone, MapPin, Eye, Pencil, Trash2 } from "lucide-react";

const SuppliersView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Suppliers Header */}
    <div className="flex justify-between items-end mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Suppliers</h3>
          <p className="text-xs text-slate-400 font-medium">Manage your product suppliers and partnerships</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
         <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-black transition-all">
           + Add Supplier
         </button>
      </div>
    </div>

    {/* Search & Filter Bar */}
    <div className="flex gap-4 mb-6">
       <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
          />
       </div>
       <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4 text-slate-400" />
          All Status
          <ChevronRight className="w-4 h-4 text-slate-300 rotate-90" />
       </button>
    </div>

    {/* Suppliers Grid */}
    <div className="grid grid-cols-2 gap-6">
      {[
        { name: "Global Tech Distribution", c: "Abena Ampofowaa Agyei", e: "abenaampofowaa23@gmail.com", p: "0550807914", a: "P.O.Box 1277", products: 0, initial: "G", color: "bg-emerald-50", text: "text-emerald-600" },
        { name: "Puma distribution agency", c: "Anthony Afriyie", e: "admin@sada.org", p: "+987654321", a: "P.O.Box 1277", products: 1, initial: "P", color: "bg-emerald-50", text: "text-emerald-600" },
        { name: "D'Addario Africa Ltd", c: "Kwame Asante", e: "orders@daddario-africa.com", p: "+233201234567", a: "14 Ring Road Central, Accra", products: 3, initial: "D", color: "bg-emerald-50", text: "text-emerald-600" }
      ].map((sup, i) => (
        <div key={i} className="bg-white rounded-[1rem] border border-slate-100 shadow-sm p-6 flex flex-col group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
           <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl ${sup.color} flex items-center justify-center text-xl font-bold ${sup.text}`}>
                    {sup.initial}
                 </div>
                 <div>
                    <h4 className="font-semibold text-slate-900 text-sm leading-tight">{sup.name}</h4>
                    <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-md">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-bold text-emerald-600 uppercase">Active</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-400">
                 <User className="w-4 h-4 shrink-0" />
                 <span className="text-xs font-medium text-slate-600 truncate">{sup.c}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                 <Mail className="w-4 h-4 shrink-0" />
                 <span className="text-xs font-medium text-slate-600 truncate">{sup.e}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                 <Phone className="w-4 h-4 shrink-0" />
                 <span className="text-xs font-medium text-slate-600">{sup.p}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                 <MapPin className="w-4 h-4 shrink-0" />
                 <span className="text-xs font-medium text-slate-600 truncate">{sup.a}</span>
              </div>
           </div>

           <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                 <p className="text-sm font-bold text-slate-900">{sup.products}</p>
                 <p className="text-[10px] text-slate-400 font-medium">Products</p>
              </div>
              <div className="flex items-center gap-1">
                 <button className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><Eye className="w-4.5 h-4.5" /></button>
                 <button className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"><Pencil className="w-4.5 h-4.5" /></button>
                 <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4.5 h-4.5" /></button>
              </div>
           </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default SuppliersView;
