import { useState } from "react";
import { Eye, Trash2, Image, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const InventoryTable = ({ inventory, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInventory = inventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Cost</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Value</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Image className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                </td>

                {/* Batch Number */}
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    {item.batchNumber}
                  </span>
                </td>

                {/* Supplier */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{item.supplier}</span>
                </td>

                {/* Unit Cost */}
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-gray-900">{formatCurrency(item.unitCost)}</span>
                </td>

                {/* Quantity */}
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                </td>

                {/* Total Value */}
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.totalValue)}</span>
                </td>

                {/* Entry Date */}
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-600">{formatDate(item.entryDate)}</span>
                </td>

                {/* Expiry Date */}
                <td className="px-4 py-3 text-center">
                  {item.expiryDate ? (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isExpired(item.expiryDate)
                        ? "bg-rose-100 text-rose-700"
                        : isExpiringSoon(item.expiryDate)
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {formatDate(item.expiryDate)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/dashboard/inventory/${item.id}`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <button 
                      onClick={() => onDelete && onDelete(item.id)}
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
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, inventory.length)}</span> of{" "}
          <span className="font-medium text-gray-700">{inventory.length}</span> entries
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

export default InventoryTable;
