import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Globe, 
  Lock, 
  User, 
  Bell, 
  Palette, 
  DollarSign,
  ChevronRight,
  ShieldIcon
} from "lucide-react";

/**
 * Tabbed Settings View
 */
const SettingsView = () => {
  const [activeSubTab, setActiveSubTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "business", label: "Business Profile", icon: Globe },
    { id: "account", label: "Account & Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Settings</h3>
          <p className="text-xs text-slate-400 font-medium">Configure your workspace and global preferences</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sub-tabs Sidebar */}
        <div className="w-56 space-y-1">
           {tabs.map((tab) => {
             const Icon = tab.icon;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveSubTab(tab.id)}
                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                   activeSubTab === tab.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{tab.label}</span>
                 </div>
                 {activeSubTab === tab.id && <ChevronRight className="w-4 h-4" />}
               </button>
             );
           })}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-8 max-w-2xl">
           {activeSubTab === 'general' && (
             <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                   <h4 className="font-bold text-slate-800 text-sm mb-6">General Preferences</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                         <div>
                            <p className="text-xs font-bold text-slate-800">Primary Currency</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Used for all financial reports and transactions.</p>
                         </div>
                         <select className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-4 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500/10">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                            <option>GHS (₵)</option>
                         </select>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                         <div>
                            <p className="text-xs font-bold text-slate-800">Timezone</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Your local time for scheduling and intake.</p>
                         </div>
                         <select className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-4 py-1.5 outline-none">
                            <option>(GMT+00:00) Accra</option>
                            <option>(GMT-05:00) Eastern Time</option>
                         </select>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                         <div>
                            <p className="text-xs font-bold text-slate-800">Dark Mode</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Toggle between light and dark themes.</p>
                         </div>
                         <div className="w-10 h-5 bg-slate-200 rounded-full relative p-0.5">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}

           {activeSubTab === 'business' && (
             <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h4 className="font-bold text-slate-800 text-sm mb-6">Business Profile</h4>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Business Name</label>
                         <input type="text" defaultValue="StringVentory Inc." className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/10" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Registration ID</label>
                         <input type="text" defaultValue="RG-12458092" className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/10" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Address</label>
                      <textarea rows="3" className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/10 resize-none">14 Ring Road Central, Accra, Ghana</textarea>
                   </div>
                </div>
             </motion.div>
           )}

           <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button className="px-6 py-2 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Discard Changes</button>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-semibold uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all">Save Configuration</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
