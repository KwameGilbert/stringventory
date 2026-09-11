import { useMemo } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useCurrency } from "../../../utils/currencyUtils";

const PaymentDistribution = ({ dashboardData, dashboardLoading, dateRange }) => {
  const { formatPrice } = useCurrency();

  // Derive payment breakdown from shared dashboardData prop — no separate fetch needed
  const data = useMemo(() => {
    const distribution = dashboardData?.charts?.revenueByPaymentMethod || [];
    const colors = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6"];
    return distribution.map((item, index) => {
      const rawMethod = item.paymentMethod || "Unknown";
      const name = String(rawMethod).replace(/_/g, " ").trim();
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.abs(Number(item.revenue || 0)),
        color: colors[index % colors.length],
      };
    });
  }, [dashboardData]);

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  // Replaced local formatCurrency with useCurrency's formatPrice logic

  if (dashboardLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 h-[400px] flex items-center justify-center shadow-xs">
        <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
            <CreditCard size={20} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight truncate">Payment Methods</h3>
        </div>

        <div className="relative w-full py-2" style={{ minHeight: '260px' }}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatPrice(value)}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Total</span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">{formatPrice(totalValue)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.map((entry, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-colors group"
            >
              <span 
                className="w-3 h-3 rounded-full shrink-0 group-hover:scale-125 transition-transform" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-bold text-slate-700 truncate">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentDistribution;

