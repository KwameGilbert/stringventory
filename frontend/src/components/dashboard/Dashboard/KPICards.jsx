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
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import analyticsService from "../../../services/business/analyticsService";
import { productService } from "../../../services/business/productService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";
import { useAuth } from "../../../providers/AuthContext";
import { normalizeRole, ROLES } from "../../../utils/accessControl";
import { useCurrency } from "../../../utils/currencyUtils";

const PrimaryCard = ({ kpi, Icon }) => {
  const getBgColor = (color) => {
    const colors = {
      emerald: "bg-[#10B981]",
      blue: "bg-[#2176FF]",
      orange: "bg-[#FF9F43]",
      navy: "bg-[#1B283F]",
    };
    return colors[color] || colors.emerald;
  };

  const isUp = kpi.trend === "up";
  
  return (
    <div className={`relative ${getBgColor(kpi.color)} rounded-lg p-5 shadow-lg flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
      <div className="bg-white p-2 rounded-md shadow-sm z-10 shrink-0">
        <Icon className={`w-5 h-5 ${kpi.color === 'navy' ? 'text-[#1B283F]' : 'text-slate-700'}`} />
      </div>
      <div className="flex-1 z-10">
        <p className="text-[#eee] text-sm font-semibold mb-0.5">{kpi.title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{kpi.value}</h3>
      </div>
      {kpi.change && kpi.trend !== 'alert' && (
        <div className={`z-10 px-2 py-1 rounded-lg flex items-center gap-0.5 ${isUp ? 'bg-emerald-400/20 text-white' : 'bg-rose-400/20 text-white'}`}>
          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-semibold">{kpi.change}</span>
        </div>
      )}
    </div>
  );
};

const SecondaryCard = ({ kpi, Icon }) => {
  const isUp = kpi.trend === "up";
  const isAlert = kpi.trend === "alert";

  const getIconColor = (color) => {
    const colors = {
      emerald: "bg-emerald-100 text-emerald-500",
      orange: "bg-orange-100 text-orange-500",
      blue: "bg-blue-100 text-blue-500",
      rose: "bg-rose-100 text-rose-500",
      red: "bg-red-100 text-red-500",
      yellow: "bg-amber-100 text-amber-600",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-0.5">{kpi.value}</h3>
          <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${getIconColor(kpi.color)} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1">
          {kpi.change && (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-500' : isAlert ? 'text-rose-500' : 'text-slate-500'}`}>
              {kpi.change} <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider ml-1">{isAlert ? '' : 'vs Last Month'}</span>
            </span>
          )}
        </div>
        {kpi.link && (
          <Link to={kpi.link} className="text-slate-400 hover:text-emerald-500 text-xs font-bold flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};

const KPICards = ({ dateRange }) => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [metrics, setMetrics] = useState({});
  const [expiringCount, setExpiringCount] = useState(0);
  const [responseCurrency, setResponseCurrency] = useState("GHS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const params = getDashboardDateParams(dateRange);
        const dashboardRes = await analyticsService.getDashboardOverview(params);
        const dashboardPayload = dashboardRes?.data || dashboardRes || {};
        const dashboardData = dashboardPayload?.data || dashboardPayload;
        
        setMetrics(dashboardData?.metrics || {});
        setResponseCurrency(dashboardPayload?.currency || dashboardData?.currency || "GHS");
      } catch (err) {
        console.error("Dashboard metrics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [dateRange]);

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
        color: "emerald",
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
      {
        id: "totalProducts",
        title: "Total Products",
        value: formatNumber(metrics?.totalProducts?.value || metrics?.totalProducts),
        change: "Active items",
        trend: "neutral",
        icon: Package,
        color: "blue",
        link: "/dashboard/inventory",
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  // Split into primary (first row) and secondary
  const primaryKpis = kpis.slice(0, 4);
  const secondaryKpis = kpis.slice(4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryKpis.map((kpi) => (
          <PrimaryCard key={kpi.id} kpi={kpi} Icon={kpi.icon} />
        ))}
      </div>

      {secondaryKpis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryKpis.map((kpi) => (
            <SecondaryCard key={kpi.id} kpi={kpi} Icon={kpi.icon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KPICards;
