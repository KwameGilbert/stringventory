import React from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Phone, 
  Video,
  ChevronLeft
} from "lucide-react";

/**
 * Simulated Chat Interface
 */
const MessagingView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} 
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="h-[calc(100vh-14rem)] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex"
  >
    {/* Contacts List */}
    <div className="w-72 border-r border-slate-100 flex flex-col">
       <div className="p-6 border-b border-slate-50">
          <h4 className="font-semibold text-slate-900 text-sm mb-4">Messages</h4>
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
             <input type="text" placeholder="Search chats..." className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-[11px] font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 outline-none" />
          </div>
       </div>
       <div className="flex-1 overflow-y-auto custom-scrollbar">
          {[
            { name: "Support Team", msg: "Your ticket #124 has been resolved.", time: "10m ago", active: true, online: true },
            { name: "Johnathan Smith", msg: "When will the new stock arrive?", time: "2h ago", active: false, online: true },
            { name: "Sarah Williams", msg: "I've sent the monthly reports.", time: "4h ago", active: false, online: false },
            { name: "Marketing Dept", msg: "New campaign assets are ready.", time: "Yesterday", active: false, online: false },
            { name: "Michael Chen", msg: "See you at the meeting.", time: "Yesterday", active: false, online: true }
          ].map((chat, i) => (
             <div key={i} className={`p-4 flex gap-3 cursor-pointer border-b border-slate-50 transition-colors ${chat.active ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                <div className="relative">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400">
                      {chat.name.charAt(0)}
                   </div>
                   {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-0.5">
                      <h5 className="font-bold text-slate-900 text-[11px] truncate">{chat.name}</h5>
                      <span className="text-[9px] text-slate-300 font-medium whitespace-nowrap">{chat.time}</span>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium truncate leading-tight">{chat.msg}</p>
                </div>
             </div>
          ))}
       </div>
    </div>

    {/* Chat Window */}
    <div className="flex-1 flex flex-col bg-slate-50/30">
       <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
             <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">S</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
             </div>
             <div>
                <h4 className="font-bold text-slate-900 text-sm">Support Team</h4>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Online</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all"><Video className="w-4.5 h-4.5" /></button>
             <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all"><Phone className="w-4.5 h-4.5" /></button>
             <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all"><MoreVertical className="w-4.5 h-4.5" /></button>
          </div>
       </div>

       <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div className="flex justify-center"><div className="bg-slate-100 text-slate-400 text-[9px] font-bold py-1 px-3 rounded-full uppercase tracking-widest">Today</div></div>
          
          <div className="flex gap-4 max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white shrink-0">S</div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-xs font-medium text-slate-600 leading-relaxed">
                Hello Anthony! We've successfully updated your inventory sync settings. You should now see real-time updates across all your outlets.
             </div>
          </div>

          <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white shrink-0">AA</div>
             <div className="bg-slate-900 p-4 rounded-2xl rounded-tr-none text-xs font-medium text-slate-100 leading-relaxed shadow-lg shadow-slate-900/10">
                That's great news! Does this also include the mobile warehouse reports?
             </div>
          </div>

          <div className="flex gap-4 max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white shrink-0">S</div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-xs font-medium text-slate-600 leading-relaxed">
                Yes, everything is included. Your ticket #124 has been marked as resolved. Let us know if you need anything else!
             </div>
          </div>
       </div>

       <div className="p-6 bg-white border-t border-slate-100 flex items-end gap-3 px-8">
          <div className="flex-1 bg-slate-50 rounded-2xl p-2 flex items-end">
             <button className="p-2 text-slate-400 hover:text-emerald-500 rounded-lg"><Paperclip className="w-5 h-5" /></button>
             <textarea rows="1" placeholder="Type your message..." className="flex-1 bg-transparent border-none py-2 px-2 text-xs font-medium placeholder:text-slate-300 focus:ring-0 resize-none max-h-32" />
             <button className="p-2 text-slate-400 hover:text-emerald-500 rounded-lg"><Smile className="w-5 h-5" /></button>
          </div>
          <button className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">
             <Send className="w-5 h-5" />
          </button>
       </div>
    </div>
  </motion.div>
);

export default MessagingView;
