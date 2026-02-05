import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart3,
  Package,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";

const TABS = [
  { id: "sales", label: "Sales Report", icon: TrendingUp },
  { id: "inventory", label: "Inventory Report", icon: Package },
  { id: "expenses", label: "Expense Report", icon: DollarSign },
  { id: "pnl", label: "Profit & Loss", icon: BarChart3 },
  { id: "stock", label: "Stock Movement Report", icon: ArrowUp },
  { id: "users", label: "User Activity Report", icon: Users },
];

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/reports.json");
        setData(response.data);
      } catch (error) {
        console.error("Error loading reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleExport = (type) => {
    alert(`Exporting ${activeTab} report as ${type.toUpperCase()}`);
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }





  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            </div>
            <p className="text-gray-500 text-sm ml-11">Business insights and analytics dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 font-medium"
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="quarter">This Quarter</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={() => handleExport("excel")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-lg shadow-emerald-600/20"
            >
              <FileText size={15} />
              Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium shadow-lg shadow-rose-600/20"
            >
              <Download size={15} />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg shadow-gray-900/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sales Report */}
      {activeTab === "sales" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             {/* Sales Summary Cards */}
             <SummaryCard title="Total Revenue" value={formatCurrency(data?.salesReport?.summary?.totalRevenue || 0)} icon={DollarSign} color="emerald" />
             <SummaryCard title="Total Sales" value={data?.salesReport?.summary?.totalOrders || 0} icon={Package} color="blue" />
             <SummaryCard title="Avg. Order Value" value={formatCurrency(data?.salesReport?.summary?.averageOrderValue || 0)} icon={TrendingUp} color="emerald " />
             <SummaryCard title="Growth" value={`${data?.salesReport?.summary?.growth || 0}%`} icon={BarChart3} color="amber" />
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.salesReport?.monthlySales}>
                  <defs>
                    <linearGradient id="colorSalesRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorSalesRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
           {/* Top Products Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                     <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Units Sold</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.salesReport?.topProducts.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{product.units}</td>
                       <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             <SummaryCard title="Total Value" value={formatCurrency(data?.inventoryReport?.summary?.totalValue || 0)} icon={DollarSign} color="emerald" />
             <SummaryCard title="Total Items" value={data?.inventoryReport?.summary?.totalItems || 0} icon={Package} color="blue" />
             <SummaryCard title="Low Stock" value={data?.inventoryReport?.summary?.lowStockItems || 0} icon={AlertTriangle} color="amber" />
             <SummaryCard title="Out of Stock" value={data?.inventoryReport?.summary?.outOfStockItems || 0} icon={AlertTriangle} color="red" />
          </div>

          {/* Category Valuation Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Valuation by Category</h3>
             <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.inventoryReport?.categoryValuation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                   <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Expense Report */}
      {activeTab === "expenses" && (
         <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <SummaryCard title="Total Expenses" value={formatCurrency(data?.expenseReport?.summary?.totalExpenses || 0)} icon={DollarSign} color="rose" />
             <SummaryCard title="Largest Category" value={data?.expenseReport?.summary?.largestCategory || "N/A"} icon={BarChart3} color="emerald " />
             <SummaryCard title="Trend" value={`${data?.expenseReport?.summary?.trend || 0}%`} icon={TrendingUp} color={data?.expenseReport?.summary?.trend > 0 ? "rose" : "emerald"} />
          </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Monthly Expenses Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data?.expenseReport?.monthlyExpenses}>
                     <defs>
                      <linearGradient id="colorMonthlyExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="amount" stroke="#EF4444" fillOpacity={1} fill="url(#colorMonthlyExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expenses by Category Chart */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                    <Pie
                      data={data?.expenseReport?.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {data?.expenseReport?.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
           </div>
         </div>
      )}

      {/* Profit & Loss Report */}
      {activeTab === "pnl" && (
         <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <SummaryCard title="Total Revenue" value={formatCurrency(data?.profitAndLoss?.summary?.totalRevenue || 0)} icon={DollarSign} color="blue" />
             <SummaryCard title="Net Profit" value={formatCurrency(data?.profitAndLoss?.summary?.netProfit || 0)} icon={TrendingUp} color="emerald" />
              <SummaryCard title="Profit Margin" value={`${data?.profitAndLoss?.summary?.margin || 0}%`} icon={BarChart} color="emerald " />
          </div>

           {/* P&L Chart */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses vs Profit</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.profitAndLoss?.monthlyPnL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#10B981" fill="#10B981" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
         </div>
      )}

       {/* Stock Movement Report */}
       {activeTab === "stock" && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <SummaryCard title="Total Stock In" value={data?.stockMovement?.summary?.totalIn || 0} icon={ArrowUp} color="emerald" />
             <SummaryCard title="Total Stock Out" value={data?.stockMovement?.summary?.totalOut || 0} icon={ArrowDown} color="rose" />
             <SummaryCard title="Net Adjustments" value={data?.stockMovement?.summary?.adjustments || 0} icon={AlertTriangle} color="amber" />
          </div>

          {/* Movements Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Recent Stock Movements</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Values</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {data?.stockMovement?.recentMovements.map((move) => (
                    <tr key={move.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 text-sm text-gray-500">{formatDate(move.date)}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">{move.product}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase ${
                          move.type === 'in' ? 'bg-emerald-100 text-emerald-700' :
                          move.type === 'out' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {move.type}
                        </span>
                      </td>
                       <td className={`px-6 py-3 text-right font-bold ${move.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {move.quantity > 0 ? '+' : ''}{move.quantity}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{move.reason}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{move.user}</td>
                    </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Report */}
      {activeTab === "users" && (
         <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <SummaryCard title="Active Users" value={data?.userActivity?.summary?.activeUsers || 0} icon={Users} color="blue" />
             <SummaryCard title="Total Actions" value={data?.userActivity?.summary?.totalActions || 0} icon={Package} color="emerald " />
             <SummaryCard title="Most Active" value={data?.userActivity?.summary?.mostActiveUser || "N/A"} icon={TrendingUp} color="emerald" />
          </div>

          {/* Activity Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Recent User Activity</h3>
            </div>
             <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.userActivity?.recentActivity.map((act) => (
                    <tr key={act.id} className="hover:bg-gray-50/50">
                       <td className="px-6 py-3 text-sm text-gray-500">
                        {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br/>
                        <span className="text-xs">{new Date(act.time).toLocaleDateString()}</span>
                       </td>
                      <td className="px-6 py-3 font-medium text-gray-900">{act.user}</td>
                       <td className="px-6 py-3 text-sm text-gray-600">
                         <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{act.module}</span>
                       </td>
                      <td className="px-6 py-3 text-sm font-medium text-blue-600">{act.action}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{act.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for Summary Cards
function SummaryCard({ title, value, icon, color }) {
  const Icon = icon;
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  const textClasses = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
    red: "text-red-600",
  };

   return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || 'bg-gray-50 text-gray-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${textClasses[color] || 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
