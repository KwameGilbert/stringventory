import React, { lazy, Suspense, useState, useEffect } from "react";
import { AlertCircle, X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "../../../components/dashboard/Dashboard/DashboardHeader";
import KPICards from "../../../components/dashboard/Dashboard/KPICards";
import QuickLists from "../../../components/dashboard/Dashboard/QuickLists";
import { useDashboardDateFilter } from "../../../providers/DashboardDateFilterContext";
import { productService } from "../../../services/business/productService";

// Lazy load heavy chart components
const SalesExpensesChart = lazy(() => import("../../../components/dashboard/Dashboard/SalesExpensesChart"));
const TopProductsChart = lazy(() => import("../../../components/dashboard/Dashboard/TopProductsChart"));
const TopCustomers = lazy(() => import("../../../components/dashboard/Dashboard/TopCustomers"));
const OverallInformation = lazy(() => import("../../../components/dashboard/Dashboard/OverallInformation"));

const ChartPlaceholder = () => (
  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse h-[500px]">
    <div className="h-6 bg-slate-100 rounded w-1/3 mb-6"></div>
    <div className="h-full bg-slate-50 rounded-2xl"></div>
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
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between mb-8 animate-slide-up shadow-sm group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="bg-amber-500/10 p-2 rounded-xl text-amber-600 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-700 font-medium text-sm md:text-base truncate">
            Your Product <span className="text-amber-600 font-semibold">{product?.name || "Product"}</span> is running Low, already below {product?.minStockThreshold || 5} Pcs., 
            <button className="ml-2 text-amber-600 font-bold underline hover:text-amber-700 transition-colors inline-flex items-center gap-1">
              Add Stock <ExternalLink size={14} />
            </button>
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
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { filter, setPreset } = useDashboardDateFilter();
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
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
    <div className="space-y-0 pb-8 animate-fade-in max-w-[1600px] mx-auto px-2 md:px-4">
      {/* Header with Date Filter */}
      <DashboardHeader
        dateRange={filter.type === "preset" ? filter.preset : "custom"}
        setDateRange={setPreset}
      />

      {/* Alert Section */}
      <LowStockAlert products={lowStockProducts} />

      {/* KPI Cards Section */}
      <KPICards dateRange={effectiveDateRange} />

      {/* Charts Section */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em]">
            Performance Insights
          </h2>
          <div className="h-px bg-slate-100 flex-1 ml-6"></div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sales & Purchase Chart - 2 columns */}
          <div className="xl:col-span-2">
            <Suspense fallback={<ChartPlaceholder />}>
              <SalesExpensesChart dateRange={effectiveDateRange} />
            </Suspense>
          </div>
          
          {/* Overall Information Panel - 1 column */}
          <div>
            <Suspense fallback={<ChartPlaceholder />}>
              <OverallInformation dateRange={effectiveDateRange} />
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
      <div className="mt-8">
        <QuickLists />
      </div>
    </div>
  );
}