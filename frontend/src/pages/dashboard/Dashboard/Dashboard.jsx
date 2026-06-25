import React, { lazy, Suspense, useState, useEffect } from "react";
import { AlertCircle, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "../../../components/dashboard/Dashboard/DashboardHeader";
import KPICards from "../../../components/dashboard/Dashboard/KPICards";
import QuickLists from "../../../components/dashboard/Dashboard/QuickLists";
import { useDashboardDateFilter } from "../../../providers/DashboardDateFilterContext";
import { productService } from "../../../services/business/productService";
import { useAuth } from "../../../providers/AuthContext";
import { normalizeRole, ROLES } from "../../../utils/accessControl";

const PaymentDistribution = lazy(() => import("../../../components/dashboard/Dashboard/PaymentDistribution"));
const RecentTransactions = lazy(() => import("../../../components/dashboard/Dashboard/RecentTransactions"));
const SalesExpensesChart = lazy(() => import("../../../components/dashboard/Dashboard/SalesExpensesChart"));
const TopProductsChart = lazy(() => import("../../../components/dashboard/Dashboard/TopProductsChart"));
const TopCustomers = lazy(() => import("../../../components/dashboard/Dashboard/TopCustomers"));
const SalesPersonPerformance = lazy(() => import("../../../components/dashboard/Dashboard/SalesPersonPerformance"));
const TopCategories = lazy(() => import("../../../components/dashboard/Dashboard/TopCategories"));
const OrderStatistics = lazy(() => import("../../../components/dashboard/Dashboard/OrderStatistics"));
const OverallInformation = lazy(() => import("../../../components/dashboard/Dashboard/OverallInformation"));

const ChartPlaceholder = ({ height = "h-[400px]" }) => (
  <div className={`bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse ${height}`}>
    <div className="h-6 bg-slate-100 rounded w-1/3 mb-6"></div>
    <div className="h-full bg-slate-50 rounded-lg"></div>
  </div>
);

const LowStockAlert = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!visible || products.length === 0) return null;

  const product = products[currentIndex];
  const hasMultiple = products.length > 1;

  return (
    <div className="bg-amber-50/70 border border-amber-50 rounded-lg p-2 flex items-center justify-between mb-4 animate-slide-up shadow-xs group">
      <div className="flex items-center gap-1 overflow-hidden">
        <div className="bg-amber-500/10 p-1 rounded-lg text-amber-600 shrink-0">
          <AlertCircle size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-700 font-medium text-xs md:text-sm truncate">
            Your Product <span className="text-amber-600 font-semibold">{product?.name || "Product"}</span> is running Low, already below {product?.minStockThreshold || 5} Pcs.
           
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {hasMultiple && (
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-amber-200">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
              {currentIndex + 1} / {products.length}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)}
                className="p-1 hover:bg-amber-100 rounded-md text-amber-500 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)}
                className="p-1 hover:bg-amber-100 rounded-md text-amber-500 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
        <button 
          onClick={() => setVisible(false)}
          className="text-red-600 hover:text-red-600 transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { filter, setPreset } = useDashboardDateFilter();
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const roleName = user?.role?.name || user?.role || user?.roleName;
  const role = normalizeRole(roleName);
  const isSales = role === ROLES.SALES;
  
  const effectiveDateRange =
    filter.type === "custom"
      ? { startDate: filter.startDate, endDate: filter.endDate }
      : filter.preset;

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await productService.getLowStockProducts({ limit: 10 });
        const payload = res?.data || res || {};
        const products = Array.isArray(payload) ? payload : payload.data || payload.products || [];
        setLowStockProducts(products);
      } catch (err) {
        console.error("Failed to fetch low stock products:", err);
      }
    };
    fetchLowStock();
  }, []);

  return (
    <div className="space-y-0 pb-4 animate-fade-in max-w-[1600px] mx-auto px-2 md:px-4">
      {/* Header with Date Filter */}
      <DashboardHeader
        dateRange={filter.type === "preset" ? filter.preset : "custom"}
        setDateRange={setPreset}
      />

      {/* Alert Section */}
      <LowStockAlert products={lowStockProducts} />

      {/* KPI Cards Section */}
      <KPICards dateRange={effectiveDateRange} />

      {/* Analytical & Performance Sections */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-wider">
            Performance Insights
          </h2>
          <div className="h-px bg-slate-100 flex-1 ml-6"></div>
        </div>
        
        {/* Row 1: Sales & Expenses Trend & Overall Information */}
        {!isSales && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            <div className="xl:col-span-2">
              <Suspense fallback={<ChartPlaceholder height="h-[420px]" />}>
                <SalesExpensesChart dateRange={effectiveDateRange} />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<ChartPlaceholder height="h-[420px]" />}>
                <OverallInformation dateRange={effectiveDateRange} />
              </Suspense>
            </div>
          </div>
        )}

        {/* Row 2: Top Products & Top Customers - 2 columns */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <Suspense fallback={<ChartPlaceholder />}>
            <TopProductsChart dateRange={effectiveDateRange} />
          </Suspense>
          <Suspense fallback={<ChartPlaceholder />}>
            <TopCustomers dateRange={effectiveDateRange} />
          </Suspense>
        </div>

        {/* Row 3: Recent Transactions & Salesperson Performance */}
        <div className={`grid grid-cols-1 ${isSales ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-6 items-stretch`}>
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartPlaceholder height="h-[400px]" />}>
              <RecentTransactions />
            </Suspense>
          </div>
          <div className="xl:col-span-1">
            <Suspense fallback={<ChartPlaceholder height="h-[400px]" />}>
              <SalesPersonPerformance dateRange={effectiveDateRange} />
            </Suspense>
          </div>
        </div>

        {/* Row 4: Payment Distribution, Top Categories, & Order Statistics */}
        {!isSales && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-stretch">
            <div className="xl:col-span-1">
              <Suspense fallback={<ChartPlaceholder height="h-[400px]" />}>
                <PaymentDistribution dateRange={effectiveDateRange} />
              </Suspense>
            </div>
            <div className="xl:col-span-1">
              <Suspense fallback={<ChartPlaceholder height="h-[400px]" />}>
                <TopCategories dateRange={effectiveDateRange} />
              </Suspense>
            </div>
            <div className="xl:col-span-1">
              <Suspense fallback={<ChartPlaceholder height="h-[400px]" />}>
                <OrderStatistics dateRange={effectiveDateRange} />
              </Suspense>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Lists */}
      <div className="mt-8">
        <QuickLists />
      </div>
    </div>
  );
}