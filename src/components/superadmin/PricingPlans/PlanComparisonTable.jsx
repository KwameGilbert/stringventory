import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Zap, Info } from 'lucide-react';

/**
 * Superadmin Plan Comparison Table
 * High-fidelity matrix for comparing features across subscription tiers.
 */
const PlanComparisonTable = ({ comparisonData }) => {
  const RenderValue = ({ val }) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Minus className="w-4 h-4 text-slate-200" />
        </div>
      );
    }
    return <span className="text-sm font-bold text-slate-700">{val}</span>;
  };

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No comparison data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Feature Matrix</h2>
          <p className="text-sm text-slate-500">Comparing functionality across all system plans</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Live Preview</span>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-center border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-widest bg-slate-950/50">Features</th>
                <th className="px-8 py-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starter</p>
                  <p className="text-lg font-bold font-mono">$99</p>
                </th>
                <th className="px-8 py-6 relative">
                  <div className="absolute top-0 right-0 p-1">
                    <div className="bg-emerald-500 text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter">Popular</div>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Professional</p>
                  <p className="text-lg font-bold font-mono">$450</p>
                </th>
                <th className="px-8 py-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Enterprise</p>
                  <p className="text-lg font-bold font-mono">$1,500</p>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {comparisonData.map((cat, idx) => (
                <React.Fragment key={idx}>
                  <tr className="bg-slate-50/80">
                    <td colSpan="4" className="px-8 py-4 text-left font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.features.map((f, i) => (
                    <tr key={i} className="group hover:bg-emerald-50/30 transition-colors">
                      <td className="px-8 py-5 text-left">
                        <p className="text-sm font-bold text-slate-700 underline decoration-slate-100 underline-offset-4 decoration-2">{f.name}</p>
                      </td>
                      <td className="px-8 py-5"><RenderValue val={f.starter} /></td>
                      <td className="px-8 py-5 bg-emerald-50/20 group-hover:bg-emerald-50/50 transition-colors">
                        <RenderValue val={f.pro} />
                      </td>
                      <td className="px-8 py-5"><RenderValue val={f.enterprise} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-900 px-8 py-4 flex items-center justify-between text-white/50">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-medium italic">Changes here are reflected instantly on the public website.</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest">Pricing Strategy V2.4</p>
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonTable;
