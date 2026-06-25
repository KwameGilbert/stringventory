import React from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, FileText, LayoutGrid, List, Box, MoreVertical } from "lucide-react";

const CategoriesView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }} 
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="space-y-6"
  >
    {/* Categories Header */}
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Categories</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">6 categories</p>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
         <div className="flex bg-slate-100/50 p-1 rounded-xl mx-2 border border-slate-100 shadow-inner">
           <button className="p-1.5 bg-white rounded-lg shadow-sm text-slate-600"><LayoutGrid className="w-4 h-4" /></button>
           <button className="p-1.5 text-slate-400"><List className="w-4 h-4" /></button>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-black transition-all">
           + Add Category
         </button>
      </div>
    </div>

    {/* Categories Grid */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { name: "Beverages", desc: "This is the description for the Beverages", products: 4, status: "Active", type: "image", src: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=400" },
        { name: "Alcohol", desc: "This is the description for alcohol", products: 0, status: "Active", type: "image", src: "https://images.unsplash.com/photo-1569100139314-573539869680?auto=format&fit=crop&q=80&w=400" },
        { name: "Accessories", desc: "Guitar picks, capos, tuners, straps and other accessories", products: 3, status: "Active", type: "color", color: "bg-emerald-500" },
        { name: "Wind Instruments", desc: "Flutes, recorders, harmonicas and related instruments", products: 1, status: "Active", type: "color", color: "bg-amber-500" },
        { name: "Percussion", desc: "Drums, xylophones, and rhythmic instruments", products: 0, status: "Active", type: "color", color: "bg-rose-500" },
        { name: "Strings", desc: "Guitars, violins, and other string-based instruments", products: 0, status: "Active", type: "color", color: "bg-teal-500" }
      ].map((cat, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
          {/* Card Header (Image/Color) */}
          <div className={`h-40 w-full relative overflow-hidden`}>
             {cat.type === "image" ? (
               <img src={cat.src} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
             ) : (
               <div className={`w-full h-full ${cat.color} flex items-center justify-center`}>
                  <Box className="w-12 h-12 text-white/90 drop-shadow-lg" />
               </div>
             )}
             <button className="absolute top-3 right-3 p-1.5 bg-black/10 backdrop-blur-md rounded-lg text-white/80 hover:bg-black/20 transition-colors">
               <MoreVertical className="w-4 h-4" />
             </button>
          </div>
          {/* Card Body */}
          <div className="p-5 flex-1 flex flex-col">
             <h4 className="font-semibold text-slate-900 text-sm mb-1">{cat.name}</h4>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed flex-1">{cat.desc}</p>
             
             <div className="mt-6 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-900">
                  {cat.products} <span className="text-slate-400 font-medium ml-1">products</span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Active</span>
                  <div className="w-8 h-4.5 bg-emerald-500 rounded-full relative p-0.5 shadow-inner">
                     <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default CategoriesView;
