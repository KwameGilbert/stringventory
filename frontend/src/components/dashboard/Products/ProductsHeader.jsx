import { Plus, Search, Filter, Download, FileText, List, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  categories,
  totalProducts,
  canManage = true,
  onExportExcel,
  onExportPDF,
  viewMode = "list",
  setViewMode,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{totalProducts} products in inventory</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Export Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={onExportExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium border border-gray-200 shadow-2xs"
            >
              <FileText size={16} className="text-emerald-600" />
              Excel
            </button>
            <button 
              onClick={onExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium border border-gray-200 shadow-2xs"
            >
              <Download size={16} className="text-rose-600" />
              PDF
            </button>
          </div>

          {canManage && (
            <Link
              to="/dashboard/products/new"
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm shadow-sm"
            >
              <Plus size={16} />
              Add Product
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, code, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm shadow-2xs"
          />
        </div>

        {/* Controls: Category Filter + List/Grid Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-60 md:flex-initial">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm bg-white appearance-none shadow-2xs cursor-pointer truncate"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
            <button
              onClick={() => setViewMode && setViewMode("list")}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode && setViewMode("grid")}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;

