import { useState } from "react";
import { Eye, Edit2, Trash2, Package, AlertTriangle, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const ProductsTable = ({ products, onDelete }) => {
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
        <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
        <Link
          to="/dashboard/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add your first product
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedProducts.map((product) => {
              const isLowStock = product.currentStock <= product.reorderThreshold && product.currentStock > 0;
              
              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Product with Image */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link 
                          to={`/dashboard/products/${product.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-400 font-mono">{product.code}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* SKU */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{product.sku || "—"}</span>
                  </td>
                  
                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  
                  {/* Supplier */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{product.supplier || "—"}</span>
                  </td>
                  
                  {/* Cost Price */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-900 font-medium">
                      GH₵{product.costPrice ? product.costPrice.toFixed(2) : "0.00"}
                    </span>
                  </td>
                  
                  {/* Selling Price */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-gray-900 font-semibold">
                      GH₵{product.sellingPrice ? product.sellingPrice.toFixed(2) : "0.00"}
                    </span>
                  </td>
                  
                  {/* Stock Level */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      <span className={`text-sm font-medium ${product.currentStock === 0 ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.currentStock}
                      </span>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    {product.status === 'inactive' ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    ) : product.currentStock === 0 ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-100 text-rose-700">
                        Out of Stock
                      </span>
                    ) : product.currentStock <= product.reorderThreshold ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        In Stock
                      </span>
                    )}
                  </td>
                  
                  {/* Actions - Always visible */}
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/dashboard/products/${product.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/dashboard/products/${product.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => onDelete && onDelete(product.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Pagination */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</span> of{" "}
          <span className="font-medium text-gray-700">{products.length}</span> products
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

export default ProductsTable;


