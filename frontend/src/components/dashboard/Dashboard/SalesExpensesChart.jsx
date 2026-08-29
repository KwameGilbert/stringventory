import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useCurrency } from "../../../utils/currencyUtils";

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

const SalesExpensesChart = ({ dashboardData, dashboardLoading }) => {
  const { symbol, formatPrice } = useCurrency();

  // Derive chart rows from shared dashboardData prop
  const data = useMemo(() => {
    const chartRows = dashboardData?.charts?.revenueByDate || [];
    const mapped = chartRows.map((row) => ({
      month: row?.date
        ? new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "—",
      sales: Number(row?.revenue ?? 0),
      expenses: Number(row?.expenses ?? 0),
    }));
    return mapped.length > 0 ? mapped : MOCK_DATA.map(d => ({ month: d.month, sales: d.sales, expenses: d.purchase }));
  }, [dashboardData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 min-w-[160px]">
          <p className="text-sm font-bold text-slate-900 mb-3">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-4 mb-1.5">
              <span className={`text-[13px] font-semibold ${entry.name === 'Sales' ? 'text-[#00C49F]' : 'text-[#F59E0B]'}`}>
                {entry.name}: {formatPrice(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center items-center gap-6 mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className={`text-[13px] font-semibold ${entry.value === 'Sales' ? 'text-[#00C49F]' : 'text-[#F59E0B]'}`}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (dashboardLoading) {
    return (
      <div className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-sm animate-pulse h-[400px]">
        <div className="h-6 bg-slate-100 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-50 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-slate-50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 hover:shadow-md transition-all duration-300 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="text-[#00C49F] w-5 h-5" strokeWidth={2.5} />
          <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">Sales vs Expenses Trends</h3>
        </div>
        <p className="text-[13px] font-medium text-slate-500">Track your revenue and spending over time</p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={true} horizontal={true} />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => (val === 0 ? `${symbol}0k` : `${symbol}${val / 1000}k`)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
            <Legend content={renderLegend} verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#F59E0B" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#00C49F"
              strokeWidth={2}
              dot={{ r: 4, fill: "#00C49F", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#00C49F" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesExpensesChart;
