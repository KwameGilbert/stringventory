import React from "react";
import { Search, Calendar, Bell } from "lucide-react";

const ShowcaseHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0">
       <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-sm group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Quick search..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-2 text-xs font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
             />
          </div>
       </div>
       <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
             <Calendar className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Oct 2024</span>
          </button>
          <button className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 relative">
             <Bell className="w-4 h-4" />
             <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 border border-white rounded-full" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20" />
       </div>
    </header>
  );
};

export default ShowcaseHeader;
