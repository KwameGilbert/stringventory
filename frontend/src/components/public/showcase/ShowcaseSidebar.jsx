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
    <aside className="w-full md:w-[240px] bg-slate-900 border-b md:border-b-0 md:border-r border-[#333] flex flex-row md:flex-col items-center md:items-stretch h-14 md:h-full shrink-0 z-20 relative overflow-hidden">
      {/* macOS WINDOW BUTTONS - Desktop Only */}
      <div className="hidden md:flex p-6 pb-2 items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* BRANDING - Desktop Only */}
      <div className="hidden md:flex p-6 pt-4 mb-4 items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />
        </div>
        <span className="text-white font-bold text-sm tracking-tight">PinnexVentures</span>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 flex flex-row md:flex-col px-3 gap-1 md:space-y-1 overflow-x-auto md:overflow-y-auto custom-scrollbar-dark no-scrollbar h-full items-center md:items-stretch">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 md:gap-3 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl transition-all relative group shrink-0 ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight md:tracking-[0.1em]">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 md:bottom-auto md:left-0 h-0.5 md:h-5 w-full md:w-1 bg-emerald-500 rounded-t-full md:rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER SECTION - Desktop Only */}
      <div className="hidden md:block p-4 space-y-3 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3.5 bg-slate-800 border border-slate-700/50 rounded-2xl text-[10px] font-bold text-slate-300">
            <Bell className="w-4 h-4 text-slate-500" /> Notifications
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 bg-rose-500 rounded-2xl text-[10px] font-bold text-white shadow-lg shadow-rose-500/20">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <div className="bg-slate-800/60 rounded-[1.8rem] p-4 flex items-center justify-between group cursor-pointer border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner">AA</div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-white">Anthony Afriyie</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">CEO</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </aside>
  );
};

export default ShowcaseSidebar;
