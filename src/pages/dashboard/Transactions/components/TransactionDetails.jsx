import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Hash, CreditCard, ShoppingBag, RotateCcw, FileText, AlertTriangle, ExternalLink, Info, CheckCircle, Package } from "lucide-react";
import {
  OrderDetails,
  RefundDetails,
  PurchaseDetails,
  ExpenseDetails,
  AdjustmentDetails,
  RelatedTransactions,
} from "./RelatedRecords";
import { personName } from "../../../../utils/displayFormat";

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
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    description: "Stock replenishment cost"
  },
  stock_loss: {
    label: "Stock Loss",
    icon: AlertTriangle,
    color: "text-gray-600",
    bg: "bg-gray-100",
    description: "Loss from damages/adjustment"
  },
  adjustment: {
    label: "Adjustment",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    description: "Manual stock adjustment"
  }
};

const typeLabels = Object.fromEntries(Object.entries(transactionTypeConfig).map(([key, config]) => [key, config.label]));

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// One linked record inside the Financial Context card; blocks are separated by a rule.
const Block = ({ children }) => (
  <div className="space-y-8 pt-8 mt-8 border-t border-gray-100 first:pt-0 first:mt-0 first:border-t-0">{children}</div>
);

export default function TransactionDetails({ transaction, formatPrice }) {
  const type = transactionTypeConfig[transaction.transactionType] || { label: transaction.transactionType, icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
  const TypeIcon = type.icon;
  const isOutflow = transaction.amount < 0;

  const related = transaction.relatedTransactions || [];
  const { order, purchase, refund, expense, adjustment } = transaction;
  const customer = order?.customer;
  const customerLabel = personName(customer) || customer?.businessName?.trim() || null;

  // Refunds already paid out on the linked order, this entry included
  const refundedOnOrder = [transaction, ...related]
    .filter((entry) => entry.transactionType === "refunds" && entry.status === "completed" && order && entry.orderId === order.id)
    .reduce((sum, entry) => sum + Math.abs(Number(entry.amount) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <Link
        to="/dashboard/transactions"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group px-1 w-fit"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs tracking-tight">Back to Ledger</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-48 h-48 ${type.bg} opacity-20 rounded-bl-full -mr-12 -mt-12 blur-3xl`}></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className={`p-5 rounded-xl ${type.bg} ${type.color} shadow-lg shadow-current/5`}>
              <TypeIcon size={40} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">TX-{transaction.id}</h1>
                <span className={`px-3 py-1 rounded-md text-xs tracking-wide capitalize ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'} border border-current/10`}>
                  {transaction.status || 'pending'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 tracking-tight">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> {formatDate(transaction.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right border-t md:border-t-0 pt-6 md:pt-0 border-gray-50">
            <p className="text-xs text-gray-400 tracking-wide mb-1">Transaction Value</p>
            <p className={`text-5xl font-semibold tracking-tighter ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatPrice(Math.abs(transaction.amount))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed Context */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 tracking-tight">Financial Context</h3>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs tracking-wide capitalize ${type.bg} ${type.color}`}>
                <TypeIcon size={12} />
                {type.label}
              </div>
            </div>

            <div className="p-8">
              {/* Associated Refund */}
              {refund && (
                <Block>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Reversal Voucher</p>
                      <Link to={`/dashboard/refunds/${refund.id}`} className="inline-flex items-center gap-3 group">
                        <span className="text-2xl font-medium text-gray-900 group-hover:text-rose-600 transition-colors tracking-tight">
                          #REF-{refund.id}
                        </span>
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          <ExternalLink size={18} />
                        </div>
                      </Link>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Origin</p>
                      <Link to={`/dashboard/orders/${refund.orderId}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {refund.order?.orderNumber || `#ORD-${refund.orderId || 'N/A'}`}
                      </Link>
                    </div>
                  </div>
                  <div className="p-6 bg-rose-50/30 rounded-lg border border-rose-100 shadow-sm shadow-rose-500/5">
                    <p className="text-xs text-rose-400 tracking-wide mb-1">Stated Reason</p>
                    <p className="text-sm text-rose-900 capitalize tracking-tight leading-relaxed">
                      {refund.refundReason?.replace(/_/g, ' ') || 'No reason provided'}
                    </p>
                  </div>
                  <RefundDetails refund={refund} refundItems={transaction.refundItems} formatPrice={formatPrice} />
                </Block>
              )}

              {/* Associated Order */}
              {order && (
                <Block>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Source Order</p>
                      <Link to={`/dashboard/orders/${order.id}`} className="inline-flex items-center gap-3 group">
                        <span className="text-2xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
                          {order.orderNumber}
                        </span>
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          <ExternalLink size={18} />
                        </div>
                      </Link>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Customer Association</p>
                      {order.customerId && customerLabel ? (
                        <Link to={`/dashboard/customers/${order.customerId}`} className="text-lg text-gray-900 hover:text-blue-600 transition-colors">
                          {customerLabel}
                        </Link>
                      ) : (
                        <p className="text-lg text-gray-900">{customerLabel || 'Walk-in customer'}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">State</p>
                      <span className="text-xs tracking-wide text-blue-700 capitalize">{order.status}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Gross Inflow</p>
                      <p className="text-sm text-gray-900">{formatPrice(Math.abs(order.discountedPrice ?? order.discountedTotalPrice ?? transaction.amount))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Net Realized</p>
                      <p className="text-sm font-semibold text-emerald-600">{formatPrice(Math.abs(order.discountedTotalPrice ?? transaction.amount))}</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-100 rounded-full"></div>
                      <p className="text-sm italic text-gray-500 font-medium leading-relaxed pl-4">
                        "{order.notes}"
                      </p>
                    </div>
                  )}
                  <OrderDetails order={order} formatPrice={formatPrice} refundedTotal={refundedOnOrder} />
                </Block>
              )}

              {/* Associated Purchase */}
              {purchase && (
                <Block>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Procurement Record</p>
                      <Link to={`/dashboard/purchases/${purchase.id}`} className="inline-flex items-center gap-3 group">
                        <span className="text-2xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                          {purchase.purchaseNumber}
                        </span>
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          <ExternalLink size={18} />
                        </div>
                      </Link>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Supplier</p>
                      {purchase.supplier ? (
                        <Link to={`/dashboard/suppliers/${purchase.supplierId}`} className="text-lg text-gray-900 hover:text-blue-600 transition-colors">
                          {purchase.supplier.name}
                        </Link>
                      ) : (
                        <p className="text-lg text-gray-900">#SUP-{purchase.supplierId}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Batch</p>
                      <p className="text-sm text-gray-900">{purchase.batchNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Total Outflow</p>
                      <p className="text-sm font-semibold text-rose-600">{formatPrice(Math.abs(purchase.totalAmount))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">PO Status</p>
                      <span className="text-xs tracking-wide text-indigo-700 capitalize">{purchase.status}</span>
                    </div>
                  </div>
                  <PurchaseDetails purchase={purchase} formatPrice={formatPrice} />
                </Block>
              )}

              {/* Associated Expense */}
              {expense && (
                <Block>
                  <div>
                    <p className="text-xs text-gray-400 tracking-wide mb-2">Operating Expense</p>
                    <Link to={`/dashboard/expenses/${expense.id}`} className="text-2xl font-medium text-amber-600 tracking-tight hover:underline">
                      #EXP-{expense.id}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Amount</p>
                      <p className="text-xl font-semibold text-rose-600">{formatPrice(Math.abs(expense.amount))}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-1">Internal Cat</p>
                      <p className="text-sm text-gray-900 tracking-tight">{expense.category?.name || `#EC-${expense.expenseCategoryId}`}</p>
                    </div>
                  </div>
                  <ExpenseDetails expense={expense} />
                </Block>
              )}

              {/* Associated Stock Adjustment */}
              {adjustment && (
                <Block>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Stock Adjustment</p>
                      {adjustment.product ? (
                        <Link to={`/dashboard/products/${adjustment.productId}`} className="text-2xl font-medium text-blue-600 tracking-tight hover:underline">
                          {adjustment.product.name}
                        </Link>
                      ) : (
                        <p className="text-2xl font-medium text-gray-900 tracking-tight">Stock record #{adjustment.id}</p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 tracking-wide mb-2">Stock On Hand</p>
                      <p className="text-lg text-gray-900">{adjustment.quantity} units</p>
                    </div>
                  </div>
                  <AdjustmentDetails adjustment={adjustment} />
                </Block>
              )}

              {/* Generic Fallback */}
              {!order && !purchase && !refund && !expense && !adjustment && (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <Info className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-400 text-sm tracking-wide">No Linked Activity Details</p>
                  <p className="text-gray-400 text-xs mt-1">This transaction is a direct ledger entry.</p>
                </div>
              )}

              {related.length > 0 && (
                <div className="pt-8 mt-8 border-t border-gray-100 first:pt-0 first:mt-0 first:border-t-0">
                  <RelatedTransactions transactions={related} typeLabels={typeLabels} formatPrice={formatPrice} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Meta & Audit */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h3 className="font-semibold text-gray-900 tracking-tight">Audit Trail</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gray-50 text-gray-400">
                  <Hash size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 tracking-wide mb-1">Global Ref</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 tracking-tighter">
                    TX_REC_{transaction.id.toString().padStart(6, '0')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 tracking-wide mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize tracking-tight">
                    {transaction.paymentMethod?.replace(/_/g, ' ') || 'Undetermined'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 tracking-wide mb-1">State Integrity</p>
                  <p className="text-xs text-emerald-600 tracking-wide leading-tight">
                    High-Confidence Transaction
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 mt-2">
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 shadow-xl shadow-gray-900/10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs tracking-wide">
                      <span className="text-gray-500">Record Est:</span>
                      <span className="text-white">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs tracking-wide pt-2 border-t border-gray-800">
                      <span className="text-gray-500">System Trace:</span>
                      <span className="text-emerald-400">Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
