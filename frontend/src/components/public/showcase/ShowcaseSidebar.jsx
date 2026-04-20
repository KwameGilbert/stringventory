import React from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, ChevronRight } from "lucide-react";

/**
 * Enhanced Showcase Sidebar
 * Features a scrollable menu and a high-fidelity footer with 
 * Action buttons (Notifications/Logout) and User Profile card.
 */
const ShowcaseSidebar = ({ menuItems, activeTab, setActiveTab }) => {
  return (
    <aside className="w-[240px] bg-slate-900 border-r border-[#333] flex flex-col h-full shrink-0 z-20 relative">
      {/* macOS WINDOW BUTTONS */}
      <div className="p-6 pb-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* BRANDING */}
      <div className="p-6 pt-4 mb-4 flex items-center gap-3">
         <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
           <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />
         </div>
         <span className="text-white font-black text-sm tracking-tight">Stringventory</span>
      </div>

      {/* NAVIGATION MENU (SCROLLABLE) */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar-dark pb-8">
        {/* Section Heading? (Optional, based on complexity) */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all relative group ${
                isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{item.label}</span>
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

      {/* FOOTER SECTION */}
      <div className="p-4 space-y-3 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        
        {/* ACTION BUTTONS (Notifications / Logout) */}
        <div className="grid grid-cols-2 gap-3">
           <button className="flex items-center justify-center gap-2 py-3.5 bg-slate-800 border border-slate-700/50 rounded-2xl text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors uppercase tracking-tight">
              <Bell className="w-4 h-4 text-slate-500" /> Notifications
           </button>
           <button className="flex items-center justify-center gap-2 py-3.5 bg-rose-500 rounded-2xl text-[10px] font-bold text-white hover:bg-rose-600 transition-colors uppercase tracking-tight shadow-lg shadow-rose-500/20">
              <LogOut className="w-4 h-4" /> Logout
           </button>
        </div>

        {/* USER PROFILE CARD */}
        <div className="bg-slate-800/60 rounded-[1.8rem] p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all border border-slate-700/30">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <div className="w-11 h-11 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-black text-slate-300 shadow-inner">
                    AA
                 </div>
                 <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#2a2a2a]" />
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black text-white leading-tight">Anthony Afriyie</span>
                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">CEO</span>
              </div>
           </div>
           <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </aside>
  );
};

export default ShowcaseSidebar;
