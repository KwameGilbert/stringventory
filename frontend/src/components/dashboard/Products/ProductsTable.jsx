import { useState } from "react";
import { Eye, Edit2, Trash2, Package, AlertTriangle, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 5;

const renderText = (value, fallback = "—") => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    return value.name || value.title || value.label || fallback;
  }
  return fallback;
};

const ProductsTable = ({ products, onDelete, canManage = true, viewMode = "list" }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No products found</h3>
        <p className="text-slate-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
        {canManage && (
          <Link
            to="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
          >
            Add your first product
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {paginatedProducts.map((product) => {
            const isLowStock = product.currentStock <= product.reorderThreshold && product.currentStock > 0;
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden transition-all hover:shadow-md group flex flex-col justify-between">
                {/* Full-width Image Header */}
                <div className="h-28 w-full bg-slate-100 relative overflow-hidden shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400">
                      <Package className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                      <span className="text-xs font-medium text-slate-400 truncate px-2">{renderText(product.category, "Category")}</span>
                    </div>
                  )}

                  {/* Absolute Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm border border-white/20 truncate max-w-[120px]">
                      {renderText(product.category, "General")}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm border border-white/20 ${
                      product.status === 'inactive'
                        ? "bg-slate-700 text-white"
                        : product.currentStock === 0
                        ? "bg-rose-600 text-white"
                        : isLowStock
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600/90 text-white backdrop-blur-md"
                    }`}>
                      {product.status === 'inactive' ? 'Inactive' : product.currentStock === 0 ? 'Out of stock' : isLowStock ? 'Low stock' : `${product.currentStock} in stock`}
                    </span>
                  </div>
                </div>

                {/* Card Body & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="mb-2">
                      <Link
                        to={`/dashboard/products/${product.id}`}
                        className="font-semibold text-slate-900 text-base leading-tight hover:text-blue-600 transition-colors line-clamp-1 block"
                        title={product.name}
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-500 font-medium mt-1 truncate">Supplier: <span className="text-slate-700 font-semibold">{renderText(product.supplier)}</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mt-4 mb-1">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">SKU / Code</p>
                        <p className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded w-fit truncate max-w-full">{product.sku || product.code || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Stock Level</p>
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                          {product.currentStock} <span className="text-xs font-normal text-slate-500">units</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Cost Price</p>
                        <p className="text-sm font-semibold text-slate-700">{formatPrice(product.costPrice)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Selling Price</p>
                        <p className="text-sm font-semibold text-emerald-600">{formatPrice(product.sellingPrice)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/dashboard/products/${product.id}`}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                        title="View Details"
                      >
                        <Eye size={16} />
                        Details
                      </Link>
                      {canManage && (
                        <Link
                          to={`/dashboard/products/${product.id}/edit`}
                          className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Link>
                      )}
                    </div>
                    {canManage && (
                      <button
                        onClick={() => onDelete && onDelete(product.id)}
                        className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 shadow-2xs"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/dashboard/products/${product.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-base block truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{product.code}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-sm font-semibold text-slate-900">{formatPrice(product.sellingPrice)}</p>
                        <p className="text-xs text-slate-400">Cost: {formatPrice(product.costPrice)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 font-semibold">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                        {renderText(product.category, "Unknown")}
                      </span>
                      {product.status === 'inactive' ? (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
                          Inactive
                        </span>
                      ) : product.currentStock === 0 ? (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                          {product.currentStock} in stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/dashboard/products/${product.id}`}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    {canManage && (
                      <Link
                        to={`/dashboard/products/${product.id}/edit`}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all border border-blue-200 shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Link>
                    )}
                  </div>
                  {canManage && (
                    <button 
                      onClick={() => onDelete && onDelete(product.id)}
                      className="flex items-center gap-1.5 px-3 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all text-xs font-semibold border border-rose-100 shadow-2xs"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap w-48">Product</th>
                    <th className="px-1 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">SKU / Code</th>
                    <th className="px-1 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th className="px-1 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Supplier</th>
                    <th className="px-1 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Cost</th>
                    <th className="px-1 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                    <th className="px-1 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                    <th className="px-1 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((product) => {
                    const isLowStock = product.currentStock <= product.reorderThreshold && product.currentStock > 0;
                    
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/75 transition-colors group">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="max-w-20 truncate">
                              <Link 
                                to={`/dashboard/products/${product.id}`}
                                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm block truncate"
                                title={product.name}
                              >
                                {product.name}
                              </Link>
                              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate" title={product.code}>{product.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs text-slate-700 font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                            {product.sku || product.code || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap max-w-28 truncate" title={renderText(product.category, "Unknown")}>
                          <span className="text-sm font-semibold text-slate-700 truncate block">{renderText(product.category, "Unknown")}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap max-w-28 truncate" title={renderText(product.supplier)}>
                          <span className="text-sm font-medium text-slate-600 truncate block">{renderText(product.supplier)}</span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className="text-sm text-slate-700 font-semibold">
                            {formatPrice(product.costPrice)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className="text-sm text-emerald-600 font-semibold">
                            {formatPrice(product.sellingPrice)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                            <span className={`text-sm font-semibold ${product.currentStock === 0 ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                              {product.currentStock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {product.status === 'inactive' ? (
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs uppercase tracking-wider">
                              Inactive
                            </span>
                          ) : product.currentStock === 0 ? (
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs uppercase tracking-wider">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs uppercase tracking-wider">
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs uppercase tracking-wider">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/dashboard/products/${product.id}`}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                            {canManage && (
                              <>
                                <Link
                                  to={`/dashboard/products/${product.id}/edit`}
                                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200/80 shadow-2xs transition-all"
                                  title="Edit Product"
                                >
                                  <Edit2 size={16} />
                                </Link>
                                <button 
                                  onClick={() => onDelete && onDelete(product.id)}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 border border-rose-200/80 shadow-2xs transition-all"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Universal Pagination Footer */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm font-medium text-slate-500">
          Showing <span className="font-semibold text-slate-800">{products.length === 0 ? 0 : startIndex + 1}</span> to{" "}
          <span className="font-semibold text-slate-800">{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</span> of{" "}
          <span className="font-semibold text-slate-800">{products.length}</span> products
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 shadow-2xs p-1 bg-slate-50 rounded-xl border border-slate-200/80">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs font-semibold"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center px-1 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-slate-900 text-white shadow-xs scale-105'
                      : 'hover:bg-slate-200/70 text-slate-700 font-semibold'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs font-semibold"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;
