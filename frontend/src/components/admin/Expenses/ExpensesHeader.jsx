import { Plus, Download, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const ExpensesHeader = ({ 
  searchQuery, 
  setSearchQuery,
  totalExpenses,
  recurringExpenses,
  oneTimeExpenses
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 text-sm">Track minor and major expenses</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200">
            <FileText size={15} />
            Excel
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-200">
            <Download size={15} />
            PDF
          </button>

          {/* Add Expense Button */}
          <Link
            to="/dashboard/expenses/new"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm shadow-lg shadow-gray-900/10"
          >
            <Plus size={16} />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
          <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <p className="text-gray-500 text-sm mb-1">Recurring</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(recurringExpenses)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>
          <p className="text-gray-500 text-sm mb-1">One-time</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(oneTimeExpenses)}</p>
        </div>
      </div>

      {/* Search Row */}
      <div className="relative max-w-lg">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by category or reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 shadow-sm"
        />
      </div>
    </div>
  );
};

export default ExpensesHeader;
