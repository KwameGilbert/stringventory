import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Home, 
  Lightbulb, 
  Megaphone, 
  Coffee, 
  Truck,
  MoreVertical,
  ChevronRight
} from "lucide-react";

const ExpenseCategoriesView = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Expense Categories</h3>
        <p className="text-xs text-slate-400 font-medium">Classify your operational costs for better tracking</p>
      </div>
      <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all">
         + Add Category
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      {[
        { name: "Rent & Utilities", icon: Home, count: 12, total: "$4,500.00", color: "text-sky-500", bg: "bg-sky-50" },
        { name: "Salaries & Wages", icon: Briefcase, count: 24, total: "$12,400.00", color: "text-emerald-500", bg: "bg-emerald-50" },
        { name: "Marketing", icon: Megaphone, count: 8, total: "$2,100.00", color: "text-purple-500", bg: "bg-purple-50" },
        { name: "Maintenance", icon: Lightbulb, count: 15, total: "$850.00", color: "text-amber-500", bg: "bg-amber-50" },
        { name: "Office Supplies", icon: Coffee, count: 42, total: "$420.00", color: "text-rose-500", bg: "bg-rose-50" },
        { name: "Logistics", icon: Truck, count: 19, total: "$1,230.00", color: "text-indigo-500", bg: "bg-indigo-50" }
      ].map((cat, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                 <cat.icon className="w-6 h-6" />
              </div>
              <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
           </div>
           
           <h4 className="font-semibold text-slate-900 text-sm mb-1">{cat.name}</h4>
           <div className="flex items-center justify-between mt-auto">
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} Transactions</p>
                 <p className="text-sm font-bold text-slate-900 mt-1">{cat.total}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
           </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default ExpenseCategoriesView;
