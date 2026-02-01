import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, ShoppingBag, User, CreditCard, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

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
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
};

const OrdersTable = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Order ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {order.orderNumber}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {order.customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-400">{order.customer.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                      <p className="text-xs text-gray-400">{formatTime(order.orderDate)}</p>
                    </div>
                  </td>

                  {/* Items Count */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">-</span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</span>
                    {order.discountAmount > 0 && (
                      <p className="text-xs text-emerald-600">-{formatCurrency(order.discountAmount)} discount</p>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/dashboard/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, orders.length)}</span> of{" "}
          <span className="font-medium text-gray-700">{orders.length}</span> sales
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
