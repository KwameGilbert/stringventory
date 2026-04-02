import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Landmark, Calendar, DollarSign, Hash, CreditCard, ShoppingBag, RotateCcw, FileText, AlertTriangle, ExternalLink, User, Info, CheckCircle, RefreshCw } from "lucide-react";
import transactionService from "../../../services/transactionService";
import { showError } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

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
  }
};

export default function ViewTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactionById(id);
      setTransaction(response.data || response);
    } catch (error) {
      console.error("Error fetching transaction", error);
      showError(error?.message || "Failed to load transaction details");
      navigate("/dashboard/transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-fade-in text-gray-400">
        <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4" />
        <p>Loading transaction history...</p>
      </div>
    );
  }

  if (!transaction) return null;

  const type = transactionTypeConfig[transaction.transactionType] || { label: transaction.transactionType, icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
  const TypeIcon = type.icon;
  const isOutflow = transaction.amount < 0;

  return (
    <div className="max-w-5xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/transactions")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Transactions</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${type.bg} opacity-10 rounded-bl-full -mr-8 -mt-8`}></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${type.bg} ${type.color}`}>
                    <TypeIcon size={32} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">TX-{transaction.id}</h1>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {transaction.status || 'pending'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(transaction.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="text-left md:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Total</p>
                <p className={`text-4xl font-extrabold tracking-tight ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isOutflow ? '− ' : '+ '}{formatPrice(transaction.amount)}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Associated Entity Details */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Associated Activity</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${type.bg} ${type.color}`}>
                        {type.label}
                    </span>
                </div>
                
                <div className="p-8">
                    {/* Render specific details based on transaction type content */}
                    {transaction.order && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                                    <Link to={`/dashboard/orders/${transaction.order.id}`} className="text-xl font-bold text-blue-600 hover:underline flex items-center gap-2">
                                        {transaction.order.orderNumber}
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer ID</p>
                                    <p className="font-bold text-gray-900">#CUST-{transaction.order.customerId}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Status</p>
                                    <span className="text-sm font-semibold capitalize bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">{transaction.order.status}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subtotal</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatPrice(transaction.order.discountedPrice || transaction.order.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                                    <p className="text-sm font-bold text-gray-900">{formatPrice(transaction.order.discountedTotalPrice || transaction.order.amount)}</p>
                                </div>
                            </div>
                            {transaction.order.notes && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-600 text-sm">
                                    "{transaction.order.notes}"
                                </div>
                            )}
                        </div>
                    )}

                    {transaction.purchase && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Purchase Order</p>
                                    <Link to={`/dashboard/purchases/${transaction.purchase.id}`} className="text-xl font-bold text-indigo-600 hover:underline flex items-center gap-2">
                                        {transaction.purchase.purchaseNumber}
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supplier ID</p>
                                    <p className="font-bold text-gray-900">#SUP-{transaction.purchase.supplierId}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Batch Number</p>
                                    <p className="text-sm font-semibold text-gray-900">{transaction.purchase.batchNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="text-sm font-bold text-gray-900">{formatPrice(transaction.purchase.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PO Status</p>
                                    <span className="text-sm font-semibold capitalize bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg">{transaction.purchase.status}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {transaction.refund && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Refund Request</p>
                                    <Link to={`/dashboard/refunds/${transaction.refund.id}`} className="text-xl font-bold text-rose-600 hover:underline flex items-center gap-2">
                                        #REF-{transaction.refund.id}
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Origin Order</p>
                                    <Link to={`/dashboard/orders/${transaction.refund.orderId}`} className="text-sm font-bold text-gray-900 hover:underline">
                                        #ORD-{transaction.refund.orderId}
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Refund Reason</p>
                                <p className="text-sm font-medium text-rose-900 capitalize">{transaction.refund.refundReason?.replace(/_/g, ' ')}</p>
                            </div>
                        </div>
                    )}

                    {transaction.expense && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expense Voucher</p>
                                <p className="text-xl font-bold text-amber-600">#EXP-{transaction.expense.id}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount</p>
                                    <p className="text-lg font-bold text-gray-900">{formatPrice(transaction.expense.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category ID</p>
                                    <p className="text-sm font-semibold text-gray-900">#{transaction.expense.expenseCategoryId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!transaction.order && !transaction.purchase && !transaction.refund && !transaction.expense && (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                            <Info className="w-12 h-12 text-gray-200 mb-2" />
                            <p className="text-gray-400 text-sm italic">Detailed entity information is unavailable for this specific transaction type.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Technical Metadata */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Meta Information</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 text-gray-400">
                            <Hash size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Reference ID</p>
                            <p className="font-mono text-sm font-bold text-gray-900 leading-none">TX_REC_{transaction.id.toString().padStart(6, '0')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 text-gray-400">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Verification</p>
                            <p className="text-sm font-bold text-emerald-600 leading-none flex items-center gap-1.5">
                                Blockchain Verified
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50">
                         <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Entity Audit</p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created:</span>
                                    <span className="text-gray-900 font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Method:</span>
                                    <span className="text-gray-900 font-medium capitalize">{transaction.paymentMethod?.replace(/_/g, ' ')}</span>
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
