import { Plus, Search, Filter, LayoutGrid, List, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

const SuppliersHeader = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  view,
  setView,
  totalSuppliers,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <div className="flex flex-col space-y-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200 mb-6">
      {/* Top Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">{totalSuppliers} partners and distributors registered</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Pill Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-2xs border border-slate-200/60">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "list"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50 font-medium"
              }`}
              title="List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "grid"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50 font-medium"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={onExportExcel}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
            title="Export to Excel"
          >
            <FileText size={15} className="text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
            title="Export to PDF"
          >
            <Download size={15} className="text-rose-600" />
            <span>PDF</span>
          </button>

          {/* Add Supplier Button */}
          <Link
            to="/dashboard/suppliers/new"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-slate-900/20 active:scale-95"
          >
            <Plus size={16} />
            <span>Add Supplier</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-auto shadow-2xs">
          <Filter size={16} className="text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-slate-700 w-full cursor-pointer focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SuppliersHeader;
