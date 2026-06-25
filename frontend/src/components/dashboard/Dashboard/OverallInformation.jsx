import { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  ShoppingBag, 
  Info,
  Calendar,
  ChevronDown
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import analyticsService from "../../../services/business/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";
import { useDashboardDateFilter } from "../../../providers/DashboardDateFilterContext";

const dateOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "This Year", value: "year" },
];

const MetricCard = ({ title, value, Icon, colorClass }) => {
  const displayValue = typeof value === 'object' && value !== null ? (value.value ?? "0") : (value ?? "0");
  
  return (
    <div className="bg-[#F8F9FB] rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100">
      <div className={`p-3 rounded-xl ${colorClass} mb-3 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-xl font-semibold text-slate-800">{displayValue}</h4>
    </div>
  );
};

const OverallInformation = ({ dateRange }) => {
  const { filter, setPreset } = useDashboardDateFilter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentFilterLabel = dateOptions.find(opt => opt.value === (filter.type === 'preset' ? filter.preset : ''))?.label || "This Month";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = getDashboardDateParams(dateRange);
        const res = await analyticsService.getDashboardOverview(params);
        const payload = res?.data || res || {};
        setData(payload?.data || payload);
      } catch (err) {
        console.error("Failed to fetch overall info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const customerData = [
    { name: "First Time", value: 5500, color: "#E65F2B" },
    { name: "Return", value: 3500, color: "#10B981" },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse h-full">
        <div className="h-6 bg-slate-100 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="h-32 bg-slate-50 rounded-2xl"></div>
          <div className="h-32 bg-slate-50 rounded-2xl"></div>
          <div className="h-32 bg-slate-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-xs h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-slate-300 p-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
          <Info size={20} />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Overall Information</h3>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5 p-4">
        <MetricCard 
          title="Suppliers" 
          value={metrics?.totalSuppliers || "0"} 
          Icon={UserCheck} 
          colorClass="bg-blue-50 text-blue-500" 
        />
        <MetricCard 
          title="Customer" 
          value={metrics?.totalCustomers || "0"} 
          Icon={Users} 
          colorClass="bg-orange-50 text-orange-500" 
        />
        <MetricCard 
          title="Orders" 
          value={metrics?.totalOrders?.value || "0"} 
          Icon={ShoppingBag} 
          colorClass="bg-emerald-50 text-emerald-500" 
        />
      </div>

      <div className="h-px bg-slate-50 mb-4"></div>

      {/* Inventory Status Section */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-semibold text-slate-800">Inventory Status</h4>
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-emerald-400 transition-colors cursor-pointer">
              <Calendar size={14} className="text-slate-400" />
              <select 
                value={filter.type === 'preset' ? filter.preset : ''}
                onChange={(e) => setPreset(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-600 cursor-pointer appearance-none pr-4"
              >
                {dateOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Ring Chart */}
          <div className="w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "In Stock", value: (metrics?.totalProducts || 100) - (metrics?.lowStockItems || 20), color: "#10B981" },
                    { name: "Low Stock", value: metrics?.lowStockItems || 20, color: "#E65F2B" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#10B981" stroke="none" />
                  <Cell fill="#E65F2B" stroke="none" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Details */}
          <div className="flex-1 flex justify-around">
            <div className="text-center">
              <h5 className="text-2xl font-bold text-slate-800">
                {metrics?.totalProducts ? (metrics.totalProducts - (metrics.lowStockItems || 0)) : "80"}
              </h5>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">In Stock</p>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md flex items-center justify-center gap-0.5">
                Healthy
              </span>
            </div>
            <div className="text-center">
              <h5 className="text-2xl font-bold text-slate-800">{metrics?.lowStockItems || "20"}</h5>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">Low Stock</p>
              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-md flex items-center justify-center gap-0.5">
                Warning
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default OverallInformation;
