import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const PaymentDistribution = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/payment-method.json");
        const colors = ["#10b981", "#6366f1", "#f59e0b", "#ec4899"];
        const enhancedData = response.data.map((item, index) => ({
          ...item,
          color: colors[index % colors.length]
        }));
        setData(enhancedData);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-48 bg-gray-100 rounded-full mx-auto w-48 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Revenue by Payment</h3>
      </div>

      <div className="flex-1 relative w-full min-h-[200px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
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
          <span className="text-gray-400 text-xs">Total</span>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((entry, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50"
          >
            <span 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium text-gray-600 truncate">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentDistribution;

