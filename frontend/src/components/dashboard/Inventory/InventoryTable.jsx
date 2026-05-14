import { useEffect, useState } from "react";
import { Eye, Image, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 8;

const InventoryTable = ({ inventory, onAdjust }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { formatPrice } = useCurrency();

  // Pagination logic
  const totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInventory = inventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(inventory.length / ITEMS_PER_PAGE));
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [inventory.length]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (val, currency = "GHS") => formatPrice(val, currency);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (inventory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No inventory found</h3>
        <p className="text-gray-500 text-sm mb-4">Add your first stock intake to get started</p>
        <Link
          to="/dashboard/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedInventory.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900 leading-tight">{item.productName}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.category}</p>
                </div>
              </div>
              {item.expiryDate && (
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg border ${
                  isExpired(item.expiryDate)
                    ? "bg-rose-50 text-rose-700 border-rose-100"
                    : isExpiringSoon(item.expiryDate)
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-gray-50 text-gray-600 border-gray-100"
                }`}>
                  {isExpired(item.expiryDate) ? "Expired" : "Expires"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Batch Number</p>
                <p className="text-sm font-mono font-bold text-gray-900">{item.batchNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Stock Level</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  {item.quantity} units
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Unit Cost</p>
                <p className="text-sm font-medium text-gray-600">{formatCurrency(item.unitCost, item.currency)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Total Value</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/inventory/${item.id}`}
                  className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100 transition-all font-medium text-xs flex items-center gap-2"
                >
                  <Eye size={18} />
                  Details
                </Link>
                <button
                  onClick={() => onAdjust && onAdjust(item)}
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-all font-medium text-xs px-4"
                >
                  Adjust
                </button>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Entry Date</p>
                <p className="text-xs text-gray-600 font-medium">{formatDate(item.entryDate)}</p>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[240px]">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Cost</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="max-w-[180px]">
                        <p className="font-bold text-gray-900 text-sm truncate" title={item.productName}>{item.productName}</p>
                        <p className="text-[11px] text-gray-400 font-medium truncate uppercase tracking-tight">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 font-medium">{item.supplier}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-600">{formatCurrency(item.unitCost, item.currency)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-gray-500 font-medium">{formatDate(item.entryDate)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.expiryDate ? (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${
                        isExpired(item.expiryDate)
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : isExpiringSoon(item.expiryDate)
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}>
                        {formatDate(item.expiryDate)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onAdjust && onAdjust(item)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Adjust Stock"
                      >
                        <Package size={16} />
                      </button>
                      <Link
                        to={`/dashboard/inventory/${item.id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Table Footer with Pagination */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 font-medium">
          Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to{" "}
          <span className="text-gray-900 font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, inventory.length)}</span> of{" "}
          <span className="text-gray-900 font-bold">{inventory.length}</span> entries
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    currentPage === page
                      ? 'bg-gray-900 text-white border-transparent'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
