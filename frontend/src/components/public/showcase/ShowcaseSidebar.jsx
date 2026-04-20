import React from "react";
import { motion } from "framer-motion";

const ShowcaseSidebar = ({ menuItems, activeTab, setActiveTab }) => {
  return (
    <aside className="w-[220px] bg-slate-900 border-r border-[#333] flex flex-col h-full shrink-0 z-20 relative">
      {/* macOS BUTTONS */}
      <div className="p-6 flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      <div className="px-6 mb-8 flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
           <div className="w-4 h-4 bg-white rotate-45" />
         </div>
         <span className="text-white font-semibold text-xs tracking-tighter uppercase leading-none">STRINGVENTORY</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all relative group ${
                isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="navIndicator" 
                  className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" 
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
           <p className="text-[9px] text-slate-400 font-bold uppercase mb-2 leading-none">System Status</p>
           <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500">Operational</span>
           </div>
           <p className="text-[8px] text-slate-500 leading-tight">Last sync 2m ago. All services healthy.</p>
        </div>
      </div>
    </aside>
  );
};

export default ShowcaseSidebar;
