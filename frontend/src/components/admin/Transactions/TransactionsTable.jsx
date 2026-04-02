import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUpCircle, ArrowDownCircle, Info, Landmark, CreditCard, ShoppingBag, RotateCcw, AlertTriangle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";

const ITEMS_PER_PAGE = 10;

const transactionTypeConfig = {
  order: {
    label: "Order",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Revenue from sale"
  },
  sale: {
    label: "Sale",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Revenue from order"
  },
  refunds: {
    label: "Refund",
    icon: RotateCcw,
    color: "text-rose-600",
    bg: "bg-rose-50",
    description: "Amount refunded to customer"
  },
  expense: {
    label: "Expense",
    icon: CreditCard,
    color: "text-amber-600",
    bg: "bg-amber-50",
    description: "Business expense"
  },
  purchase: {
    label: "Purchase",
    icon: Landmark,
    color: "text-blue-600",
    bg: "bg-blue-50",
    description: "Stock replenishment cost"
  },
  stock_loss: {
    label: "Stock Loss",
    icon: AlertTriangle,
    color: "text-gray-600",
    bg: "bg-gray-100",
    description: "Loss from damages/adjustment"
  }
};

const TransactionsTable = ({ transactions = [] }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (val, currency = "GHS") => formatPrice(val, currency);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
           <Landmark className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No transactions recorded</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">Financial movements will appear here automatically as activities occur.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {paginatedData.map((tx) => {
              const type = transactionTypeConfig[tx.transactionType] || { label: tx.transactionType, icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
              const Icon = type.icon;
              const isOutflow = tx.amount < 0;

              return (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">TX-{tx.id}</span>
                        {(tx.orderId || tx.order) && (
                            <Link to={`/dashboard/orders/${tx.orderId || tx.order?.id}`} className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                {tx.order?.orderNumber || `Order #${tx.orderId}`}
                            </Link>
                        )}
                        {(tx.refundId || tx.refund) && (
                            <Link to={`/dashboard/refunds/${tx.refundId || tx.refund?.id}`} className="text-sm font-bold text-gray-900 hover:text-rose-600 transition-colors">
                                {`Refund #${tx.refundId || tx.refund?.id}`}
                            </Link>
                        )}
                        {(tx.expenseId || tx.expense) && (
                            <span className="text-sm font-bold text-gray-900">
                                {`Expense #${tx.expenseId || tx.expense?.id}`}
                            </span>
                        )}
                        {(tx.purchaseId || tx.purchase) && (
                            <span className="text-sm font-bold text-gray-900">
                                {tx.purchase?.purchaseNumber || `Purchase #${tx.purchaseId || tx.purchase?.id}`}
                            </span>
                        )}
                        {tx.adjustmentId && <span className="text-xs font-medium text-gray-600">Adjustment #{tx.adjustmentId}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${type.bg}`}>
                            <Icon size={14} className={type.color} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{type.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 font-medium">{formatDate(tx.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 font-medium capitalize">
                      {tx.paymentMethod ? tx.paymentMethod.replace(/_/g, ' ') : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-semibold ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isOutflow ? '− ' : '+ '}{formatCurrency(tx.amount, tx.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {tx.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                        to={`/dashboard/transactions/${tx.id}`}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {paginatedData.map((tx) => {
          const type = transactionTypeConfig[tx.transactionType] || { label: tx.transactionType, icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
          const Icon = type.icon;
          const isOutflow = tx.amount < 0;

          return (
            <div key={tx.id} className="p-4 space-y-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded w-fit">
                        TX-{tx.id}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                        {tx.order?.orderNumber || tx.purchase?.purchaseNumber || tx.category || type.label}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                        <Icon size={12} className={type.color} />
                        {type.label}
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {tx.status || 'pending'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Value</span>
                  <span className={`text-lg font-bold ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isOutflow ? '− ' : '+ '}{formatCurrency(tx.amount, tx.currency)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">Date</span>
                  <span className="text-sm font-semibold text-gray-700">{formatDate(tx.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/transactions/${tx.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Showing <span className="text-gray-900">{startIndex + 1}</span> -{" "}
                <span className="text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, transactions.length)}</span> of{" "}
                <span className="text-gray-900">{transactions.length}</span>
            </p>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                >
                    <ChevronLeft size={18} className="text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <div className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold shadow-lg shadow-gray-900/10">
                    {currentPage} / {totalPages}
                </div>
                
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
                >
                    <ChevronRight size={18} className="text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
