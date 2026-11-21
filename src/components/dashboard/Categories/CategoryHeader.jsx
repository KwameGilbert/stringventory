import { Plus, Download, FileText, LayoutGrid, List, Search } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryHeader = ({ view, setView, totalCategories, searchTerm, setSearchTerm, canManage = true, onExportExcel, onExportPDF }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
      {/* Title & Count */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Categories</h1>
        <p className="text-slate-500 text-sm font-medium mt-0.5">{totalCategories} categories available</p>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* View Mode Pill Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-2xs border border-slate-200/60">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
            }`}
            title="List View"
          >
            <List size={15} />
            <span>List</span>
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
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
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95"
          title="Export to Excel"
        >
          <FileText size={15} className="text-emerald-600" />
          <span>Excel</span>
        </button>
        <button
          onClick={onExportPDF}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-xs font-semibold border border-slate-200 shadow-2xs active:scale-95"
          title="Export to PDF"
        >
          <Download size={15} className="text-rose-600" />
          <span>PDF</span>
        </button>

        {/* Add Category Button */}
        {canManage && (
          <Link
            to="/dashboard/categories/new"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-slate-900/20 active:scale-95"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CategoryHeader;
