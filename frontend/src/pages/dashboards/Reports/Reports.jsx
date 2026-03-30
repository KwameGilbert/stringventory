import { useState, useEffect } from "react";
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
  CreditCard,
  Activity,
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
import analyticsService from "../../../services/analyticsService";
import orderService from "../../../services/orderService";
import userService from "../../../services/userService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";
import { useCurrency } from "../../../utils/currencyUtils";

const TABS = [
  { id: "sales", label: "Sales Report", icon: TrendingUp },
  { id: "inventory", label: "Inventory Report", icon: Package },
  { id: "expenses", label: "Expense Report", icon: DollarSign },
  { id: "pnl", label: "Profit & Loss", icon: BarChart3 },
  // { id: "stock", label: "Stock Movement Report", icon: ArrowUp },
  { id: "users", label: "User Activity Report", icon: Users },
];

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const { formatPrice, symbol } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = getDashboardDateParams(
          dateRange === "year" ? "year" : dateRange === "quarter" ? "90days" : dateRange === "month" ? "30days" : "30days"
        );

        const [
          salesRes,
          inventoryRes,
          expenseRes,
          financialRes,
          customerRes,
          dashboardRes,
          ordersRes,
          usersRes,
        ] = await Promise.all([
          analyticsService.getSalesReport(params),
          analyticsService.getInventoryReport(params),
          analyticsService.getExpenseReport(params),
          analyticsService.getFinancialReport(params),
          analyticsService.getCustomerReport(params),
          analyticsService.getDashboardOverview(params),
          orderService.getOrders({ limit: 100 }),
          userService.getUsers({ limit: 50 }),
        ]);

        const unwrap = (response) => {
          const payload = response?.data || response || {};
          return payload?.data || payload;
        };

        const salesData = unwrap(salesRes);
        const inventoryData = unwrap(inventoryRes);
        const expenseData = unwrap(expenseRes);
        const financialData = unwrap(financialRes);
        const customerData = unwrap(customerRes);
        const dashboardData = unwrap(dashboardRes);

        const orderPayload = ordersRes?.data || ordersRes || {};
        const orders = Array.isArray(orderPayload)
          ? orderPayload
          : Array.isArray(orderPayload.orders)
            ? orderPayload.orders
            : Array.isArray(orderPayload.data)
              ? orderPayload.data
              : [];

        const userPayload = usersRes?.data || usersRes || {};
        const users = Array.isArray(userPayload)
          ? userPayload
          : Array.isArray(userPayload.users)
            ? userPayload.users
            : Array.isArray(userPayload.data)
              ? userPayload.data
              : [];

        const groupedMonthly = {};
        (dashboardData?.charts?.revenueByDate || []).forEach((row) => {
          const key = row?.date ? new Date(row.date).toLocaleDateString("en-US", { month: "short" }) : "N/A";
          groupedMonthly[key] = groupedMonthly[key] || { month: key, revenue: 0, expenses: 0, profit: 0 };
          groupedMonthly[key].revenue += Number(row?.revenue || 0);
          groupedMonthly[key].expenses += Number(row?.expenses || 0);
          groupedMonthly[key].profit = groupedMonthly[key].revenue - groupedMonthly[key].expenses;
        });

        const monthlyPnL = Object.values(groupedMonthly);

        const salesReport = {
          summary: {
            totalRevenue: Number(salesData?.summary?.totalSales ?? 0),
            totalOrders: Number(salesData?.summary?.totalOrders ?? 0),
            averageOrderValue: Number(salesData?.summary?.averageOrderValue ?? 0),
            totalItems: Number(salesData?.summary?.totalItems ?? 0),
            topPaymentMethod: salesData?.summary?.topPaymentMethod || "cash",
            growth: Number(dashboardData?.metrics?.grossRevenue?.change ?? 0),
          },
          monthlySales: (salesData?.byDate || []).map((row) => ({
            date: row?.date,
            month: row?.date ? new Date(row.date).toLocaleDateString("en-US", { month: "short" }) : "N/A",
            revenue: Number(row?.sales || 0),
            orders: Number(row?.orders || 0),
            items: Number(row?.items || 0),
          })),
          topProducts: (salesData?.byProduct || []).slice(0, 8).map((row) => ({
            id: row?.productId,
            name: row?.productName || "Product",
            units: Number(row?.quantity || 0),
            revenue: Number(row?.revenue || 0),
          })),
          topCustomers: (salesData?.byCustomer || []).slice(0, 8).map((row) => ({
            id: row?.customerId,
            name: row?.customerName || "Customer",
            orders: Number(row?.orders || 0),
            spent: Number(row?.spent || 0),
          })),
          paymentMethods: (salesData?.byPaymentMethod || []).map((row) => ({
            name: row?.paymentMethod?.replace('_', ' ')?.toUpperCase() || "CASH",
            revenue: Number(row?.revenue || 0),
            orders: Number(row?.orders || 0),
          })),
        };

        const inventoryReport = {
          summary: {
            totalValue: Number(inventoryData?.summary?.totalValue ?? 0),
            totalItems: Number(inventoryData?.summary?.totalQuantity ?? 0),
            totalProducts: Number(inventoryData?.summary?.totalProducts ?? 0),
            lowStockItems: Number(inventoryData?.summary?.lowStockItems ?? 0),
            outOfStockItems: Number(inventoryData?.summary?.outOfStockItems ?? 0),
          },
          categoryValuation: (inventoryData?.byCategory || [])
            .map((row) => ({
              id: row?.categoryId,
              name: row?.categoryName || "Category",
              productCount: Number(row?.productCount || 0),
              quantity: Number(row?.quantity || 0),
              value: Number(row?.value || 0),
            }))
            .filter(cat => cat.productCount > 0 || cat.value > 0),
          lowStockList: (inventoryData?.lowStockItems || []).map(item => ({
            name: item.productName || item.name || "Product",
            sku: item.sku || "N/A",
            stock: Number(item.quantity || 0),
            threshold: Number(item.reorderLevel || 0)
          }))
        };

        const expenseReport = {
          summary: {
            totalExpenses: Number(expenseData?.summary?.totalExpenses ?? 0),
            totalItems: Number(expenseData?.summary?.totalExpenseItems ?? 0),
            averageExpense: Number(expenseData?.summary?.averageExpense ?? 0),
            largestCategory: (expenseData?.byCategory || []).sort((a, b) => Number(b?.amount || 0) - Number(a?.amount || 0))[0]?.categoryName || "N/A",
          },
          monthlyExpenses: (salesData?.byDate || []).map((row) => ({
            month: row?.date ? new Date(row.date).toLocaleDateString("en-US", { month: "short" }) : "N/A",
            amount: Number(row?.expenses || 0),
          })),
          expensesByCategory: (expenseData?.byCategory || []).map((row) => ({
            name: row?.categoryName || "Category",
            amount: Number(row?.amount || 0),
            itemCount: Number(row?.itemCount || 0),
          })),
        };

        const stockMovement = {
          summary: {
            totalIn: Number(inventoryData?.summary?.totalQuantity ?? 0),
            totalOut: Number(salesData?.summary?.totalItems ?? 0),
            adjustments: 0,
          },
          recentMovements: (inventoryData?.lowStockItems || []).slice(0, 10).map((item, index) => ({
            id: `move-${index}`,
            date: new Date().toISOString(),
            product: item?.productName || "Product",
            type: Number(item?.quantity || 0) <= Number(item?.reorderLevel || 0) ? "out" : "in",
            quantity: Number(item?.quantity || 0),
            reason: "Inventory monitoring",
            user: "System",
          })),
        };

        const userActivity = {
          summary: {
            activeUsers: users.filter((user) => user?.isActive ?? user?.status === "active").length,
            totalActions: orders.length,
            mostActiveUser: users[0]?.firstName ? `${users[0].firstName} ${users[0]?.lastName || ""}`.trim() : "N/A",
          },
          recentActivity: orders.slice(0, 10).map((order, index) => ({
            id: `act-${index}`,
            time: order?.orderDate || order?.date || order?.createdAt || new Date().toISOString(),
            user: order?.customerName || order?.customer?.name || "System",
            module: "Sales",
            action: "Order processed",
            details: order?.orderNumber || order?.id || "Order",
          })),
        };

        setData({
          salesReport,
          inventoryReport,
          expenseReport,
          profitAndLoss: {
            income: {
              sales: Number(financialData?.income?.sales || 0),
              other: Number(financialData?.income?.other || 0),
              total: Number(financialData?.income?.total || 0),
            },
            expenses: {
              cogs: Number(financialData?.expenses?.costOfGoods || 0),
              opex: Number(financialData?.expenses?.operationalExpenses || 0),
              other: Number(financialData?.expenses?.other || 0),
              total: Number(financialData?.expenses?.total || 0),
            },
            summary: {
              grossProfit: Number(financialData?.summary?.grossProfit || 0),
              netProfit: Number(financialData?.summary?.netProfit || 0),
              profitMargin: Number(financialData?.summary?.profitMargin || 0),
              roi: Number(financialData?.summary?.roi || 0),
            },
            monthlyPnL,
          },
          stockMovement,
          userActivity,
        });
      } catch (error) {
        console.error("Error loading reports", error);
        setData({
          salesReport: { summary: {}, monthlySales: [], topProducts: [] },
          inventoryReport: { summary: {}, categoryValuation: [] },
          expenseReport: { summary: {}, monthlyExpenses: [], expensesByCategory: [] },
          profitAndLoss: { summary: {}, monthlyPnL: [] },
          stockMovement: { summary: {}, recentMovements: [] },
          userActivity: { summary: {}, recentActivity: [] },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  // Replaced local formatCurrency with useCurrency's formatPrice logic

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
    <div className="pb-8 animate-fade-in space-y-6 ">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-linear-to-br from-gray-800 to-gray-900">
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
                    ? "bg-linear-to-r from-gray-800 to-gray-900 text-white shadow-lg shadow-gray-900/20"
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
             <SummaryCard title="Total Revenue" value={formatPrice(data?.salesReport?.summary?.totalRevenue || 0)} icon={DollarSign} color="emerald" />
             <SummaryCard title="Total Sales" value={data?.salesReport?.summary?.totalOrders || 0} icon={Package} color="blue" />
             <SummaryCard title="Avg. Order Value" value={formatPrice(data?.salesReport?.summary?.averageOrderValue || 0)} icon={TrendingUp} color="emerald" />
             <SummaryCard title="Top Payment" value={data?.salesReport?.summary?.topPaymentMethod || "N/A"} icon={CreditCard} color="amber" />
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Revenue</h3>
            <div className="w-full h-80 relative min-h-0">
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
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${symbol}${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorSalesRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Lower Grid: Products, Customers, and Payments */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Top Products</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {data?.salesReport?.topProducts.map((product, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.units} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 text-sm">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Top Customers</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {data?.salesReport?.topCustomers.map((customer, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-sm">{formatPrice(customer.spent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Payment Methods</h3>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.salesReport?.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="revenue"
                      >
                        {data?.salesReport?.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             <SummaryCard title="Total Value" value={formatPrice(data?.inventoryReport?.summary?.totalValue || 0)} icon={DollarSign} color="emerald" />
             <SummaryCard title="Total Quantity" value={data?.inventoryReport?.summary?.totalItems || 0} icon={Package} color="blue" />
             <SummaryCard title="Total Products" value={data?.inventoryReport?.summary?.totalProducts || 0} icon={Activity} color="rose" />
             <SummaryCard title="Low Stock" value={data?.inventoryReport?.summary?.lowStockItems || 0} icon={AlertTriangle} color={data?.inventoryReport?.summary?.lowStockItems > 0 ? "rose" : "emerald"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Valuation Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Valuation by Category</h3>
              <div className="w-full h-80 relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.inventoryReport?.categoryValuation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${symbol}${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Category Breakdown</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                {data?.inventoryReport?.categoryValuation.map((cat, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.productCount} products • {cat.quantity} units</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(cat.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Watchlist */}
          {data?.inventoryReport?.lowStockList?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/50">
                <h3 className="font-semibold text-rose-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-500" />
                  Low Stock Watchlist
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Product</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500">SKU</th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500">Current Stock</th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500">Threshold</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.inventoryReport?.lowStockList.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-3 text-gray-500">{item.sku}</td>
                        <td className="px-6 py-3 text-center font-bold text-rose-600">{item.stock}</td>
                        <td className="px-6 py-3 text-center text-gray-400">{item.threshold}</td>
                        <td className="px-6 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">Critical</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expense Report */}
      {activeTab === "expenses" && (
         <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
             <SummaryCard title="Total Expenses" value={formatPrice(data?.expenseReport?.summary?.totalExpenses || 0)} icon={DollarSign} color="rose" />
             <SummaryCard title="Expense Items" value={data?.expenseReport?.summary?.totalItems || 0} icon={Package} color="blue" />
             <SummaryCard title="Avg. Expense" value={formatPrice(data?.expenseReport?.summary?.averageExpense || 0)} icon={TrendingUp} color="amber" />
             <SummaryCard title="Largest Focus" value={data?.expenseReport?.summary?.largestCategory || "N/A"} icon={BarChart3} color="emerald" />
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
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${symbol}${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
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
                    <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <SummaryCard title="Gross Profit" value={formatPrice(data?.profitAndLoss?.summary?.grossProfit || 0)} icon={DollarSign} color="emerald" />
              <SummaryCard title="Net Profit" value={formatPrice(data?.profitAndLoss?.summary?.netProfit || 0)} icon={TrendingUp} color="emerald" />
              <SummaryCard title="Profit Margin" value={`${data?.profitAndLoss?.summary?.profitMargin?.toFixed(1) || 0}%`} icon={BarChart} color="blue" />
              <SummaryCard title="ROI" value={`${data?.profitAndLoss?.summary?.roi?.toFixed(1) || 0}%`} icon={Activity} color="amber" />
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Income vs Expenses Breakdown */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="font-semibold text-gray-900">Financial Breakdown</h3>
               </div>
               <div className="p-6 space-y-6">
                  {/* Income Section */}
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Income / Revenue</h4>
                    <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Total Sales</span>
                         <span className="font-medium text-gray-900">{formatPrice(data?.profitAndLoss?.income?.sales)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Other Income</span>
                         <span className="font-medium text-gray-900">{formatPrice(data?.profitAndLoss?.income?.other)}</span>
                       </div>
                       <div className="flex justify-between text-sm py-2 border-t border-gray-100 font-bold">
                         <span className="text-emerald-700">Total Revenue</span>
                         <span className="text-emerald-700">{formatPrice(data?.profitAndLoss?.income?.total)}</span>
                       </div>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div>
                    <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Cost & Expenses</h4>
                    <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Cost of Goods Sold (COGS)</span>
                         <span className="font-medium text-gray-900">{formatPrice(data?.profitAndLoss?.expenses?.cogs)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Operational Expenses (OPEX)</span>
                         <span className="font-medium text-gray-900">{formatPrice(data?.profitAndLoss?.expenses?.opex)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Other Expenses</span>
                         <span className="font-medium text-gray-900">{formatPrice(data?.profitAndLoss?.expenses?.other)}</span>
                       </div>
                       <div className="flex justify-between text-sm py-2 border-t border-gray-100 font-bold">
                         <span className="text-gray-900">Total Deductions</span>
                         <span className="text-rose-600">{formatPrice(data?.profitAndLoss?.expenses?.total)}</span>
                       </div>
                    </div>
                  </div>
               </div>
             </div>

             {/* P&L Performance Chart */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">P&L Performance Trend</h3>
              <div className="w-full h-80 relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data?.profitAndLoss?.monthlyPnL}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${symbol}${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: "8px" }} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="profit" stackId="3" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
             </div>
           </div>
          </div>
       )}

       {/* Stock Movement Report - Commented Out
       {activeTab === "stock" && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <SummaryCard title="Total Stock In" value={data?.stockMovement?.summary?.totalIn || 0} icon={ArrowUp} color="emerald" />
             <SummaryCard title="Total Stock Out" value={data?.stockMovement?.summary?.totalOut || 0} icon={ArrowDown} color="rose" />
             <SummaryCard title="Net Adjustments" value={data?.stockMovement?.summary?.adjustments || 0} icon={AlertTriangle} color="amber" />
          </div>

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
      */}

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
