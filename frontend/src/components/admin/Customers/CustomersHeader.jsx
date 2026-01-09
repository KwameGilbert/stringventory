import { Plus, Download, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const CustomersHeader = ({ 
  searchQuery, 
  setSearchQuery,
  totalCustomers 
}) => {
  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">{totalCustomers} customers</p>
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

          {/* Add Customer Button */}
          <Link
            to="/dashboard/customers/new"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            Add Customer
          </Link>
        </div>
      </div>

      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, business, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomersHeader;
