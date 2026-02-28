import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { PERMISSIONS } from "../../../constants/permissions";
import analyticsService from "../../../services/analyticsService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

const KPICards = ({ dateRange }) => {
  const { user, hasPermission } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const params = getDashboardDateParams(dateRange);
        const response = await analyticsService.getDashboardOverview(params);
        const payload = response?.data || response || {};
        const dashboardData = payload?.data || payload;
        const metrics = dashboardData?.metrics || {};

        const toTrend = (change) => {
          if (change > 0) return "up";
          if (change < 0) return "down";
          return "neutral";
        };

        const formatChange = (change) => {
          if (change === undefined || change === null) return "";
          const value = Number(change);
          if (Number.isNaN(value)) return "";
          return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
        };

        const formatCurrency = (value) =>
          new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Number(value || 0));

        const formatNumber = (value) => new Intl.NumberFormat("en-US").format(Number(value || 0));

        const mappedKpis = [
          {
            id: "grossRevenue",
            title: "Gross Revenue",
            value: formatCurrency(metrics?.grossRevenue?.value),
            change: formatChange(metrics?.grossRevenue?.change),
            trend: metrics?.grossRevenue?.trend || toTrend(metrics?.grossRevenue?.change),
            icon: "DollarSign",
            color: "emerald",
            permission: PERMISSIONS.VIEW_KPI_GROSS_REVENUE,
          },
          {
            id: "totalSales",
            title: "Total Sales",
            value: formatNumber(metrics?.totalOrders?.value),
            change: formatChange(metrics?.totalOrders?.change),
            trend: metrics?.totalOrders?.trend || toTrend(metrics?.totalOrders?.change),
            icon: "ShoppingCart",
            color: "blue",
            permission: PERMISSIONS.VIEW_KPI_TOTAL_SALES,
          },
          {
            id: "totalExpenses",
            title: "Total Expenses",
            value: formatCurrency(metrics?.totalExpenses?.value),
            change: formatChange(metrics?.totalExpenses?.change),
            trend: metrics?.totalExpenses?.trend || toTrend(metrics?.totalExpenses?.change),
            icon: "AlertTriangle",
            color: "orange",
            permission: PERMISSIONS.VIEW_KPI_TOTAL_EXPENSES,
          },
          {
            id: "netProfit",
            title: "Net Revenue",
            value: formatCurrency(metrics?.netProfit?.value),
            change: formatChange(metrics?.netProfit?.change),
            trend: metrics?.netProfit?.trend || toTrend(metrics?.netProfit?.change),
            icon: "TrendingUp",
            color: "emerald",
            permission: PERMISSIONS.VIEW_KPI_NET_REVENUE,
          },
          {
            id: "inventoryValue",
            title: "Inventory Value",
            value: formatCurrency(metrics?.inventoryValue?.value),
            change: formatChange(metrics?.inventoryValue?.change),
            trend: metrics?.inventoryValue?.trend || toTrend(metrics?.inventoryValue?.change),
            icon: "Package",
            color: "blue",
            permission: PERMISSIONS.VIEW_KPI_INVENTORY_VALUE,
          },
          {
            id: "lowStockItems",
            title: "Low Stock Alert",
            value: formatNumber(metrics?.lowStockItems),
            change: "Requires attention",
            trend: "alert",
            icon: "AlertTriangle",
            color: "red",
            permission: PERMISSIONS.VIEW_KPI_LOW_STOCK,
          },
        ];

        setKpis(mappedKpis.filter((kpi) => hasPermission(kpi.permission)));
      } catch (error) {
        console.error("Error fetching KPIs:", error);
        setKpis([]);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, [dateRange, user, hasPermission]);

  const getIcon = (iconName) => {
    const icons = {
      DollarSign,
      ShoppingCart,
      TrendingUp,
      AlertTriangle,
      Activity: DollarSign,
    };
    return icons[iconName] || DollarSign;
  };

  const getGradient = (color) => {
    const gradients = {
      emerald: "from-emerald-500 to-teal-600",
      orange: "from-orange-500 to-red-600",
      red: "from-red-500 to-rose-600",
      blue: "from-blue-500 to-indigo-600",
      slate: "from-slate-500 to-gray-600",
    };
    return gradients[color] || gradients.emerald;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Key Performance Indicators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = getIcon(kpi.icon);
          const isAlert = kpi.trend === "alert";
          const isUp = kpi.trend === "up";
          const isDown = kpi.trend === "down";

          return (
            <div
              key={kpi.id}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-linear-to-br ${getGradient(kpi.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="relative mb-4">
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${getGradient(kpi.color)} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Value */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{kpi.title}</p>

                {/* Trend Badge */}
                {kpi.change && (
                  <div className="flex items-center gap-1">
                    {isUp && (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">
                          {kpi.change}
                        </span>
                      </>
                    )}
                    {isDown && (
                      <>
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-medium text-rose-600">
                          {kpi.change}
                        </span>
                      </>
                    )}
                    {isAlert && (
                      <span className="text-xs font-medium text-red-600 animate-pulse">
                        {kpi.change}
                      </span>
                    )}
                    {!isUp && !isDown && !isAlert && (
                      <span className="text-xs font-medium text-gray-500">
                        {kpi.change}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPICards;
