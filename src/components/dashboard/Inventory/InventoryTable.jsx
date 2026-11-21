import { useEffect, useState } from "react";
import { Eye, Image, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const InventoryTable = ({ inventory, onAdjust, viewMode = "list" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { formatPrice } = useCurrency();

  // Pagination logic
  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = inventory.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(inventory.length / itemsPerPage));
    setCurrentPage((prev) => Math.min(prev, maxPage));
  }, [inventory.length, itemsPerPage]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {paginatedInventory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden transition-all hover:shadow-md group flex flex-col justify-between">
              {/* Full-width Image Header */}
              <div className="h-36 w-full bg-slate-100 relative overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400">
                    <Package className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                    <span className="text-xs font-medium text-slate-400">{item.category}</span>
                  </div>
                )}

                {/* Absolute Floating Badges on top of Image */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-white/20">
                    {item.category}
                  </span>
                  {item.expiryDate && (
                    <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-white/20 ${
                      isExpired(item.expiryDate)
                        ? "bg-rose-600 text-white"
                        : isExpiringSoon(item.expiryDate)
                        ? "bg-amber-500 text-white"
                        : "bg-slate-900/80 text-white backdrop-blur-md"
                    }`}>
                      {isExpired(item.expiryDate) ? "Expired" : `Exp: ${formatDate(item.expiryDate)}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="mb-2">
                    <p className="font-semibold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1" title={item.productName}>
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1 truncate">Supplier: <span className="text-slate-700 font-semibold">{item.supplier}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 mt-4 mb-1">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Batch #</p>
                      <p className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded w-fit">{item.batchNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Stock Level</p>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        {item.quantity} <span className="text-xs font-normal text-slate-500">units</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Unit Cost</p>
                      <p className="text-sm font-semibold text-slate-700">{formatCurrency(item.unitCost, item.currency)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Total Value</p>
                      <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
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
                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Entry Date</p>
                    <p className="text-xs text-slate-600 font-semibold">{formatDate(item.entryDate)}</p>
                  </div>
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
                  <tr className="bg-emerald-50 border-b border-slate-200">
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider w-[260px] whitespace-nowrap">Product</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Batch #</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Supplier</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Unit Cost</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Qty</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Total Value</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Entry</th>
                    <th className="px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Expiry</th>
                    <th className="px-4 py-2.5 text-left text-[13px] font-medium text-slate-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="max-w-[180px] min-w-0 flex-1">
                            <p className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors" title={item.productName}>
                              {item.productName}
                            </p>
                            <p className="text-[12px] text-slate-400 font-medium truncate uppercase tracking-wider mt-0.5">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-block whitespace-nowrap text-xs font-mono font-medium text-slate-700 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-md">
                          {item.batchNumber}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="text-sm text-slate-600 font-medium">{item.supplier}</span>
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{formatCurrency(item.unitCost, item.currency)}</span>
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{item.quantity}</span>
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        <span className="text-sm font-medium text-emerald-600">{formatCurrency(item.totalValue, item.currency)}</span>
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        <span className="text-xs text-slate-600 font-medium">{formatDate(item.entryDate)}</span>
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        {item.expiryDate ? (
                          <span className={`inline-block whitespace-nowrap text-[11px] font-medium font-mono uppercase tracking-wide px-2 py-0.5 rounded-md border shadow-2xs ${
                            isExpired(item.expiryDate)
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : isExpiringSoon(item.expiryDate)
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {formatDate(item.expiryDate).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-left whitespace-nowrap">
                        <div className="flex items-center justify-start gap-1">
                          <button
                            onClick={() => onAdjust && onAdjust(item)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-transparent hover:border-blue-100"
                            title="Adjust Stock"
                          >
                            <Package size={16} />
                          </button>
                          <Link
                            to={`/dashboard/inventory/${item.id}`}
                            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
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
        </>
      )}

      {/* Unified Pagination Footer */}
      <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900 font-bold">{inventory.length === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, inventory.length)}</span> of{" "}
            <span className="text-slate-900 font-bold">{inventory.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {[5, 10, 20, 50].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        
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
