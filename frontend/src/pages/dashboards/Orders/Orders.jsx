import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, DollarSign, Clock, CheckCircle } from "lucide-react";
import OrdersHeader from "../../../components/admin/Orders/OrdersHeader";
import OrdersTable from "../../../components/admin/Orders/OrdersTable";
import orderService from "../../../services/orderService";
import { showError } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { useCurrency } from "../../../utils/currencyUtils";

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
  const customer = order?.customer || {};
  const customerUser = customer?.user || {};

  const customerName =
    customer?.displayName ||
    (customer?.firstName ? `${customer.firstName} ${customer.lastName || ""}`.trim() : null) ||
    (customerUser?.firstName ? `${customerUser.firstName} ${customerUser.lastName || ""}`.trim() : null) ||
    customer?.name ||
    order?.customerName ||
    "Unknown Customer";

  const customerEmail = customerUser?.email || customer?.email || order?.customerEmail || "";
  const customerPhone = customerUser?.phone || customer?.phone || order?.customerPhone || "";
  const orderDate = order?.orderDate || order?.date || order?.createdAt;

  // Payment method — from transactions array or raw field
  const firstTransaction = Array.isArray(order?.transactions) ? order.transactions[0] : null;
  const paymentMethod = firstTransaction?.paymentMethod || order?.paymentMethod || null;

  // Total from discountedTotalPrice or transaction amount
  let computedTotal = Number(
    order?.discountedTotalPrice ??
    order?.total ??
    order?.totalAmount ??
    firstTransaction?.amount ??
    0
  );
  if (computedTotal === 0 && Array.isArray(order?.items)) {
    computedTotal = order.items.reduce(
      (sum, item) => sum + Number(item.totalPrice || item.quantity * (item.sellingPrice || item.unitPrice || 0) || 0),
      0
    );
  }

  return {
    ...order,
    orderNumber: order?.orderNumber || order?.saleNumber || order?.id || "—",
    orderDate,
    status: order?.status || "pending",
    total: computedTotal,
    paymentMethod,
    discountAmount: Number(order?.discountAmount ?? order?.discount ?? 0),
    itemCount: typeof order?.items === 'number' ? order.items : Number(order?.itemCount ?? order?.items?.length ?? 0),
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
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [responseCurrency, setResponseCurrency] = useState("GHS");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermissionDenied(false);
        const response = await orderService.getOrders();
        const currency = response?.currency || response?.data?.currency || "GHS";
        setResponseCurrency(currency);
        setOrders(extractOrders(response).map(o => ({ ...normalizeOrder(o), currency })));
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
  const totalRevenue = orders
    .filter(o => !['cancelled', 'refunded', 'pending'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => ['fulfilled', 'completed', 'delivered', 'shipped'].includes(o.status)).length;

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

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) return;

    const dataToExport = filteredOrders.map((o) => ({
      "Order #": o.orderNumber || "—",
      Date: o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-GB") : "—",
      Customer: o.customer?.name || "Unknown",
      Status: (o.status || "pending").toUpperCase(),
      Items: Number(o.itemCount || 0),
      Total: Number(o.total || 0).toFixed(2),
      "Currency": o.currency || responseCurrency,
      "Payment Method": (o.paymentMethod || "—").toUpperCase(),
    }));

    exportToExcel(dataToExport, "stringventory_sales", "Sales");
  };

  const handleExportPDF = async () => {
    if (filteredOrders.length === 0) return;

    const tableData = {
      headers: ["Order #", "Date", "Customer", "Total", "Status"],
      rows: filteredOrders.map((o) => [
        o.orderNumber || "—",
        o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-GB") : "—",
        o.customer?.name || "Unknown",
        `${o.currency || responseCurrency} ${Number(o.total || 0).toFixed(2)}`,
        (o.status || "pending").toUpperCase(),
      ]),
    };

    try {
      await exportToPDF({
        title: "Sales Transaction Report",
        subtitle: `Generated for ${filteredOrders.length} records`,
        fileName: "stringventory_sales",
        table: tableData,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

  // Replaced local formatCurrency with useCurrency's formatPrice logic

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
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Sales</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total Revenue</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight truncate">
                {formatPrice(totalRevenue, responseCurrency)}
              </p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Pending</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Completed</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
