import { useState, useEffect } from "react";
import { Package, ChevronDown, Layers } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import analyticsService from "../../../services/business/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";


const TopCategories = ({ dateRange }) => {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalCategories: 0, totalProducts: 0 });
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

          setData(mapped);
          setStats({
            totalCategories: Number(inventoryData?.summary?.totalCategories || byCategory.length || 0),
            totalProducts: Number(inventoryData?.summary?.totalProducts || 0),
          });
          return;
        }
        setData([]);
      } catch (err) {
        console.error("Failed to fetch top categories:", err);
        setData([]);
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
        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs font-semibold shadow-xl border border-slate-700">
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
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-xl text-pink-600 shrink-0 shadow-xs">
              <Layers size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Top Categories</h3>
          </div>
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Chart & Legend Row */}
        <div className="grid grid-cols-12 items-center gap-4 mb-4">
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
            

          </div>

          {/* Legend */}
          <div className="col-span-5 space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-1 h-4 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-xs font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {item.sales} <span className="text-xs font-medium text-slate-700">Sales</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Box */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-3 tracking-wide">Category Statistics</h4>
          <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-800">Total Number Of Categories</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats.totalCategories}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-orange-600" />
                <span className="text-xs font-bold text-slate-800">Total Number Of Products</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
