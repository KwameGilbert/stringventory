import { useEffect, useState } from "react";
import {
  DollarSign,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";
import analyticsService from "../../../services/analyticsService";

const iconMap = {
  DollarSign,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
};

// Define gradient schemes for cards
const colorSchemes = {
  emerald: {
    gradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconShadow: "shadow-emerald-200",
    border: "border-emerald-100",
    iconColor: "text-white",
  },
  emerald : {
    gradient: "bg-gradient-to-br from-emerald-50 to-emerald-50",
    iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-500",
    iconShadow: "shadow-emerald-200",
    border: "border-emerald-100",
    iconColor: "text-white",
  },
  orange: {
    gradient: "bg-gradient-to-br from-orange-50 to-amber-50",
    iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    iconShadow: "shadow-orange-200",
    border: "border-orange-100",
    iconColor: "text-white",
  },
  blue: {
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500",
    iconShadow: "shadow-blue-200",
    border: "border-blue-100",
    iconColor: "text-white",
  },
  red: {
    gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
    iconBg: "bg-gradient-to-br from-rose-400 to-pink-500",
    iconShadow: "shadow-rose-200",
    border: "border-rose-100",
    iconColor: "text-white",
  },
};

const DashboardStat = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsService.getDashboardOverview();
        const payload = response?.data || response || {};
        const dashboardData = payload?.data || payload;
        const metrics = dashboardData?.metrics || {};

        const currency = (value) =>
          new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Number(value || 0));

        const number = (value) => new Intl.NumberFormat("en-US").format(Number(value || 0));
        const toChange = (value) => (value === undefined || value === null ? "" : `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)}%`);
        const toTrend = (value) => (Number(value) > 0 ? "up" : Number(value) < 0 ? "down" : "neutral");

        setStats([
          {
            id: "grossRevenue",
            title: "Gross Revenue",
            value: currency(metrics?.grossRevenue?.value),
            change: toChange(metrics?.grossRevenue?.change),
            trend: metrics?.grossRevenue?.trend || toTrend(metrics?.grossRevenue?.change),
            icon: "DollarSign",
            color: "emerald",
          },
          {
            id: "totalSales",
            title: "Total Sales",
            value: number(metrics?.totalOrders?.value),
            change: toChange(metrics?.totalOrders?.change),
            trend: metrics?.totalOrders?.trend || toTrend(metrics?.totalOrders?.change),
            icon: "ShoppingCart",
            color: "blue",
          },
          {
            id: "inventoryValue",
            title: "Inventory Value",
            value: currency(metrics?.inventoryValue?.value),
            change: toChange(metrics?.inventoryValue?.change),
            trend: metrics?.inventoryValue?.trend || toTrend(metrics?.inventoryValue?.change),
            icon: "Package",
            color: "blue",
          },
          {
            id: "lowStock",
            title: "Low Stock Alert",
            value: number(metrics?.lowStockItems),
            change: "Requires attention",
            trend: "alert",
            icon: "AlertTriangle",
            color: "red",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-xl">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || Activity;
        const colors = colorSchemes[stat.color] || colorSchemes.blue;
        const isTrendUp = stat.trend === "up";

        return (
          <div
            key={stat.id || index}
            className={`
              bg-white rounded-xl p-4 
              border border-gray-100 shadow-sm
              hover-lift cursor-pointer
              opacity-0 animate-slide-up
            `}
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex flex-col h-full justify-between gap-4">
              {/* Header: Icon + Title */}
              <div className="flex items-center gap-3">
                <div className={`
                  p-3 rounded-xl ${colors.iconBg} 
                  shadow-lg ${colors.iconShadow}
                `}>
                  <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{stat.title}</span>
              </div>
              
              {/* Main Value */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 animate-count-up">{stat.value}</h3>
              </div>

              {/* Footer: Trend */}
              {stat.change && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className={`
                    flex items-center gap-1 px-2 py-1 rounded-full
                    ${isTrendUp 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-rose-100 text-rose-600"
                    }
                  `}>
                    <TrendingUp className={`w-3.5 h-3.5 ${!isTrendUp ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </span>
                  <span className="text-gray-400">vs yesterday</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStat;

