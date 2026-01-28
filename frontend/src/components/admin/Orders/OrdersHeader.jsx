import { Plus, Download, FileText, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  totalOrders 
}) => {
  const statuses = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "fulfilled", label: "Fulfilled" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sales Management</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">{totalOrders} sales</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200">
            <FileText size={15} className="text-emerald-600" />
            Excel
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200">
            <Download size={15} className="text-rose-600" />
            PDF
          </button>

          {/* Create Order Button */}
          <Link
            to="/dashboard/orders/new"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            New Sale
          </Link>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 appearance-none cursor-pointer min-w-[140px]"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
