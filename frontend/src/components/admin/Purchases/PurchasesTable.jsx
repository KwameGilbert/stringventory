import { useState } from "react";
import { Eye, Edit2, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const PurchasesTable = ({ purchases, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPurchases = purchases.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gray-100 text-gray-700",
      partial: "bg-amber-100 text-amber-700",
      received: "bg-emerald-100 text-emerald-700",
    };
    return badges[status] || "bg-gray-100 text-gray-600";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No purchases found</h3>
        <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
        <Link
          to="/dashboard/purchases/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create your first purchase
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waybill</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedPurchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Waybill Number */}
                <td className="px-6 py-3">
                  <Link
                    to={`/dashboard/purchases/${purchase.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm font-mono"
                  >
                    {purchase.waybillNumber}
                  </Link>
                </td>

                {/* Supplier */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{purchase.supplierName}</span>
                </td>

                {/* Purchase Date */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{formatDate(purchase.purchaseDate)}</span>
                </td>

                {/* Total Amount */}
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(purchase.totalAmount)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadge(purchase.status)}`}>
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span>
                </td>

                {/* Created By */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{purchase.createdBy}</span>
                </td>

                {/* Actions */}
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/dashboard/purchases/${purchase.id}`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    {purchase.status === "pending" && (
                      <Link
                        to={`/dashboard/purchases/${purchase.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                    )}
                    <button
                      onClick={() => onDelete && onDelete(purchase.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, purchases.length)}</span> of{" "}
          <span className="font-medium text-gray-700">{purchases.length}</span> purchases
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

export default PurchasesTable;
