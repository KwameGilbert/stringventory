import { useState } from "react";
import DashboardHeader from "../../../components/admin/Dashboard/DashboardHeader";
import FinancialOverview from "../../../components/admin/Dashboard/FinancialOverview";
import OperationalOverview from "../../../components/admin/Dashboard/OperationalOverview";
import RevenueChart from "../../../components/admin/Dashboard/RevenueChart";
import PaymentDistribution from "../../../components/admin/Dashboard/PaymentDistribution";
import TopProducts from "../../../components/admin/Dashboard/TopProducts";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("30days");

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Date Filter */}
      <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

      {/* Financial Overview */}
      <FinancialOverview dateRange={dateRange} />

      {/* Operational Overview */}
      <OperationalOverview dateRange={dateRange} />

      {/* Performance Insights Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Performance Insights</h2>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RevenueChart dateRange={dateRange} />
          </div>
          <div>
            <PaymentDistribution dateRange={dateRange} />
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}