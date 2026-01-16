import { useState, useEffect } from "react";
import axios from "axios";
import { Package, TrendingDown, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLists = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, stockRes, expiringRes] = await Promise.all([
          axios.get("/data/orders.json"),
          axios.get("/data/low-stock.json"),
          axios.get("/data/expiring-products.json"),
        ]);

        // Map orders data to match expected format
        const mappedOrders = (ordersRes.data || []).slice(0, 5).map(order => ({
          id: order.id,
          orderNumber: order.id,
          customerName: order.customer?.name || "Unknown Customer",
          totalAmount: order.total || 0,
          status: order.status || "pending",
        }));

        setRecentOrders(mappedOrders);
        setLowStock((stockRes.data || []).slice(0, 5));
        
        // Expiring products is now a direct array
        setExpiring((expiringRes.data || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching quick lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      processing: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Quick Access Lists
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <Link
              to="/dashboard/orders"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div
                key={order.id || `order-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Low Stock</h3>
            </div>
            <Link
              to="/dashboard/inventory"
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.map((item, index) => (
              <div
                key={item.id || `stock-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">
                    {item.currentStock} units
                  </p>
                  <p className="text-xs text-gray-500">
                    Min: {item.reorderLevel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Expiring Soon</h3>
            </div>
            <Link
              to="/dashboard/inventory"
              className="text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {expiring.map((item, index) => (
              <div
                key={item.id || `expiring-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Batch: {item.batchNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-600">
                    {item.daysUntilExpiry} days
                  </p>
                  <p className="text-xs text-gray-500">{item.quantity} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLists;
