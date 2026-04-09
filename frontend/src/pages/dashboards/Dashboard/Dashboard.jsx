import React, { lazy, Suspense } from "react";
import DashboardHeader from "../../../components/admin/Dashboard/DashboardHeader";
import KPICards from "../../../components/admin/Dashboard/KPICards";
import QuickLists from "../../../components/admin/Dashboard/QuickLists";
import { useDashboardDateFilter } from "../../../contexts/DashboardDateFilterContext";

// Lazy load heavy chart components
const SalesExpensesChart = lazy(() => import("../../../components/admin/Dashboard/SalesExpensesChart"));
const TopProductsChart = lazy(() => import("../../../components/admin/Dashboard/TopProductsChart"));
const TopCustomers = lazy(() => import("../../../components/admin/Dashboard/TopCustomers"));
const PaymentDistribution = lazy(() => import("../../../components/admin/Dashboard/PaymentDistribution"));

const ChartPlaceholder = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-[400px]">
    <div className="h-6 bg-gray-100 rounded w-1/3 mb-6"></div>
    <div className="h-full bg-gray-50 rounded-xl"></div>
  </div>
);

export default function Dashboard() {
  const { filter, setPreset } = useDashboardDateFilter();
  const effectiveDateRange =
    filter.type === "custom"
      ? { startDate: filter.startDate, endDate: filter.endDate }
      : filter.preset;

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header with Date Filter */}
      <DashboardHeader
        dateRange={filter.type === "preset" ? filter.preset : "custom"}
        setDateRange={setPreset}
      />

      {/* KPI Cards Section */}
      <KPICards dateRange={effectiveDateRange} />

      {/* Charts Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Performance Insights
        </h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sales & Expenses Trend - 2 columns */}
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartPlaceholder />}>
              <SalesExpensesChart dateRange={effectiveDateRange} />
            </Suspense>
          </div>
          
          {/* Payment Distribution - 1 column */}
          <div>
            <Suspense fallback={<ChartPlaceholder />}>
              <PaymentDistribution dateRange={effectiveDateRange} />
            </Suspense>
          </div>
        </div>

        {/* Top Products & Top Customers - 2 columns */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<ChartPlaceholder />}>
            <TopProductsChart dateRange={effectiveDateRange} />
          </Suspense>
          <Suspense fallback={<ChartPlaceholder />}>
            <TopCustomers dateRange={effectiveDateRange} />
          </Suspense>
        </div>
      </div>

      {/* Quick Access Lists */}
      <QuickLists />
    </div>
  );
}