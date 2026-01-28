import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { PERMISSIONS } from "../../../constants/permissions";
import DashboardHeader from "../../../components/admin/Dashboard/DashboardHeader";
import KPICards from "../../../components/admin/Dashboard/KPICards";
import SalesExpensesChart from "../../../components/admin/Dashboard/SalesExpensesChart";
import TopProductsChart from "../../../components/admin/Dashboard/TopProductsChart";
import TopCustomers from "../../../components/admin/Dashboard/TopCustomers";
import PaymentDistribution from "../../../components/admin/Dashboard/PaymentDistribution";
import QuickLists from "../../../components/admin/Dashboard/QuickLists";

export default function Dashboard() {
  const { hasPermission } = useAuth();
  const [dateRange, setDateRange] = useState("30days");

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header with Date Filter */}
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      {/* KPI Cards Section */}
      {hasPermission(PERMISSIONS.VIEW_DASHBOARD_KPI) && (
        <KPICards dateRange={dateRange} />
      )}

      {/* Charts Section */}
      <div className="space-y-3">
        {(hasPermission(PERMISSIONS.VIEW_DASHBOARD_SALES) || 
          hasPermission(PERMISSIONS.VIEW_DASHBOARD_PAYMENTS) ||
          hasPermission(PERMISSIONS.VIEW_DASHBOARD_PRODUCTS) ||
          hasPermission(PERMISSIONS.VIEW_DASHBOARD_CUSTOMERS)) && (
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Performance Insights
          </h2>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sales & Expenses Trend - 2 columns */}
          {hasPermission(PERMISSIONS.VIEW_DASHBOARD_SALES) && (
            <div className="xl:col-span-2">
              <SalesExpensesChart dateRange={dateRange} />
            </div>
          )}
          
          {/* Payment Distribution - 1 column */}
          {hasPermission(PERMISSIONS.VIEW_DASHBOARD_PAYMENTS) && (
            <div>
              <PaymentDistribution dateRange={dateRange} />
            </div>
          )}
        </div>

        {/* Top Products & Top Customers - 2 columns */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {hasPermission(PERMISSIONS.VIEW_DASHBOARD_PRODUCTS) && (
            <TopProductsChart dateRange={dateRange} />
          )}
          {hasPermission(PERMISSIONS.VIEW_DASHBOARD_CUSTOMERS) && (
            <TopCustomers dateRange={dateRange} />
          )}
        </div>
      </div>

      {/* Quick Access Lists */}
      {hasPermission(PERMISSIONS.VIEW_DASHBOARD_QUICK_ACTIONS) && (
        <QuickLists />
      )}
    </div>
  );
}