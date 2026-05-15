import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, ChevronDown } from "lucide-react";
import analyticsService from "../../../services/business/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";
import { useCurrency } from "../../../utils/currencyUtils";

const timelineOptions = ["1D", "1W", "1M", "3M", "6M", "1Y"];

const MOCK_DATA = [
  { month: "Jan", sales: 45000, purchase: 32000 },
  { month: "Feb", sales: 52000, purchase: 38000 },
  { month: "Mar", sales: 48000, purchase: 41000 },
  { month: "Apr", sales: 61000, purchase: 45000 },
  { month: "May", sales: 55000, purchase: 42000 },
  { month: "Jun", sales: 67000, purchase: 48000 },
  { month: "Jul", sales: 50000, purchase: 48000 },
  { month: "Aug", sales: 67000, purchase: 38000 },
  { month: "Sep", sales: 37000, purchase: 40000 },
];

const SalesExpensesChart = ({ dateRange }) => {
  const { symbol, formatPrice } = useCurrency();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeline, setActiveTimeline] = useState("1Y");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = getDashboardDateParams(dateRange);
        const response = await analyticsService.getDashboardOverview(params);
        const payload = response?.data || response || {};
        const dashboardData = payload?.data || payload;
        const chartRows = dashboardData?.charts?.revenueByDate || [];

        const mapped = chartRows.map((row) => ({
          month: row?.date
            ? new Date(row.date).toLocaleDateString("en-US", { month: "short" })
            : "—",
          sales: Number(row?.revenue ?? 0),
          purchase: Number(row?.expenses ?? 0),
        }));

        setData(mapped.length > 0 ? mapped : MOCK_DATA);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-xs text-slate-600 font-medium">
                {entry.name}: <span className="text-slate-900 font-bold">{symbol}{(entry.value / 1000).toFixed(1)}k</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse h-[500px]">
        <div className="h-8 bg-slate-100 rounded-lg w-1/4 mb-8"></div>
        <div className="h-64 bg-slate-50 rounded-2xl"></div>
      </div>
    );
  }

  // Calculate totals for the summary cards
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalPurchase = data.reduce((sum, item) => sum + item.purchase, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-300 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row border-b border-slate-200 p-5 justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500">
            <ShoppingCart size={22} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Sales & Expenses</h3>
        </div>

        {/* Timeline Filters */}
        <div className="flex bg-slate-50 p-1 rounded-xl">
          {timelineOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveTimeline(opt)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTimeline === opt
                  ? "bg-[#E65F2B] text-white shadow-md shadow-orange-200"
                  : "text-black hover:text-black"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Overlay Cards */}
      <div className="flex gap-4 mb-4 px-6">
        <div className="border border-slate-200 rounded-lg p-3 w-44 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 bg-[#fa5e0a] rounded-full"></div>
            <span className="text-[10px] font-semibold text-black/50 uppercase tracking-widest">Total Expenses</span>
          </div>
          <h4 className="text-xl font-bold text-black">{formatPrice(totalPurchase)}</h4>
        </div>
        <div className="border border-slate-100 rounded-lg p-3 w-44 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 bg-[#fa5e0a] rounded-full"></div>
            <span className="text-[10px] font-semibold text-black/50 uppercase tracking-widest">Total Sales</span>
          </div>
          <h4 className="text-xl font-bold text-black">{formatPrice(totalSales)}</h4>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full relative mb-6">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 400 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 400 }}
              tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#F8FAFC", radius: 8 }}
            />
            <Bar
              dataKey="purchase"
              name="Total Purchase"
              fill="#FFD4BC"
              radius={[6, 6, 6, 6]}
              barSize={30}
            />
            <Bar
              dataKey="sales"
              name="Total Sales"
              fill="#FE9F43"
              radius={[6, 6, 6, 6]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesExpensesChart;
