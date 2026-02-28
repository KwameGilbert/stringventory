import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, DollarSign, Clock, CheckCircle } from "lucide-react";
import OrdersHeader from "../../../components/admin/Orders/OrdersHeader";
import OrdersTable from "../../../components/admin/Orders/OrdersTable";
import orderService from "../../../services/orderService";
import { showError } from "../../../utils/alerts";

const extractOrders = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.orders)) return payload.orders;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.orders)) return payload.data.orders;

  return [];
};

const normalizeOrder = (order) => {
  const customerName = order?.customer?.name || order?.customerName || "Unknown Customer";
  const customerEmail = order?.customer?.email || order?.customerEmail || "";
  const customerPhone = order?.customer?.phone || order?.customerPhone || "";
  const orderDate = order?.orderDate || order?.date || order?.createdAt;

  return {
    ...order,
    orderNumber: order?.orderNumber || order?.id || "—",
    orderDate,
    status: order?.status || "pending",
    total: Number(order?.total ?? 0),
    discountAmount: Number(order?.discountAmount ?? order?.discount ?? 0),
    itemCount: Number(order?.itemCount ?? order?.items?.length ?? 0),
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
  };
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient permissions") || message.includes("forbidden");
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermissionDenied(false);
        const response = await orderService.getOrders();
        setOrders(extractOrders(response).map(normalizeOrder));
      } catch (error) {
        console.error("Error loading orders", error);
        if (isForbiddenError(error)) {
          setPermissionDenied(true);
          return;
        }
        showError(error?.message || "Failed to load sales");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status === 'fulfilled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const fulfilledOrders = orders.filter(o => o.status === 'fulfilled').length;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      String(order.orderNumber || order.id || "").toLowerCase().includes(searchLower) ||
      String(order.customer?.name || "").toLowerCase().includes(searchLower) ||
      String(order.customer?.email || "").toLowerCase().includes(searchLower);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to view sales. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* Header */}
      <OrdersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalOrders={orders.length}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Fulfilled */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fulfilled</p>
              <p className="text-2xl font-bold text-gray-900">{fulfilledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
