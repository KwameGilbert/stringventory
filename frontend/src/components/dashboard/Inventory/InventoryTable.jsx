import { useEffect, useState } from "react";
import { Eye, Image, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 8;

const InventoryTable = ({ inventory, onAdjust, viewMode = "list" }) => {
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
    <div className="space-y-6">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {paginatedInventory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-4 transition-all hover:shadow-md group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors" title={item.productName}>
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase truncate">{item.category}</p>
                    </div>
                  </div>
                  {item.expiryDate && (
                    <span className={`inline-block whitespace-nowrap text-[10px] font-bold font-mono uppercase tracking-wide px-2.5 py-1 rounded-md border shadow-2xs shrink-0 ${
                      isExpired(item.expiryDate)
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isExpiringSoon(item.expiryDate)
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>
                      {formatDate(item.expiryDate).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Batch #</p>
                    <p className="text-sm font-mono font-bold text-slate-800">{item.batchNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Stock Level</p>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {item.quantity} <span className="text-xs font-normal text-slate-500">units</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unit Cost</p>
                    <p className="text-sm font-semibold text-slate-700">{formatCurrency(item.unitCost, item.currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Value</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/dashboard/inventory/${item.id}`}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Eye size={16} />
                    Details
                  </Link>
                  <button
                    onClick={() => onAdjust && onAdjust(item)}
                    className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 transition-all font-semibold text-xs px-4 shadow-2xs"
                  >
                    Adjust
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Entry Date</p>
                  <p className="text-xs text-slate-600 font-semibold">{formatDate(item.entryDate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Mobile Card View for List Mode */}
          <div className="grid grid-cols-1 gap-4 md:hidden animate-fade-in">
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
                      <p className="font-semibold text-gray-900 leading-tight">{item.productName}</p>
                      <p className="text-xs text-gray-400 font-medium">{item.category}</p>
                    </div>
                  </div>
                  {item.expiryDate && (
                    <span className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-lg border ${
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
                    <p className="text-sm font-mono font-semibold text-gray-900">{item.batchNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Stock Level</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                      {item.quantity} units
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Unit Cost</p>
                    <p className="text-sm font-medium text-gray-600">{formatCurrency(item.unitCost, item.currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Total Value</p>
                    <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</p>
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

          {/* Desktop Table View for List Mode */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="">
                  <tr className="bg-emerald-100 border-b border-slate-200">
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider w-[260px] whitespace-nowrap">Product</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Batch #</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Supplier</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Unit Cost</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Qty</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Total Value</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Entry</th>
                    <th className="px-4 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Expiry</th>
                    <th className="px-5 py-3.5 text-left text-[13px] font-semibold text-black uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="max-w-[180px] min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors" title={item.productName}>
                              {item.productName}
                            </p>
                            <p className="text-[13px] text-slate-400 font-semibold truncate uppercase tracking-wider mt-0.5">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="inline-block whitespace-nowrap text-xs font-mono font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/60 px-2.5 py-1 rounded-md">
                          {item.batchNumber}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-slate-700 font-medium">{item.supplier}</span>
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-700">{formatCurrency(item.unitCost, item.currency)}</span>
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">{item.quantity}</span>
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        <span className="text-sm font-semibold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</span>
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        <span className="text-xs text-black font-medium">{formatDate(item.entryDate)}</span>
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        {item.expiryDate ? (
                          <span className={`inline-block whitespace-nowrap text-xs font-semibold font-mono uppercase tracking-wide px-2 py-1 rounded-md border shadow-2xs ${
                            isExpired(item.expiryDate)
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : isExpiringSoon(item.expiryDate)
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {formatDate(item.expiryDate).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-left whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAdjust && onAdjust(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-100"
                            title="Adjust Stock"
                          >
                            <Package size={18} />
                          </button>
                          <Link
                            to={`/dashboard/inventory/${item.id}`}
                            className="p-2 rounded-lg text-black hover:bg-slate-50 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Unified Pagination Footer */}
      <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-semibold text-black uppercase tracking-wider">
          Showing <span className="text-slate-900 font-semibold">{startIndex + 1}</span> to{" "}
          <span className="text-slate-900 font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, inventory.length)}</span> of{" "}
          <span className="text-slate-900 font-semibold">{inventory.length}</span> entries
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                    currentPage === page
                      ? 'bg-slate-900 text-white border-transparent shadow-md scale-105'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
