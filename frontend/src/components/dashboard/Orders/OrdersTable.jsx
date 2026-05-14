import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, ShoppingBag, User, CreditCard, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 8;

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: RotateCcw,
  },
  shipped: {
    label: "Shipped",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  fulfilled: {
    label: "Fulfilled",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
};

const OrdersTable = ({ orders }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (val, currency = "GHS") => formatPrice(val, currency);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No sales found</h3>
        <p className="text-gray-500 text-sm mb-4">Create your first sale to get started</p>
        <Link
          to="/dashboard/orders/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          New Sale
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedOrders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          const customerName = order?.customer?.name || order?.customerName || "Walk-in Customer";
          const customerInitials = customerName
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "WC";

          return (
            <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {customerInitials}
                  </div>
                  <div>
                    <Link to={`/dashboard/orders/${order.id}`} className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors">
                      {order.orderNumber}
                    </Link>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{customerName}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                  <StatusIcon size={10} />
                  {status.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Date</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(order.orderDate)}</p>
                  <p className="text-xs text-gray-400">{formatTime(order.orderDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(order.total, order.currency)}</p>
                  {order.discountAmount > 0 && (
                    <p className="text-[10px] text-emerald-600">-{formatCurrency(order.discountAmount, order.currency)}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] items-center flex gap-1 font-bold text-gray-400 uppercase tracking-widest">
                     <CreditCard size={12} /> {String(order?.paymentMethod || "cash").replace("_", " ")}
                   </span>
                   <span className="text-gray-300">•</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     {order.itemCount} items
                   </span>
                </div>
                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  <Eye size={14} />
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order</th>
                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-4 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const customerName = order?.customer?.name || order?.customerName || "Walk-in Customer";
                const customerPhone = order?.customer?.phone || order?.customerPhone || "-";
                const customerInitials = customerName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "WC";
                const paymentMethodLabel = String(order?.paymentMethod || "cash").replace("_", " ");

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Order ID */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {customerInitials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{customerName}</p>
                          <p className="text-xs text-gray-400 tracking-tight">{customerPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <p className="font-medium">{formatDate(order.orderDate)}</p>
                      <p className="text-xs text-gray-400">{formatTime(order.orderDate)}</p>
                    </td>

                    {/* Items Count */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900">{order.itemCount}</span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total, order.currency)}</span>
                      {order.discountAmount > 0 && (
                        <p className="text-[10px] text-emerald-600 font-bold">-{formatCurrency(order.discountAmount, order.currency)} discount</p>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-bold capitalize border border-gray-100">
                        <CreditCard size={12} className="text-gray-400" />
                        {paymentMethodLabel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
          <span className="text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, orders.length)}</span> of{" "}
          <span className="text-gray-900">{orders.length}</span> sales
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
