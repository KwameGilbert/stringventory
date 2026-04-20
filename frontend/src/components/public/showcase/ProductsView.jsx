import React from "react";
import { motion } from "framer-motion";
import { Filter, MoreVertical } from "lucide-react";

const ProductsView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
  >
    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
      <h3 className="font-bold text-slate-900 text-sm">Inventory List</h3>
      <div className="flex gap-2">
         <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><Filter className="w-4 h-4" /></button>
         <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-semibold rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">+ Add Product</button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Product Name</th>
            <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Category</th>
            <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Stock</th>
            <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Price</th>
            <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { name: "Premium Wireless Headset", cat: "Electronics", stock: 45, price: "$299" },
            { name: "Modern Desk Lamp", cat: "Home", stock: 12, price: "$89" },
            { name: "Ergonomic Office Chair", cat: "Furniture", stock: 8, price: "$450" },
            { name: "Leather Travel Bag", cat: "Accessories", stock: 24, price: "$180" },
            { name: "Glass Water Bottle", cat: "Kitchen", stock: 154, price: "$25" }
          ].map((item, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors cursor-default">
              <td className="px-6 py-4 font-bold text-slate-800 text-xs">{item.name}</td>
              <td className="px-6 py-4 text-xs text-slate-500 font-medium">{item.cat}</td>
              <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                 <span className={item.stock < 10 ? 'text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full' : ''}>{item.stock}</span>
              </td>
              <td className="px-6 py-4 font-semibold text-slate-900 text-xs">{item.price}</td>
              <td className="px-6 py-4 text-right"><MoreVertical className="w-4 h-4 text-slate-300 ml-auto" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default ProductsView;
