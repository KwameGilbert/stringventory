import { useState, useEffect } from "react";
import { Package, ChevronDown, Layers } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import analyticsService from "../../../services/business/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const MOCK_CATEGORIES = [
  { name: "Electronics", sales: 698, percentage: 50, color: "#f97316" },
  { name: "Sports", sales: 545, percentage: 24, color: "#ea580c" },
  { name: "Lifestyles", sales: 456, percentage: 16, color: "#0f172a" },
];

const TopCategories = ({ dateRange }) => {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [data, setData] = useState(MOCK_CATEGORIES);
  const [stats, setStats] = useState({ totalCategories: 698, totalProducts: 7899 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const params = getDashboardDateParams(dateRange);
        const res = await analyticsService.getInventoryReport(params);
        const payload = res?.data || res || {};
        const inventoryData = payload?.data || payload;

        const byCategory = inventoryData?.byCategory || [];
        if (byCategory.length > 0) {
          const sorted = [...byCategory].sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));
          const top3 = sorted.slice(0, 3);
          const totalQty = top3.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0) || 1;

          const colors = ["#f97316", "#ea580c", "#0f172a"];
          const mapped = top3.map((cat, idx) => ({
            name: cat.categoryName || `Category ${idx + 1}`,
            sales: Number(cat.quantity || 0),
            percentage: Math.round((Number(cat.quantity || 0) / totalQty) * 100),
            color: colors[idx % colors.length],
          }));

          setData(mapped.length > 0 ? mapped : MOCK_CATEGORIES);
          setStats({
            totalCategories: Number(inventoryData?.summary?.totalCategories || byCategory.length || 698),
            totalProducts: Number(inventoryData?.summary?.totalProducts || 7899),
          });
          return;
        }
        setData(MOCK_CATEGORIES);
      } catch (err) {
        console.error("Failed to fetch top categories:", err);
        setData(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [dateRange, timeframe]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs font-bold shadow-xl border border-slate-700">
          <p className="text-orange-400">{data.name}</p>
          <p className="text-slate-200 mt-0.5">{data.sales} Sales ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-500 shrink-0 shadow-xs">
              <Layers size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Categories</h3>
          </div>
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Chart & Legend Row */}
        <div className="grid grid-cols-12 items-center gap-4 mb-8">
          <div className="col-span-7 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="sales"
                  cornerRadius={6}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Percentage Badges hovering */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-slate-200 px-2 py-1 rounded-full shadow-md text-[11px] font-extrabold text-slate-700 animate-pulse">
              16%
            </div>
            <div className="absolute bottom-12 right-2 bg-white/90 backdrop-blur-xs border border-slate-200 px-2 py-1 rounded-full shadow-md text-[11px] font-extrabold text-slate-700">
              24%
            </div>
            <div className="absolute bottom-6 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 px-2 py-1 rounded-full shadow-md text-[11px] font-extrabold text-slate-700">
              50%
            </div>
          </div>

          {/* Legend */}
          <div className="col-span-5 space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-4 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-xs font-bold text-slate-500">{item.name}</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {item.sales} <span className="text-xs font-medium text-slate-400">Sales</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Box */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 mb-3 tracking-wide">Category Statistics</h4>
          <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-600">Total Number Of Categories</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{stats.totalCategories}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-bold text-slate-600">Total Number Of Products</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">{stats.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
