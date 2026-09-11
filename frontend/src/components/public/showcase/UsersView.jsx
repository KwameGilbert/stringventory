import React from "react";
import { motion } from "framer-motion";
import {
   UserCircle,
   ShieldCheck,
   Clock,
   Mail,
   Pencil,
   Trash2,
   Shield
} from "lucide-react";

/**
 * Team Management View
 */
const UsersView = () => (
   <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
   >
      <div className="flex justify-between items-end mb-4">
         <div>
            <h3 className="text-2xl font-semibold text-slate-900">User Management</h3>
            <p className="text-xs text-slate-400 font-medium">Manage team permissions and access levels</p>
         </div>
         <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all">
            + Invite User
         </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
         {[
            { label: "Total Team Members", value: "8", icon: UserCircle, color: "text-sky-500", bg: "bg-sky-50" },
            { label: "Admin Acccounts", value: "2", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Avg. Session Time", value: "4.2h", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
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

      <div className="grid grid-cols-2 gap-4">
         {[
            { name: "Anthony Afriyie", role: "CEO", email: "a.afriyie@pinnexventures.com", status: "Online", initial: "AA", color: "bg-emerald-500" },
            { name: "Sarah Williams", role: "Manager", email: "s.williams@pinnexventures.com", status: "Away", initial: "SW", color: "bg-sky-500" },
            { name: "John Smith", role: "Admin", email: "j.smith@pinnexventures.com", status: "Offline", initial: "JS", color: "bg-slate-500" },
            { name: "Kobby Kwame", role: "Accountant", email: "kobby@pinnexventures.com", status: "Online", initial: "KK", color: "bg-emerald-500" }
         ].map((user, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
               <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${user.color} flex items-center justify-center text-white font-bold text-xs relative shadow-lg`}>
                     {user.initial}
                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${user.status === 'Online' ? 'bg-emerald-500' : user.status === 'Away' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  </div>
                  <div>
                     <h4 className="font-semibold text-slate-900 text-sm">{user.name}</h4>
                     <div className="flex items-center gap-2 mt-1">
                        <Shield className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</span>
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400">{user.email}</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${user.status === 'Online' ? 'bg-emerald-100 text-emerald-600' :
                        user.status === 'Away' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                     {user.status}
                  </span>
                  <div className="flex items-center gap-1 mt-4">
                     <button className="p-1.5 text-slate-300 hover:text-emerald-500 rounded-lg"><Pencil className="w-4 h-4" /></button>
                     <button className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
         ))}
      </div>
   </motion.div>
);

export default UsersView;
