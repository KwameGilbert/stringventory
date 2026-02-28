import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import analyticsService from "../../../services/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-xs border border-gray-100 shadow-lg rounded-lg p-3">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-gray-600">
          Revenue: <span className="font-bold text-gray-900">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = getDashboardDateParams(dateRange);
        const response = await analyticsService.getDashboardOverview(params);
        const payload = response?.data || response || {};
        const dashboardData = payload?.data || payload;
        const rows = dashboardData?.charts?.revenueByDate || [];

        setData(
          rows.map((row) => ({
            month: row?.date
              ? new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "—",
            revenue: Number(row?.revenue ?? 0),
          }))
        );
      } catch (err) {
        console.error("Error fetching revenue data", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Revenue Over Time</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-gray-500">Revenue</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              dy={10}
            />
            
            <YAxis
              tickFormatter={(value) => value === 0 ? "$0" : `$${value / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              dx={-10}
              width={50}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
