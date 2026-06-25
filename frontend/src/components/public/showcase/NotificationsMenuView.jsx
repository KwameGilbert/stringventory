import React from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Trash2,
  CheckCircle2,
  Clock
} from "lucide-react";

/**
 * Notifications Management View
 */
const NotificationsMenuView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Notifications</h3>
        <p className="text-xs text-slate-400 font-medium">Global activity and system alerts</p>
      </div>
      <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline">Mark all as read</button>
    </div>

    <div className="space-y-3">
       {[
         { type: "stock", title: "Low Stock Alert", msg: "8 items in Electronics are below the threshold.", time: "10m ago", icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
         { type: "sale", title: "Global Tech Distribution", msg: "A new wholesale order for $12,450.00 has been confirmed.", time: "45m ago", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
         { type: "system", title: "Daily Backup Successful", msg: "All databases and assets have been synced to the primary cloud.", time: "2h ago", icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-50" },
         { type: "stock", title: "Stock Intake Received", msg: "Batch #12 from JEMPAUL VENTURES has been verified.", time: "5h ago", icon: Package, color: "text-emerald-500", bg: "bg-emerald-50" },
         { type: "critical", title: "Security Login Attempt", msg: "A login from an unrecognized device was detected in Accra.", time: "Yesterday", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" }
       ].map((note, i) => (
         <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
            <div className={`w-12 h-12 rounded-xl ${note.bg} ${note.color} flex items-center justify-center shrink-0`}>
               <note.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-sm tracking-tight">{note.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase">
                     <Clock className="w-3 h-3" /> {note.time}
                  </div>
               </div>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">{note.msg}</p>
            </div>
            <button className="p-2 text-slate-100 group-hover:text-slate-300 hover:!text-rose-500 transition-colors">
               <Trash2 className="w-5 h-5" />
            </button>
         </div>
       ))}
    </div>
  </motion.div>
);

export default NotificationsMenuView;
