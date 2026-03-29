import { useEffect, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import analyticsService from "../../../services/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const PaymentDistribution = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = getDashboardDateParams(dateRange);
        const response = await analyticsService.getDashboardOverview(params);
        const payload = response?.data || response || {};
        const dashboardData = payload?.data || payload;
        
        // Match the official response structure: data.charts.revenueByPaymentMethod
        const distribution = dashboardData?.charts?.revenueByPaymentMethod || [];

        const normalizedData = distribution.map(item => {
          const rawMethod = item.paymentMethod || "Unknown";
          const name = String(rawMethod).replace(/_/g, " ").trim();
          return {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Math.abs(Number(item.revenue || 0)), // Ensure absolute value for PieChart
          };
        });

        const colors = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6"];
        const enhancedData = normalizedData.map((item, index) => ({
          ...item,
          color: colors[index % colors.length]
        }));
        setData(enhancedData);
      } catch (err) {
        console.error("Error fetching payment distribution analytics", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gray-200 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col items-center justify-center text-center">
         <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-gray-300" />
         </div>
         <p className="text-sm font-medium text-gray-900 mb-1">No transaction data</p>
         <p className="text-xs text-gray-400">Payment distribution will appear as sales are recorded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Revenue by Payment Method</h3>
      </div>

      <div className="flex-1 relative w-full" style={{ minHeight: '350px' }}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((entry, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-colors group"
          >
            <span 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-semibold text-gray-600 truncate">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentDistribution;

