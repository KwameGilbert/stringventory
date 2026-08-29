import { useState, useEffect, useMemo } from "react";
import { Package, TrendingDown, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { productService } from "../../../services/business/productService";
import { useCurrency } from "../../../utils/currencyUtils";

const ProductImage = ({ src, alt, fallbackIcon: Icon }) => (
  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <Icon size={18} className="text-gray-300" />
    )}
  </div>
);

const QuickLists = ({ recentOrders: recentOrdersProp = [] }) => {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  // Map orders from the shared prop passed in from Dashboard.jsx
  const recentOrders = useMemo(() => {
    return recentOrdersProp.slice(0, 5).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      customerName: order.customer?.name || order.customerName || "Unknown Customer",
      totalAmount: Number(order.total || 0),
      status: order.status || "pending",
      currency: order.currency || "GHS",
      image: order.items?.[0]?.product?.image || order.items?.[0]?.image || order.image,
    }));
  }, [recentOrdersProp]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch stock and expiring data — orders arrive via prop from Dashboard.jsx
        const [stockRes, expiringRes] = await Promise.all([
          productService.getLowStockProducts({ limit: 5 }),
          productService.getExpiringProducts({ limit: 5 }),
        ]);

        const extractList = (response, key) => {
          const payload = response?.data || response || {};
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload[key])) return payload[key];
          if (Array.isArray(payload.items)) return payload.items;
          if (Array.isArray(payload.results)) return payload.results;
          if (Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload.data?.[key])) return payload.data[key];
          return [];
        };

        const lowStockItems = extractList(stockRes, "products");
        const expiringItems = extractList(expiringRes, "products");

        setLowStock(lowStockItems.slice(0, 5).map((item) => ({
          ...item,
          productName: item.productName || item.name || "Product",
          sku: item.sku || item.code || "—",
          currentStock: Number(item.currentStock ?? item.quantity ?? 0),
          reorderLevel: Number(item.reorderLevel ?? item.reorderThreshold ?? 0),
          image: item.image || item.imageUrl || item.product?.image,
        })));

        setExpiring(expiringItems.slice(0, 5).map((item) => {
          const expiryDate = item.expiryDate || item.expirationDate;
          let daysUntilExpiry = Number(item.daysUntilExpiry ?? 0);
          if (!item.daysUntilExpiry && expiryDate) {
            const now = new Date();
            const target = new Date(expiryDate);
            daysUntilExpiry = Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
          }
          return {
            ...item,
            productName: item.productName || item.name || "Product",
            batchNumber: item.batchNumber || item.batch || "—",
            daysUntilExpiry,
            quantity: Number(item.quantity ?? item.currentStock ?? 0),
            image: item.image || item.imageUrl || item.product?.image,
          };
        }));
      } catch (error) {
        console.error("Error fetching quick lists:", error);
        setLowStock([]);
        setExpiring([]);
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
                key={`order-${order.id}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ProductImage src={order.image} alt={order.orderNumber} fallbackIcon={Package} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{order.customerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.totalAmount, order.currency)}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(
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
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Low Stock</h3>
            </div>
            <Link
              to="/dashboard/inventory"
              className="text-xs font-medium text-amber-600 hover:text-amber-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.map((item, index) => (
              <div
                key={`stock-${item.id}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <ProductImage src={item.image} alt={item.productName} fallbackIcon={TrendingDown} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">SKU: {item.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-amber-600">
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
                key={`expiring-${item.id}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <ProductImage src={item.image} alt={item.productName} fallbackIcon={Clock} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Batch: {item.batchNumber}
                  </p>
                </div>
                <div className="text-right shrink-0">
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
