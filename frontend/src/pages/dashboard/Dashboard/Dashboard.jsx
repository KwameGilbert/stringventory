import React, { lazy, Suspense, useState, useEffect } from "react";

import DashboardHeader from "../../../components/dashboard/Dashboard/DashboardHeader";
import KPICards from "../../../components/dashboard/Dashboard/KPICards";
import QuickLists from "../../../components/dashboard/Dashboard/QuickLists";
import { useDashboardDateFilter } from "../../../providers/DashboardDateFilterContext";
import { productService } from "../../../services/business/productService";
import analyticsService from "../../../services/business/analyticsService";
import orderService from "../../../services/business/orderService";
import { getDashboardDateParams } from "../../../utils/dashboardDateParams";

// ─── Lazy-loaded chart components ─────────────────────────────────────────────
const SalesExpensesChart = lazy(() => import("../../../components/dashboard/Dashboard/SalesExpensesChart"));
const PaymentDistribution = lazy(() => import("../../../components/dashboard/Dashboard/PaymentDistribution"));
const TopProductsChart    = lazy(() => import("../../../components/dashboard/Dashboard/TopProductsChart"));
const TopCustomers        = lazy(() => import("../../../components/dashboard/Dashboard/TopCustomers"));

// ─── Skeleton fallback for charts ─────────────────────────────────────────────
const ChartPlaceholder = ({ height = "h-[400px]" }) => (
  <div className={`bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse ${height}`}>
    <div className="h-6 bg-slate-100 rounded w-1/3 mb-6"></div>
    <div className="h-full bg-slate-50 rounded-lg"></div>
  </div>
);


// ─── Main Dashboard Page ───────────────────────────────────────────────────────
export default function Dashboard() {
  const { filter, setPreset } = useDashboardDateFilter();

  // ── Shared state ──────────────────────────────────────────────────────────
  const [dashboardData, setDashboardData]       = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [recentOrders, setRecentOrders]         = useState([]);

  const effectiveDateRange =
    filter.type === "custom"
      ? { startDate: filter.startDate, endDate: filter.endDate }
      : filter.preset;

  // ── Single fetch: /v1/analytics/dashboard ─────────────────────────────────
  // Shared via props with: KPICards, SalesExpensesChart, PaymentDistribution
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setDashboardLoading(true);
        const params = getDashboardDateParams(effectiveDateRange);
        const response = await analyticsService.getDashboardOverview(params);
        const payload = response?.data || response || {};
        setDashboardData(payload?.data || payload);
      } catch (err) {
        console.error("Dashboard overview fetch failed:", err);
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboard();
  }, [filter.startDate, filter.endDate, filter.preset, filter.type]);

  // ── Single fetch: /v1/orders ───────────────────────────────────────────────
  // Shared via props with: QuickLists
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders({ limit: 5, sortBy: "date", sortOrder: "desc" });
        const payload = res?.data || res || {};
        const list = Array.isArray(payload) ? payload : payload.orders || payload.data || [];
        setRecentOrders(list);
      } catch (err) {
        console.error("Failed to fetch recent orders:", err);
      }
    };
    fetchOrders();
  }, []);


  return (
    <div className="space-y-0 pb-4 animate-fade-in max-w-[1600px] mx-auto px-2 md:px-4">

      {/* Header with Date Filter */}
      <DashboardHeader
        dateRange={filter.type === "preset" ? filter.preset : "custom"}
        setDateRange={setPreset}
      />


      {/* KPI Cards — receives shared dashboardData */}
      <KPICards
        dashboardData={dashboardData}
        dashboardLoading={dashboardLoading}
        dateRange={effectiveDateRange}
      />

      {/* Performance Insights */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-wider">
            Performance Insights
          </h2>
          <div className="h-px bg-slate-100 flex-1 ml-6"></div>
        </div>

        {/* Row 1: Sales & Expenses Trend (2/3) + Payment Distribution (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartPlaceholder height="h-[420px]" />}>
              <SalesExpensesChart
                dashboardData={dashboardData}
                dashboardLoading={dashboardLoading}
                dateRange={effectiveDateRange}
              />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<ChartPlaceholder height="h-[420px]" />}>
              <PaymentDistribution
                dashboardData={dashboardData}
                dashboardLoading={dashboardLoading}
                dateRange={effectiveDateRange}
              />
            </Suspense>
          </div>
        </div>

        {/* Row 2: Top Selling Products (1/2) + Top Customers (1/2) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <Suspense fallback={<ChartPlaceholder />}>
            <TopProductsChart dateRange={effectiveDateRange} />
          </Suspense>
          <Suspense fallback={<ChartPlaceholder />}>
            <TopCustomers dateRange={effectiveDateRange} />
          </Suspense>
        </div>
      </div>

      {/* Quick Access Lists — receives shared recentOrders */}
      <div className="mt-8">
        <QuickLists recentOrders={recentOrders} />
      </div>

    </div>
  );
}