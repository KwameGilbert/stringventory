import { Eye, Edit2, Trash2, Package, ChevronLeft, ChevronRight, CheckCircle, Calendar, User, DollarSign, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const PurchasesTable = ({
  purchases,
  onDelete,
  onApprove,
  currentUserRole,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
}) => {
  const { formatPrice } = useCurrency();
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

  const goToPage = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (onPageChange) onPageChange(nextPage);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gray-100 text-gray-700 border-gray-200",
      approved: "bg-blue-50 text-blue-700 border-blue-100",
      partial: "bg-amber-50 text-amber-700 border-amber-100",
      received: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return badges[status] || "bg-gray-50 text-gray-600 border-gray-200";
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
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Link
                  to={`/dashboard/purchases/${purchase.id}`}
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 font-mono flex items-center gap-2"
                >
                  <Hash size={16} className="text-gray-400" />
                  {purchase.waybillNumber || "No Waybill"}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package size={14} />
                  {purchase.supplierName}
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg border ${getStatusBadge(purchase.status)}`}>
                {purchase.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Amount</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(purchase.totalAmount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Date</p>
                <p className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-gray-400" />
                  {formatDate(purchase.purchaseDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/dashboard/purchases/${purchase.id}`}
                  className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                >
                  <Eye size={18} />
                </Link>
                {purchase.status === "pending" && (
                  <Link
                    to={`/dashboard/purchases/${purchase.id}/edit`}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                  >
                    <Edit2 size={18} />
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentUserRole === 'CEO' && purchase.status === 'pending' && onApprove && (
                  <button
                    onClick={() => onApprove(purchase.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold border border-emerald-100 transition-all shadow-sm"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => onDelete && onDelete(purchase.id)}
                  className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <Link
                      to={`/dashboard/purchases/${purchase.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm font-mono"
                    >
                      {purchase.waybillNumber || ""}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{purchase.supplierName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{formatDate(purchase.purchaseDate)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(purchase.totalAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadge(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 font-medium">{purchase.createdBy}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {currentUserRole === 'CEO' && purchase.status === 'pending' && onApprove && (
                        <button
                          onClick={() => onApprove(purchase.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
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
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 text-center sm:text-left">
          Showing <span className="font-medium text-gray-700">{startIndex}</span> to{" "}
          <span className="font-medium text-gray-700">{endIndex}</span> of{" "}
          <span className="font-medium text-gray-700">{totalItems}</span> purchases
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
