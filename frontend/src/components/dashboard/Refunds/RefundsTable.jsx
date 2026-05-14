import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, RefreshCw, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
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
  completed: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
};

const RefundsTable = ({ refunds }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(refunds.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRefunds = refunds.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (refunds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <RotateCcw className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No refunds found</h3>
        <p className="text-gray-500 text-sm">Refund requests will appear here once submitted</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Refund ID</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {paginatedRefunds.map((refund) => {
              const status = statusConfig[refund.refundStatus] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      #{refund.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                        {refund.customer?.firstName ? `${refund.customer.firstName} ${refund.customer.lastName || ''}`.trim() : "Unknown"}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{refund.customer?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                        to={`/dashboard/orders/${refund.orderId}`}
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        {refund.order?.orderNumber || `#${refund.orderId}`}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-600 font-medium">{formatDate(refund.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-bold text-gray-900">{formatPrice(refund.refundAmount, refund.currency)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${status.bg} ${status.text} border-2 border-transparent`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/dashboard/refunds/${refund.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
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

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100 italic">
        {paginatedRefunds.map((refund) => {
          const status = statusConfig[refund.refundStatus] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div key={refund.id} className="p-4 space-y-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded w-fit">
                        #{refund.id}
                    </span>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">
                        {refund.customer?.firstName ? `${refund.customer.firstName} ${refund.customer.lastName || ''}`.trim() : "Unknown"}
                    </span>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                        Order <Link to={`/dashboard/orders/${refund.orderId}`} className="text-blue-600">#{refund.order?.orderNumber || refund.orderId}</Link>
                    </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${status.bg} ${status.text}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                  <span className="text-lg font-semibold text-rose-600">{formatPrice(refund.refundAmount, refund.currency)}</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                  <span className="text-sm font-semibold text-gray-700">{formatDate(refund.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/refunds/${refund.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{startIndex + 1}</span> -{" "}
            <span className="text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, refunds.length)}</span> of{" "}
            <span className="text-gray-900">{refunds.length}</span>
            </p>
            
            <div className="flex items-center gap-2">
                <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                >
                <ChevronLeft size={18} className="text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <div className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold shadow-lg shadow-gray-900/10">
                    {currentPage} / {totalPages}
                </div>
                
                <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                >
                <ChevronRight size={18} className="text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default RefundsTable;
