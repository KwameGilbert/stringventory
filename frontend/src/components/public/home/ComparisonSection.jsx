import React from "react";
import { motion } from "framer-motion";
import { Check, Minus, Zap } from "lucide-react";

/**
 * Detailed Plan Comparison Section
 * A high-fidelity table comparing all features across tiers.
 */
const ComparisonSection = () => {
  const categories = [
    {
      name: "Stock Management",
      features: [
        { name: "Product Limit", basic: "500", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Bulk Import/Export", basic: true, pro: true, enterprise: true },
        { name: "Low Stock Alerts", basic: true, pro: true, enterprise: true },
        { name: "Barcode Generation", basic: false, pro: true, enterprise: true },
        { name: "Multi-location Support", basic: "1 Store", pro: "5 Stores", enterprise: "Unlimited" },
      ]
    },
    {
      name: "Sales & CRM",
      features: [
        { name: "Point of Sale (POS)", basic: true, pro: true, enterprise: true },
        { name: "Customer Profiles", basic: "Basic", pro: "Advanced", enterprise: "Enterprise" },
        { name: "Bulk Discounts", basic: false, pro: true, enterprise: true },
        { name: "Refund Tracking", basic: true, pro: true, enterprise: true },
        { name: "Loyalty Programs", basic: false, pro: false, enterprise: true },
      ]
    },
    {
      name: "Analytics & Finance",
      features: [
        { name: "Sales Reports", basic: "Basic", pro: "Detailed", enterprise: "Custom" },
        { name: "Expense Tracking", basic: true, pro: true, enterprise: true },
        { name: "Profit/Loss Summary", basic: false, pro: true, enterprise: true },
        { name: "Inventory Forecasting", basic: false, pro: true, enterprise: true },
        { name: "Tax Management", basic: "Basic", pro: "Multi-Tax", enterprise: "Custom" },
      ]
    },
    {
      name: "Support & Security",
      features: [
        { name: "Email Support", basic: true, pro: true, enterprise: true },
        { name: "Priority Support", basic: false, pro: "24/7 Priority", enterprise: "Dedicated Manager" },
        { name: "Custom API Access", basic: false, pro: false, enterprise: true },
        { name: "User Roles", basic: "2 Roles", pro: "5 Roles", enterprise: "Custom" },
        { name: "SLA Guarantee", basic: false, pro: false, enterprise: "99.9%" },
      ]
    }
  ];

  const RenderValue = ({ val }) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
      ) : (
        <Minus className="w-5 h-5 text-slate-200 mx-auto" />
      );
    }
    return <span className="text-sm font-semibold text-slate-700">{val}</span>;
  };

  return (
    <section className="py-14 bg-white max-w-8xl mx-auto px-20" id="comparison">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 border border-emerald-200 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">Detailed Comparison</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Pick the Perfect <span className="text-emerald-600">Scale</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Compare every feature across our plans and choose the one that fits your business stage.
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-x-auto rounded-[1.8rem] border border-slate-100 shadow-xl">
           <table className="w-full text-center border-collapse bg-white min-w-[800px]">
              <thead>
                 <tr className="bg-slate-900 text-white">
                    <th className="px-8 py-6 text-left text-lg font-bold">Features</th>
                    <th className="px-8 py-6">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Basic</p>
                       <p className="text-2xl font-bold">$29<span className="text-xs text-slate-500 font-medium lowercase">/mo</span></p>
                    </th>
                    <th className="px-8 py-6 relative">
                       <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                          Most Popular
                       </div>
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Professional</p>
                       <p className="text-2xl font-bold">$79<span className="text-xs text-slate-500 font-medium lowercase">/mo</span></p>
                    </th>
                    <th className="px-8 py-6">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Enterprise</p>
                       <p className="text-2xl font-bold">$199<span className="text-xs text-slate-500 font-medium lowercase">/mo</span></p>
                    </th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {categories.map((cat, idx) => (
                    <React.Fragment key={idx}>
                       <tr className="bg-slate-50/50">
                          <td colSpan="4" className="px-8 py-4 text-left font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400 border-t border-slate-100">
                             {cat.name}
                          </td>
                       </tr>
                       {cat.features.map((f, i) => (
                          <tr key={i} className="group hover:bg-emerald-50/30 transition-colors">
                             <td className="px-8 py-6 text-left font-bold text-slate-800 text-sm">{f.name}</td>
                             <td className="px-8 py-6"><RenderValue val={f.basic} /></td>
                             <td className="px-8 py-6 bg-emerald-50/20 group-hover:bg-emerald-50/50 transition-colors"><RenderValue val={f.pro} /></td>
                             <td className="px-8 py-6"><RenderValue val={f.enterprise} /></td>
                          </tr>
                       ))}
                    </React.Fragment>
                 ))}
                 {/* Bottom Static CTA Bar */}
                 <tr className="bg-slate-900 border-none">
                    <td className="px-8 py-6 text-left text-white">
                       <p className="text-sm font-bold">Ready to scale your inventory?</p>
                    </td>
                    <td className="px-8 py-6">
                       <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-all">Select</button>
                    </td>
                    <td className="px-8 py-6 bg-emerald-500 shadow-xl">
                       <button className="px-6 py-2.5 rounded-xl bg-white text-emerald-600 shadow-lg shadow-emerald-900/10 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95">Upgrade to Pro</button>
                    </td>
                    <td className="px-8 py-6">
                       <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-all">Contact Sales</button>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
