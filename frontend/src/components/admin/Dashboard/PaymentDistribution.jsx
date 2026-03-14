import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import orderService from "../../../services/orderService";

const PaymentDistribution = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await orderService.getOrders({ limit: 200 });
        const payload = response?.data || response || {};
        const orders = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.orders)
            ? payload.orders
            : Array.isArray(payload.data)
              ? payload.data
              : [];

        const paymentTotals = orders.reduce((accumulator, order) => {
          const method = String(order?.paymentMethod || "other").replace(/_/g, " ").trim();
          const key = method || "other";
          accumulator[key] = (accumulator[key] || 0) + Number(order?.total || 0);
          return accumulator;
        }, {});

        const normalizedData = Object.entries(paymentTotals).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

        const colors = ["#10b981", "#6366f1", "#f59e0b", "#ec4899"];
        const enhancedData = normalizedData.map((item, index) => ({
          ...item,
          color: colors[index % colors.length]
        }));
        setData(enhancedData);
      } catch (err) {
        console.error("Error fetching data", err);
        setData([]);
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

      <div className="flex-1 relative w-full" style={{ minHeight: '240px' }}>
        <ResponsiveContainer width="100%" height={240}>
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

