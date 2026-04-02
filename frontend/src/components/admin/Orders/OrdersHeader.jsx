import { Plus, Download, FileText, Search, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  totalOrders,
  onExportExcel,
  onExportPDF,
}) => {
  const statuses = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "fulfilled", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div className="space-y-4">
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500 text-sm tracking-tight">{totalOrders} total sales recorded</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button 
            onClick={onExportExcel}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
          >
            <FileText size={15} className="text-emerald-600" />
            Excel
          </button>
          <button 
            onClick={onExportPDF}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
          >
            <Download size={15} className="text-rose-600" />
            PDF
          </button>
          
          <div className="w-px h-8 bg-gray-100 mx-1 hidden md:block"></div>

          {/* New Sale Button */}
          <Link
            to="/dashboard/orders/new"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium text-sm shadow-lg shadow-gray-900/10"
          >
            <Plus size={16} />
            New Sale
          </Link>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order # or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-200 outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 bg-gray-50 border-transparent rounded-lg text-sm bg-white focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-200 outline-none transition-all appearance-none cursor-pointer min-w-[140px]"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
