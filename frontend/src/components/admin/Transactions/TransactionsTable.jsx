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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((tx) => {
              const type = transactionTypeConfig[tx.transactionType] || { label: tx.transactionType, icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
              const Icon = type.icon;
              const isOutflow = tx.amount < 0;

              return (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group/row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">TX-{tx.id}</span>
                        {(tx.orderId || tx.order) && (
                            <Link to={`/dashboard/orders/${tx.orderId || tx.order?.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                                {tx.order?.orderNumber || `Order #${tx.orderId}`}
                            </Link>
                        )}
                        {(tx.refundId || tx.refund) && (
                            <Link to={`/dashboard/refunds/${tx.refundId || tx.refund?.id}`} className="text-sm font-semibold text-rose-600 hover:underline">
                                {`Refund #${tx.refundId || tx.refund?.id}`}
                            </Link>
                        )}
                        {(tx.expenseId || tx.expense) && (
                            <span className="text-sm font-medium text-amber-600">
                                {`Expense #${tx.expenseId || tx.expense?.id}`}
                            </span>
                        )}
                        {(tx.purchaseId || tx.purchase) && (
                            <span className="text-sm font-medium text-indigo-600">
                                {tx.purchase?.purchaseNumber || `Purchase #${tx.purchaseId || tx.purchase?.id}`}
                            </span>
                        )}
                        {tx.adjustmentId && <span className="text-sm font-medium text-gray-600">Adjustment #{tx.adjustmentId}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${type.bg}`}>
                            <Icon size={14} className={type.color} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 leading-tight">{type.label}</p>
                            <p className="text-[10px] text-gray-400">{type.description}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatDate(tx.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 capitalize">
                      {tx.paymentMethod ? tx.paymentMethod.replace(/_/g, ' ') : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                        <div className={`flex items-center gap-1 font-bold ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isOutflow ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                            {formatCurrency(tx.amount, tx.currency)}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-xs">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {tx.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                        to={`/dashboard/transactions/${tx.id}`}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all inline-flex items-center gap-2 group/btn"
                    >
                        <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <p className="text-sm text-gray-500 lowercase">
            Showing <span className="font-semibold">{startIndex + 1}</span>-
            <span className="font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, transactions.length)}</span> of{" "}
            <span className="font-semibold">{transactions.length}</span>
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
