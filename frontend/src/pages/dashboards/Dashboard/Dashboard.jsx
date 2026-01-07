import DashboardStat from "../../../components/admin/Dashboard/DashboardStat";
import RevenueChart from "../../../components/admin/Dashboard/RevenueChart";
import PaymentDistribution from "../../../components/admin/Dashboard/PaymentDistribution";
import TopProducts from "../../../components/admin/Dashboard/TopProducts";
import LowStockList from "../../../components/admin/Dashboard/LowStockList";
import ExpiringProducts from "../../../components/admin/Dashboard/ExpiringProducts";

export default function Dashboard(){
    return(
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's your business overview.</p>
            </div>
            
            {/* Key Stats Row */}
            <DashboardStat />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <div className="lg:col-span-2 h-full">
                    <RevenueChart />
                </div>
                <div className="h-full">
                    <PaymentDistribution />
                </div>
            </div>

            {/* Bottom Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                <TopProducts />
                <LowStockList />
                <ExpiringProducts />
            </div>
        </div>
    )
}