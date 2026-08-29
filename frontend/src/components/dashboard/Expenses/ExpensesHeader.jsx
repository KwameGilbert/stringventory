import { Plus, Download, FileText, Search, DollarSign, Repeat, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ExpensesHeader = ({ 
  searchQuery, 
  setSearchQuery,
  totalExpenses,
  recurringExpenses,
  oneTimeExpenses,
  onExportExcel,
  onExportPDF
}) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 text-sm">Track minor and major expenses</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Export Buttons */}
          <button 
            onClick={onExportExcel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200 shadow-sm"
          >
            <FileText size={15} className="text-emerald-600" />
            Excel
          </button>
          <button 
            onClick={onExportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200 shadow-sm"
          >
            <Download size={15} className="text-rose-600" />
            PDF
          </button>

          {/* Add Expense Button */}
          <Link
            to="/dashboard/expenses/new"
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm shadow-lg shadow-gray-900/10"
          >
            <Plus size={16} />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-rose-500 mb-3">
            <DollarSign size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
          <h3 className="text-2xl font-semibold text-slate-800">{formatPrice(totalExpenses)}</h3>
        </div>
        
        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-blue-500 mb-3">
            <Repeat size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Recurring</p>
          <h3 className="text-2xl font-semibold text-slate-800">{formatPrice(recurringExpenses)}</h3>
        </div>

        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-emerald-500 mb-3">
            <CreditCard size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">One-time</p>
          <h3 className="text-2xl font-semibold text-slate-800">{formatPrice(oneTimeExpenses)}</h3>
        </div>
      </div>

      {/* Search Row */}
      <div className="relative w-full md:max-w-lg">
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
