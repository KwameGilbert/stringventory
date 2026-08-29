import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
} from "lucide-react";


import { productService } from "../../../services/business/productService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";
import { useAuth } from "../../../providers/AuthContext";
import { normalizeRole, ROLES } from "../../../utils/accessControl";
import { useCurrency } from "../../../utils/currencyUtils";

const KpiCard = ({ kpi, Icon }) => {
  const isGrossRevenue = kpi.id === "grossRevenue";

  const getIconColor = (colorId) => {
    switch (colorId) {
      case "emerald": return "bg-[#00C49F]";
      case "blue": return "bg-[#4F46E5]";
      case "orange": return "bg-[#FF4500]";
      case "navy": return "bg-[#00C49F]";
      case "yellow": return "bg-[#FF0033]";
      case "rose": return "bg-[#E11D48]";
      default: return "bg-[#4F46E5]";
    }
  };

  const getTrendColor = (trend) => {
    if (trend === "alert") return "text-[#FF0033]";
    if (trend === "up") return "text-[#00C49F]";
    if (trend === "down") return "text-[#FF4500]";
    return "text-slate-500";
  };

  return (
    <div className={`rounded-xl p-4 shadow-sm border ${isGrossRevenue ? 'bg-[#F2FAF7] border-[#E8F5F1]' : 'bg-white border-slate-100'} flex flex-col items-start transition-all duration-300 hover:shadow-md`}>
      <div className={`p-2 rounded-lg text-white ${getIconColor(kpi.color)} mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      
      <h3 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none mb-0.5">{kpi.value}</h3>
      <p className="text-sm font-medium text-slate-700 mb-2.5">{kpi.title}</p>
      
      <div className="text-[12px] font-semibold tracking-wide mt-auto">
        <span className={getTrendColor(kpi.trend)}>{kpi.change}</span>
      </div>
    </div>
  );
};

const KPICards = ({ dashboardData, dashboardLoading, dateRange }) => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [expiringCount, setExpiringCount] = useState(0);

  // Derive metrics and currency directly from the shared dashboardData prop
  const metrics = dashboardData?.metrics || {};
  const responseCurrency = dashboardData?.currency || dashboardData?.data?.currency || "GHS";

  useEffect(() => {
    const fetchExpiringCount = async () => {
      try {
        const expiringRes = await productService.getExpiringProducts({ limit: 500 });
        const expiringPayload = expiringRes?.data || expiringRes || {};
        const products = Array.isArray(expiringPayload)
          ? expiringPayload
          : Array.isArray(expiringPayload.products)
            ? expiringPayload.products
            : Array.isArray(expiringPayload.data)
              ? expiringPayload.data
              : [];
              
        const count = products.filter(p => {
          const days = Number(p?.daysUntilExpiry ?? NaN);
          if (Number.isFinite(days)) return days <= 30;
          const expiryDate = p?.expiryDate || p?.expirationDate;
          if (!expiryDate) return false;
          const diffDays = Math.max(0, Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));
          return diffDays <= 30;
        }).length;

        setExpiringCount(count);
      } catch (err) {
        console.error("Expiring products fetch failed:", err);
      }
    };

    if (user) {
      fetchExpiringCount();
    }
  }, [user]);

  const kpis = useMemo(() => {
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

    const formatNumber = (value) => new Intl.NumberFormat("en-US").format(Number(value || 0));

    const params = getDashboardDateParams(dateRange);
    const today = new Date().toISOString().split("T")[0];
    const isToday = params?.startDate === today && params?.endDate === today;

    const allMappedKpis = [
      {
        id: "grossRevenue",
        title: "Gross Revenue",
        value: formatPrice(metrics?.grossRevenue?.value, responseCurrency),
        change: formatChange(metrics?.grossRevenue?.change),
        trend: metrics?.grossRevenue?.trend || toTrend(metrics?.grossRevenue?.change),
        icon: DollarSign,
        color: "emerald",
      },
      {
        id: "totalSales",
        title: isToday ? "Today's Sales" : "Total Sales",
        value: formatNumber(metrics?.totalOrders?.value),
        change: formatChange(metrics?.totalOrders?.change),
        trend: metrics?.totalOrders?.trend || toTrend(metrics?.totalOrders?.change),
        icon: ShoppingCart,
        color: "blue",
      },
      {
        id: "totalExpenses",
        title: "Total Expenses",
        value: formatPrice(metrics?.totalExpenses?.value, responseCurrency),
        change: formatChange(metrics?.totalExpenses?.change),
        trend: metrics?.totalExpenses?.trend || toTrend(metrics?.totalExpenses?.change),
        icon: AlertTriangle,
        color: "orange",
      },
      {
        id: "netProfit",
        title: "Net Revenue",
        value: formatPrice(metrics?.netProfit?.value, responseCurrency),
        change: formatChange(metrics?.netProfit?.change),
        trend: metrics?.netProfit?.trend || toTrend(metrics?.netProfit?.change),
        icon: TrendingUp,
        color: "navy",
        link: "/dashboard/reports",
      },
      {
        id: "inventoryValue",
        title: "Inventory Value",
        value: formatPrice(metrics?.inventoryValue?.value, responseCurrency),
        change: formatChange(metrics?.inventoryValue?.change),
        trend: metrics?.inventoryValue?.trend || toTrend(metrics?.inventoryValue?.change),
        icon: Package,
        color: "blue",
        link: "/dashboard/inventory",
      },
      {
        id: "lowStockItems",
        title: "Low Stock Alert",
        value: formatNumber(metrics?.lowStockItems),
        change: "Requires attention",
        trend: "alert",
        icon: AlertTriangle,
        color: "yellow",
        link: "/dashboard/inventory",
      },
      {
        id: "expiringSoon",
        title: "Expiring Soon",
        value: formatNumber(expiringCount),
        change: "Next 30 days",
        trend: "alert",
        icon: Clock,
        color: "rose",
        link: "/dashboard/products",
      },
    ];

    const roleName = user?.role?.name || user?.role || user?.roleName;
    const role = normalizeRole(roleName);
    
    let filteredKpis = allMappedKpis;
    if (role === ROLES.SALES) {
      filteredKpis = allMappedKpis.filter(kpi => 
        ["totalSales", "expiringSoon", "lowStockItems"].includes(kpi.id)
      );
    }

    return filteredKpis;
  }, [metrics, expiringCount, responseCurrency, user, dateRange, formatPrice]);

  if (dashboardLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} Icon={kpi.icon} />
      ))}
    </div>
  );
};

export default KPICards;
