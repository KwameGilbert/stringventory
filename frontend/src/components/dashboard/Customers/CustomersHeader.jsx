import { Plus, Download, FileText, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CustomersHeader = ({ 
  searchQuery, 
  setSearchQuery,
  sortBy,
  setSortBy,
  totalCustomers,
  canManage = true,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-2">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-gray-900 rounded-2xl shadow-xl shadow-gray-900/10">
            <Users className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Database</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-1">
            <span className="text-gray-900">{totalCustomers}</span> Registered Accounts
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative group min-w-[280px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
            <div className="relative">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all shadow-sm appearance-none cursor-pointer hover:bg-gray-50 min-w-[140px]"
                >
                    <option value="newest">Recent First</option>
                    <option value="name_asc">Alphabetical</option>
                    <option value="spend_desc">Top Spender</option>
                    <option value="orders_desc">Loyalty Score</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
            </div>

            <div className="w-px h-8 bg-gray-100 mx-1"></div>

            <div className="flex items-center gap-1.5">
                <button 
                onClick={onExportExcel}
                className="p-2.5 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm group"
                title="Export Excel"
                >
                    <FileText size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                onClick={onExportPDF}
                className="p-2.5 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm group"
                title="Export PDF"
                >
                    <Download size={18} className="text-rose-600 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {canManage && (
                <Link
                    to="/dashboard/customers/new"
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white pl-4 pr-5 py-2.5 rounded-xl transition-all font-bold text-xs shadow-xl shadow-gray-900/10 active:scale-95 ml-2"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Profile</span>
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
