import React from "react";
import { motion } from "framer-motion";
import {
   UserPlus,
   Plus,
   Minus,
   Trash2,
   ChevronDown,
   CheckCircle2,
   Box
} from "lucide-react";

const SalesView = () => (
   <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-6"
   >
      <div className="grid grid-cols-12 gap-6">

         {/* LEFT COLUMN (2/3) */}
         <div className="col-span-8 space-y-6">

            {/* Customer Details Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                     <span className="text-slate-900 font-bold text-sm">Customer Details</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-bold uppercase transition-colors hover:bg-sky-100">
                     <Plus className="w-3.5 h-3.5" /> Add New
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <UserPlus className="w-4 h-4 text-slate-300" />
                        </div>
                        <select className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-10 py-3.5 text-xs font-bold text-slate-800 appearance-none focus:ring-2 focus:ring-sky-500/10 transition-all outline-none">
                           <option>Abena Ampofowaa Agyei</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                           <ChevronDown className="w-4 h-4 text-slate-300" />
                        </div>
                     </div>
                     <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 space-y-2">
                        <div className="flex items-center gap-3 text-slate-400">
                           <span className="text-[10px] uppercase font-bold tracking-widest w-12 shrink-0">Email</span>
                           <span className="text-xs font-bold text-slate-600 truncate">admin@melody2ghana.edu</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                           <span className="text-[10px] uppercase font-bold tracking-widest w-12 shrink-0">Phone</span>
                           <span className="text-xs font-bold text-slate-600">+233202200020</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Edit details for this sale</label>
                        <input
                           type="text"
                           placeholder="Email"
                           defaultValue="admin@melody2ghana.edu"
                           className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500/10 transition-all outline-none"
                        />
                     </div>
                     <div>
                        <input
                           type="text"
                           placeholder="Phone"
                           defaultValue="+233202200020"
                           className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500/10 transition-all outline-none"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Sale Items Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                     <ShoppingCartIcon className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-slate-900 font-bold text-sm">Sale Items</h3>
                     <p className="text-[10px] text-slate-400 font-medium">Add products to the sale</p>
                  </div>
               </div>

               <div className="flex gap-4 mb-8">
                  <div className="flex-1 relative">
                     <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-slate-400 appearance-none focus:ring-2 focus:ring-emerald-500/10 outline-none">
                        <option>Select a product...</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-slate-300" />
                     </div>
                  </div>
                  <input
                     type="number"
                     defaultValue="1"
                     className="w-20 bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500/10 outline-none"
                  />
                  <button className="px-6 py-4 bg-slate-200 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                     <Plus className="w-4 h-4" /> Add
                  </button>
               </div>

               <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50/50">
                           <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                           <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Quantity</th>
                           <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</th>
                           <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                           <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {[
                           { name: "AWAKE 500ML", qty: 1, price: "€67.00", total: "€67.00" },
                           { name: "D'Addario EXL110 Electric Guitar Strings", qty: 1, price: "€150.00", total: "€150.00" }
                        ].map((item, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                                       <Box className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{item.name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center justify-center gap-4">
                                    <button className="text-slate-300 hover:text-rose-500"><Minus className="w-3.5 h-3.5" /></button>
                                    <span className="text-xs font-bold text-slate-900">{item.qty}</span>
                                    <button className="text-slate-300 hover:text-emerald-500"><Plus className="w-3.5 h-3.5" /></button>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.price}</td>
                              <td className="px-6 py-4 text-xs font-bold text-slate-900">{item.total}</td>
                              <td className="px-6 py-4 text-right">
                                 <button className="p-2 text-rose-100 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN (1/3) */}
         <div className="col-span-4 h-fit sticky top-0">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
               <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Payment details and order totals</h3>

               <div className="space-y-6 mb-10">
                  <div>
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Payment Method</label>
                     <div className="relative">
                        <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-800 appearance-none focus:ring-2 focus:ring-slate-500/10 outline-none">
                           <option>Cash</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                           <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Discount</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                           <span className="text-[10px] font-bold text-slate-400">$</span>
                        </div>
                        <input type="text" defaultValue="0" className="w-full bg-white border border-slate-100 rounded-2xl pl-10 pr-5 py-3.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-500/10 outline-none" />
                     </div>
                  </div>

                  <div>
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Tax Rate (%)</label>
                     <input type="text" defaultValue="0" className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-slate-500/10 outline-none" />
                  </div>
               </div>

               <div className="space-y-3 mb-8 px-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                     <span>Subtotal</span>
                     <span>€217.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                     <span>Discount</span>
                     <span>-€0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                     <span>Tax (0%)</span>
                     <span>€0.00</span>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-900">Total</span>
                     <span className="text-xl font-bold text-slate-900 leading-none">€217.00</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <button className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">
                     Cancel
                  </button>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                     <CheckCircle2 className="w-5 h-5" /> Complete Sale
                  </button>
               </div>
            </div>
         </div>
      </div>
   </motion.div>
);

const ShoppingCartIcon = ({ className }) => (
   <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
   </svg>
);

export default SalesView;
