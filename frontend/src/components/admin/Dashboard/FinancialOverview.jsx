import { useState, useEffect } from "react";
import { DollarSign, ArrowDownCircle, RotateCcw, TrendingUp } from "lucide-react";
import analyticsService from "../../../services/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const FinancialOverview = ({ dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = getDashboardDateParams(dateRange);
        const [dashboardRes, expenseReportRes] = await Promise.all([
          analyticsService.getDashboardOverview(params),
          analyticsService.getExpenseReport(params),
        ]);

        const dashboardPayload = dashboardRes?.data || dashboardRes || {};
        const dashboardData = dashboardPayload?.data || dashboardPayload;
        const metrics = dashboardData?.metrics || {};

        const expensePayload = expenseReportRes?.data || expenseReportRes || {};
        const expenseData = expensePayload?.data || expensePayload;
        const expenseSummary = expenseData?.summary || {};

        setData({
          grossRevenue: metrics?.grossRevenue || { value: 0, change: 0, trend: "up" },
          totalExpenses: metrics?.totalExpenses || {
            value: expenseSummary?.totalExpenses || 0,
            change: 0,
            trend: "up",
          },
          totalRefunds: metrics?.totalRefunds || { value: 0, change: 0, trend: "down" },
          netRevenue: metrics?.netProfit || { value: 0, change: 0, trend: "up" },
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Gross Revenue",
      value: formatCurrency(data?.grossRevenue?.value || 0),
      change: data?.grossRevenue?.change || 0,
      trend: data?.grossRevenue?.trend || "up",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(data?.totalExpenses?.value || 0),
      change: data?.totalExpenses?.change || 0,
      trend: data?.totalExpenses?.trend || "up",
      icon: ArrowDownCircle,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      label: "Total Refunds",
      value: formatCurrency(data?.totalRefunds?.value || 0),
      change: data?.totalRefunds?.change || 0,
      trend: data?.totalRefunds?.trend || "down",
      icon: RotateCcw,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Net Revenue",
      value: formatCurrency(data?.netRevenue?.value || 0),
      change: data?.netRevenue?.change || 0,
      trend: data?.netRevenue?.trend || "up",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Financial Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === "up";
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {stat.change !== 0 && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {isPositive ? "+" : ""}{stat.change}%
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialOverview;
