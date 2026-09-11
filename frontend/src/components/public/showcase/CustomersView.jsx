import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  MoreVertical,
  Award
} from "lucide-react";

/**
 * Customers Management View
 */
const CustomersView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} 
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="space-y-6"
  >
    {/* Page Header */}
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Customers</h3>
        <p className="text-xs text-slate-400 font-medium">Manage your customer relationships and loyalty</p>
      </div>
      <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
         + Add Customer
      </button>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-3 gap-4">
       {[
         { label: "Total Customers", value: "1,240", icon: Users, color: "text-sky-500", bg: "bg-sky-50" },
         { label: "Active This Month", value: "842", icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-50" },
         { label: "Loyalty Points Issued", value: "125.4k", icon: Award, color: "text-amber-500", bg: "bg-amber-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
            </div>
         </div>
       ))}
    </div>

    {/* Table Section */}
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
       <div className="p-4 border-b border-slate-50 flex gap-4">
          <div className="flex-1 relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
             <input type="text" placeholder="Search customers..." className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 outline-none" />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 flex items-center gap-2 hover:bg-slate-50 group transition-all">
             <Filter className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" /> Filter
          </button>
       </div>

       <table className="w-full text-left">
          <thead>
             <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Orders</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Points</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { name: "Johnathan Smith", email: "j.smith@gmail.com", phone: "+1 234 567 890", orders: 12, points: "450", status: "Active" },
               { name: "Sarah Williams", email: "sarah.w@outlook.com", phone: "+1 987 654 321", orders: 3, points: "85", status: "New" },
               { name: "Michael Chen", email: "m.chen@tech.co", phone: "+86 10 2345 6789", orders: 54, points: "2.3k", status: "VIP" },
               { name: "Abena Ampofowaa", email: "abena.a@gmail.com", phone: "+233 20 123 4567", orders: 8, points: "120", status: "Active" }
             ].map((usr, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                           {usr.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{usr.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400"><Mail className="w-3 h-3" /> {usr.email}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400"><Phone className="w-3 h-3" /> {usr.phone}</div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">{usr.orders}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-emerald-600">{usr.points}</td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                        usr.status === 'VIP' ? 'bg-amber-100 text-amber-600' :
                        usr.status === 'New' ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'
                     }`}>
                        {usr.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-300 hover:text-emerald-500 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-300 hover:text-slate-600 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
       
       <div className="p-4 border-t border-slate-50 bg-slate-50/20 flex justify-center">
          <p className="text-[10px] font-semibold text-slate-400">Showing 4 of 1,240 customers</p>
       </div>
    </div>
  </motion.div>
);

export default CustomersView;
