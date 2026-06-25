import { useState } from "react";
import { Eye, Edit2, Trash2, Repeat, Paperclip, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 8;

const ExpensesTable = ({ expenses, onDelete }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = expenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No expenses found</h3>
        <p className="text-gray-500 text-sm mb-4">Add your first expense to get started</p>
        <Link
          to="/dashboard/expenses/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-1">
        {paginatedExpenses.map((expense) => (
          <div key={expense.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${expense.isRecurring ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {expense.isRecurring ? <Repeat size={18} /> : <Paperclip size={18} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {typeof expense.category === 'object' ? expense.category?.name : expense.category}
                  </h3>
                  <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-rose-600">{formatPrice(expense.amount, expense.currency)}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  expense.status === 'paid' || expense.status === 'completed' || expense.status === 'successful'
                    ? 'bg-emerald-100 text-emerald-700' :
                  expense.status === 'pending' || expense.status === 'processing'
                    ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {expense.status || 'pending'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm border-t border-gray-50 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Reference:</span>
                <span className="text-gray-900 font-medium">{expense.reference || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="text-gray-900 capitalize">{expense.paymentMethod?.replace(/_/g, " ") || "-"}</span>
              </div>
              {expense.notes && (
                <div className="mt-1">
                  <p className="text-gray-500 text-xs mb-1">Notes:</p>
                  <p className="text-gray-600 text-xs italic line-clamp-2">{expense.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                to={`/dashboard/expenses/${expense.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <Eye size={14} /> View
              </Link>
              <Link
                to={`/dashboard/expenses/${expense.id}/edit`}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={14} /> Edit
              </Link>
              <button 
                onClick={() => onDelete(expense.id)}
                className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors border border-transparent"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {typeof expense.category === 'object' ? expense.category?.name : expense.category}
                      </span>
                      {expense.isRecurring && (
                        <Repeat size={14} className="text-blue-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-rose-600">{formatPrice(expense.amount, expense.currency)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm">{formatDate(expense.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 text-sm">{expense.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm font-medium capitalize">
                      {expense.paymentMethod?.replace(/_/g, " ") || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                      expense.isRecurring 
                        ? "bg-blue-50 text-blue-600" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {expense.isRecurring ? "Recurring" : "One-Time"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      expense.status === 'paid' || expense.status === 'completed' || expense.status === 'successful'
                        ? 'bg-emerald-100 text-emerald-700' :
                      expense.status === 'pending' || expense.status === 'processing'
                        ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {expense.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <span className="truncate text-gray-500 text-sm">{expense.notes}</span>
                      {expense.hasAttachment && (
                        <Paperclip size={14} className="text-gray-400 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/expenses/${expense.id}`}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/dashboard/expenses/${expense.id}/edit`}
                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => onDelete(expense.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Container */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, expenses.length)}</span> of{" "}
            <span className="font-medium text-gray-700">{expenses.length}</span> entries
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Pagination (Visible on small screens) */}
      <div className="md:hidden flex items-center justify-between px-2 py-4 border-t border-gray-100">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</p>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
      </div>
    </div>
  );
};

export default ExpensesTable;
