import { Plus, Download, FileText, Search, Filter, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";

const InventoryHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  categories,
  totalItems,
  onExportExcel,
  onExportPDF,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="space-y-6 pb-2">
      {/* Title Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Stock Intake • {totalItems} total batches</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Export Buttons */}
          <button 
            onClick={onExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors text-sm border border-slate-200 shadow-2xs"
          >
            <FileText size={16} className="text-emerald-600" />
            Excel
          </button>
          <button 
            onClick={onExportPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors text-sm border border-slate-200 shadow-2xs"
          >
            <Download size={16} className="text-rose-600" />
            PDF
          </button>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, batches, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 shadow-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Category Filter */}
          <div className="relative w-full sm:w-56">
            <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 appearance-none cursor-pointer shadow-xs transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-2xs shrink-0">
            <button
              onClick={() => setViewMode && setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="List View"
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode && setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
