import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Package, BarChart2, Table as TableIcon } from "lucide-react";
import analyticsService from "../../../services/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const TopProductsChart = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("chart"); // 'chart' or 'table'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          ...getDashboardDateParams(dateRange),
          groupBy: "daily",
        };
        const response = await analyticsService.getSalesReport(params);
        const payload = response?.data || response || {};
        const reportData = payload?.data || payload;
        const products = reportData?.byProduct || [];

        const chartData = products.slice(0, 8).map((product) => {
          const fullName = product?.productName || "Unknown Product";
          return {
            name: fullName.substring(0, 15) + (fullName.length > 15 ? "..." : ""),
            fullName,
            sales: Number(product?.revenue ?? 0),
            units: Number(product?.quantity ?? product?.sales ?? 0),
            revenue: Number(product?.revenue ?? 0),
          };
        });

        setData(chartData);
      } catch (error) {
        console.error("Error fetching top products:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const COLORS = [
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#14b8a6",
    "#06b6d4",
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {data.fullName}
          </p>
          <p className="text-sm text-emerald-600">
            <span className="font-medium">Revenue:</span>{" "}
            {formatCurrency(data.sales)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Units Sold:</span> {data.units}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Top Selling Products
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Best performers by revenue
          </p>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
                onClick={() => setViewMode("chart")}
                className={`p-1.5 rounded-md transition-all ${
                    viewMode === "chart" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
                title="Chart View"
            >
                <BarChart2 size={16} />
            </button>
            <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all ${
                    viewMode === "table" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
                title="Table View"
            >
                <TableIcon size={16} />
            </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-hidden animate-fade-in">
            <table className="w-full">
            <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Units</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-xs">
                        #{index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none" title={item.fullName}>
                        {item.fullName}
                        </span>
                    </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {item.units}
                    </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(item.sales)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      ) : (
        <div className="animate-fade-in">
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopProductsChart;
