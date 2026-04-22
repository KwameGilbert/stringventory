import React from "react";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, 
  FileText, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Pencil, 
  Trash2,
  Box
} from "lucide-react";

const ProductsView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header Section */}
    <div className="flex justify-between items-end mb-4">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Products</h3>
        <p className="text-xs text-slate-400 font-medium">17 products in inventory</p>
      </div>
      <div className="flex items-center gap-2">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 transition-all">
           <FileSpreadsheet className="w-4 h-4" /> Excel
         </button>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-semibold text-rose-500 shadow-sm hover:bg-slate-50 transition-all">
           <FileText className="w-4 h-4" /> PDF
         </button>
         <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-black transition-all">
           + Add Product
         </button>
      </div>
    </div>

    {/* Search & Filter Bar */}
    <div className="flex gap-4">
       <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/20 transition-all outline-none"
          />
       </div>
       <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4 text-slate-400" />
          All Categories
       </button>
    </div>

    {/* Stat Cards Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {[
         { label: "Total Products", value: "17", icon: Package, color: "text-sky-500", bg: "bg-sky-50" },
         { label: "Active Products", value: "17", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
         { label: "Low Stock Items", value: "0", sub: "+12 out of stock", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" }
       ].map((stat, i) => (
         <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
               <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
               <p className="text-[8px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <div className="flex items-baseline gap-2">
                  <h4 className="text-lg md:text-2xl font-bold text-slate-900">{stat.value}</h4>
                  {stat.sub && <p className="text-[8px] md:text-[10px] font-bold text-rose-500 hidden md:block">{stat.sub}</p>}
               </div>
            </div>
         </div>
       ))}
    </div>

    {/* Products Table */}
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar min-h-[400px]">
       <table className="w-full text-left min-w-[1000px]">
          <thead>
             <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {[
               { name: "AWAKE 500ML", sku: "SKU-5252D4", cat: "Beverages", sup: "JEMPAUL VENTURES", cost: "€4.61", price: "€5.15", stock: 700, status: "In Stock" },
               { name: "Awake 750ml", sku: "SKU-331C7E", cat: "Beverages", sup: "JEMPAUL VENTURES", cost: "€5.38", price: "€6.07", stock: 0, status: "Out of Stock" },
               { name: "Boss TU-3 Chromatic Tuner Pedal", sku: "ELC-BOSTU3", cat: "Unknown", sup: "Pro Sound Imports", cost: "€7.68", price: "€11.53", stock: 0, status: "Out of Stock" },
               { name: "D'Addario EXL110 Electric Guitar Strings", sku: "STR-EXL110", cat: "Unknown", sup: "D'Addario Africa Ltd", cost: "€9.22", price: "€11.53", stock: 200, status: "In Stock" }
             ].map((prod, i) => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                           <Box className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-800">{prod.name}</p>
                           <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{prod.sku}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{prod.sku.replace("SKU-", "")}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-500">{prod.cat}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-500 max-w-[120px] truncate">{prod.sup}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{prod.cost}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{prod.price}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-900">{prod.stock}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                        prod.status === 'In Stock' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-500'
                     }`}>
                        {prod.status}
                     </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"><Pencil className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </td>
               </tr>
             ))}
          </tbody>
       </table>
    </div>
  </motion.div>
);

export default ProductsView;
