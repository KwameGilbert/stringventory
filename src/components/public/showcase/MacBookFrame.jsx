import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Box } from "lucide-react";

const MacBookFrame = ({ sidebar, children }) => {
  return (
    <div className="relative w-full max-w-6xl px-4 md:px-0">
      {/* FLOATING ELEMENTS */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-12 -right-16 z-30 hidden lg:block"
      >
         <div className="bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase mb-0.5">Live Sale Alert</p>
              <p className="text-lg font-semibold text-slate-800">+$2,450.00</p>
            </div>
         </div>
      </motion.div>

      <motion.div 
         animate={{ y: [0, 10, 0] }} 
         transition={{ duration: 5, repeat: Infinity, delay: 1 }}
         className="absolute bottom-20 -left-20 z-30 hidden lg:block"
      >
         <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl border border-slate-700 shadow-2xl flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-400 uppercase mb-0.5">Inventory Check</p>
              <p className="text-lg font-semibold">12 Items Low Stock</p>
            </div>
         </div>
      </motion.div>

      {/* MACBOOK FRAME */}
      <div className="relative w-full overflow-hidden md:overflow-visible flex flex-col items-center">
         {/* SCREEN CONTAINER WITH ASPECT RATIO */}
         <div className="relative w-full aspect-[16/10] bg-[#1e1e1e] rounded-[1.5rem] md:rounded-[3rem] p-1 md:p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-[#2a2a2a] overflow-hidden">
            <div className="bg-white h-full w-full rounded-[1rem] md:rounded-[2.2rem] overflow-hidden flex border border-[#333]">
               {sidebar}
               {children}
            </div>

            {/* REFLECTION OVERLAY */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
         </div>

         {/* BASE */}
         {/* <div className="relative w-[110%] -mt-1 h-6 bg-[#2a2a2a] rounded-b-2xl shadow-2xl flex justify-center border-t border-white/5">
            <div className="w-40 h-1.5 bg-black/40 rounded-full mt-1.5" />
         </div> */}
      </div>

      {/* SHADOW FOR MACBOOK BASE */}
      {/* <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/5 blur-3xl rounded-full -z-10" /> */}
    </div>
  );
};

export default MacBookFrame;
