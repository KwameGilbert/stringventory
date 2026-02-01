import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, RefreshCw, CheckCircle, Clock, RotateCcw, XCircle, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const statusConfig = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: Clock,
  },
  Completed: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
  Refunded: {
    label: "Refunded",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: RotateCcw,
  },
};

const SalesTable = ({ sales, showPagination = true }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // If pagination is disabled, show all (or handle appropriately upstream)
  const paginatedSales = showPagination ? sales.slice(startIndex, startIndex + ITEMS_PER_PAGE) : sales;

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

  if (sales.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No sales found</h3>
            <p className="text-gray-500 text-sm mb-4">Process a sale in POS to get started</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Transaction ID</th>
              <th className="px-6 py-4 text-left">Date & Time</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Method</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedSales.map((sale) => {
               const status = statusConfig[sale.status] || statusConfig.Pending;
               return (
                <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                    {sale.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {sale.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.method}
                    </td>
                    <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(sale.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Link 
                            to={`/dashboard/sales/${sale.id}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors" 
                            title="View Details"
                        >
                            <Eye size={18} />
                        </Link>
                        <Link 
                            to={`/dashboard/sales/${sale.id}/refund`}
                            className="text-gray-400 hover:text-rose-600 transition-colors"
                            title="Process Refund"
                        >
                            <RefreshCw size={18} />
                        </Link>
                    </div>
                    </td>
                </tr>
            )})}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, sales.length)}</span> of{" "}
            <span className="font-medium text-gray-700">{sales.length}</span> results
            </p>
            
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
        </div>
      )}
    </div>
  );
};

export default SalesTable;
