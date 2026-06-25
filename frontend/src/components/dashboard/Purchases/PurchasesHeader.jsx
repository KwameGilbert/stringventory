import { Search, Plus, Download, FileText, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const PurchasesHeader = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Title and Primary Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage purchase orders and stock receiving
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Export Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={onExportExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
            >
              <FileText size={15} className="text-emerald-600" />
              Excel
            </button>
            <button 
              onClick={onExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
            >
              <Download size={15} className="text-rose-600" />
              PDF
            </button>
          </div>

          <Link
            to="/dashboard/purchases/new"
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm font-semibold"
          >
            <Plus size={16} />
            New Purchase
          </Link>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search waybill or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 appearance-none transition-all"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="partial">Partial</option>
            <option value="received">Received</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PurchasesHeader;
