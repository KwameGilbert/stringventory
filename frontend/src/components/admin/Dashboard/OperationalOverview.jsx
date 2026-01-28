import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Package, AlertTriangle, Clock } from "lucide-react";

const OperationalOverview = ({ dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiryTab, setExpiryTab] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/operational-overview.json");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching operational data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  const getExpiryCount = () => {
    if (!data?.expiringStock) return 0;
    switch (expiryTab) {
      case "30": return data.expiringStock.next30Days;
      case "60": return data.expiringStock.next60Days;
      case "90": return data.expiringStock.next90Days;
      default: return 0;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Operational Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            {data?.totalOrders?.change !== 0 && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                data?.totalOrders?.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}>
                {data?.totalOrders?.trend === "up" ? "+" : ""}{data?.totalOrders?.change}%
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(data?.totalOrders?.value || 0)}</p>
        </div>

        {/* Stock on Hand */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-cyan-100">
              <Package className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Stock on Hand</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(data?.stockOnHand?.units || 0)} <span className="text-sm font-normal text-gray-400">units</span></p>
          <p className="text-sm text-gray-500">{formatCurrency(data?.stockOnHand?.value || 0)}</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            {data?.lowStockAlerts?.critical > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {data.lowStockAlerts.critical} critical
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-1">Low Stock Alerts</p>
          <p className="text-xl font-bold text-gray-900">{data?.lowStockAlerts?.count || 0} <span className="text-sm font-normal text-gray-400">items</span></p>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Expiring Soon</p>
          <p className="text-xl font-bold text-gray-900">{getExpiryCount()} <span className="text-sm font-normal text-gray-400">items</span></p>
          <div className="flex gap-1 mt-2">
            {["30", "60", "90"].map((days) => (
              <button
                key={days}
                onClick={() => setExpiryTab(days)}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                  expiryTab === days
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalOverview;
