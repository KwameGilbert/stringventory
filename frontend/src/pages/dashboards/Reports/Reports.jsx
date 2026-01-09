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
  { id: "inventory", label: "Inventory Valuation", icon: Package },
  { id: "expiry", label: "Expiry & Wastage", icon: AlertTriangle },
  { id: "profit", label: "Profit per Product", icon: TrendingUp },
  { id: "revenue", label: "Revenue vs Expenses", icon: BarChart3 },
  { id: "customers", label: "Customer Performance", icon: Users },
];

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("inventory");
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

  // Calculate totals
  const inventoryTotal = data?.inventoryValuation?.reduce((sum, item) => sum + item.totalValue, 0) || 0;
  const expiryLoss = data?.expiryWastage?.reduce((sum, item) => sum + item.estimatedLoss, 0) || 0;
  const totalProfit = data?.profitPerProduct?.reduce((sum, item) => sum + item.profit, 0) || 0;
  const yearlyRevenue = data?.monthlyRevenueExpenses?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const yearlyExpenses = data?.monthlyRevenueExpenses?.reduce((sum, item) => sum + item.expenses, 0) || 0;
  const totalCustomerSpend = data?.customerPerformance?.reduce((sum, item) => sum + item.totalSpent, 0) || 0;

  // Prepare chart data
  const inventoryChartData = data?.inventoryValuation?.map(item => ({
    name: item.productName.split(" ")[0],
    value: item.totalValue,
    quantity: item.quantity,
  }));

  const expiryPieData = [
    { name: "Critical", value: data?.expiryWastage?.filter(i => i.status === "critical").length || 0, color: "#EF4444" },
    { name: "Warning", value: data?.expiryWastage?.filter(i => i.status === "warning").length || 0, color: "#F59E0B" },
    { name: "Safe", value: data?.expiryWastage?.filter(i => i.status === "safe").length || 0, color: "#10B981" },
  ];

  const profitChartData = data?.profitPerProduct?.map(item => ({
    name: item.productName.split(" ")[0],
    profit: item.profit,
    revenue: item.revenue,
    cost: item.cost,
  }));

  const revenueChartData = data?.monthlyRevenueExpenses?.map(item => ({
    name: item.month.split(" ")[0],
    revenue: item.revenue,
    expenses: item.expenses,
    profit: item.profit,
  }));

  const customerChartData = data?.customerPerformance?.slice(0, 6).map(item => ({
    name: item.customerName.split(" ")[0],
    spent: item.totalSpent,
    orders: item.totalOrders,
  }));

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

      {/* Inventory Valuation Report */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{data.inventoryValuation.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(inventoryTotal)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Item Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventoryTotal / data.inventoryValuation.length)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Value by Product</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Detailed Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Cost</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.inventoryValuation.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-3 text-gray-600">{item.category}</td>
                      <td className="px-6 py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{formatCurrency(item.unitCost)}</td>
                      <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(item.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expiry & Wastage Report */}
      {activeTab === "expiry" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-50">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{data.expiryWastage.filter(i => i.status === "critical").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warning</p>
                  <p className="text-2xl font-bold text-amber-600">{data.expiryWastage.filter(i => i.status === "warning").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Safe</p>
                  <p className="text-2xl font-bold text-emerald-600">{data.expiryWastage.filter(i => i.status === "safe").length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Est. Loss</p>
                  <p className="text-2xl font-bold text-rose-600">{formatCurrency(expiryLoss)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expiryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expiryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Loss by Product</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.expiryWastage.filter(i => i.estimatedLoss > 0)} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(v) => `₵${v}`} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="productName" type="category" tick={{ fontSize: 11 }} width={75} />
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                    <Bar dataKey="estimatedLoss" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Expiring Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Batch</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Days Left</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Est. Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.expiryWastage.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-3 text-gray-600 font-mono text-sm">{item.batchNumber}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`font-bold ${item.daysRemaining <= 5 ? "text-red-600" : item.daysRemaining <= 14 ? "text-amber-600" : "text-emerald-600"}`}>
                          {item.daysRemaining} days
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${
                          item.status === "critical" ? "bg-red-100 text-red-700" :
                          item.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-rose-600">
                        {item.estimatedLoss > 0 ? formatCurrency(item.estimatedLoss) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profit per Product Report */}
      {activeTab === "profit" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.profitPerProduct.reduce((sum, i) => sum + i.revenue, 0))}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Profit</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalProfit)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Margin</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(data.profitPerProduct.reduce((sum, i) => sum + i.margin, 0) / data.profitPerProduct.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit by Product</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Product Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sold</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Profit</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.profitPerProduct.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{item.unitsSold}</td>
                      <td className="px-6 py-3 text-right text-gray-900">{formatCurrency(item.revenue)}</td>
                      <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(item.profit)}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 font-bold ${item.margin >= 25 ? "text-emerald-600" : item.margin >= 15 ? "text-blue-600" : "text-amber-600"}`}>
                          {item.margin >= 25 ? <ArrowUp size={14} /> : null}
                          {item.margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue vs Expenses Report */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(yearlyRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-50">
                  <ArrowDown className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-2xl font-bold text-rose-600">{formatCurrency(yearlyExpenses)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net Profit</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(yearlyRevenue - yearlyExpenses)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {((yearlyRevenue - yearlyExpenses) / yearlyRevenue * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpenses)" />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Monthly Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Expenses</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Profit</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.monthlyRevenueExpenses.map((item, index) => {
                    const prevProfit = index > 0 ? data.monthlyRevenueExpenses[index - 1].profit : item.profit;
                    const trend = item.profit >= prevProfit ? "up" : "down";
                    return (
                      <tr key={item.month} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {item.month}
                        </td>
                        <td className="px-6 py-3 text-right text-blue-600 font-medium">{formatCurrency(item.revenue)}</td>
                        <td className="px-6 py-3 text-right text-rose-600">{formatCurrency(item.expenses)}</td>
                        <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(item.profit)}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                            trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}>
                            {trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Performance Report */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{data.customerPerformance.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCustomerSpend)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-50">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.customerPerformance.reduce((sum, c) => sum + c.avgOrderValue, 0) / data.customerPerformance.length)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.customerPerformance.reduce((sum, c) => sum + c.totalOrders, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Spending</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerChartData} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={75} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="spent" name="Total Spent" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Customer Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Avg. Order</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.customerPerformance.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {customer.customerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900">{customer.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right text-gray-900">{customer.totalOrders}</td>
                      <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(customer.totalSpent)}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{formatCurrency(customer.avgOrderValue)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${
                          customer.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
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
