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
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/transactions")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group px-1"
      >
        <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-bold text-xs tracking-tight uppercase tracking-widest">Back to Ledger</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-48 h-48 ${type.bg} opacity-20 rounded-bl-full -mr-12 -mt-12 blur-3xl`}></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
                <div className={`p-5 rounded-3xl ${type.bg} ${type.color} shadow-lg shadow-current/5`}>
                    <TypeIcon size={40} />
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">TX-{transaction.id}</h1>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'} border border-current/10`}>
                            {transaction.status || 'pending'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-bold tracking-tight uppercase">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> {formatDate(transaction.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="text-left md:text-right border-t md:border-t-0 pt-6 md:pt-0 border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Value</p>
                <p className={`text-5xl font-semibold tracking-tighter ${isOutflow ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isOutflow ? '− ' : '+ '}{formatPrice(transaction.amount)}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed Context */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 tracking-tight">Financial Context</h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${type.bg} ${type.color}`}>
                        <TypeIcon size={12} />
                        {type.label}
                    </div>
                </div>
                
                <div className="p-8">
                    {/* Associated Order */}
                    {transaction.order && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Source Order</p>
                                    <Link to={`/dashboard/orders/${transaction.order.id}`} className="inline-flex items-center gap-3 group">
                                        <span className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {transaction.order.orderNumber}
                                        </span>
                                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <ExternalLink size={18} />
                                        </div>
                                    </Link>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Association</p>
                                    <p className="text-lg font-bold text-gray-900">#CUST-{transaction.order.customerId || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State</p>
                                    <span className="text-xs font-bold uppercase tracking-widest text-blue-700">{transaction.order.status}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gross Inflow</p>
                                    <p className="text-sm font-bold text-gray-900">{formatPrice(transaction.order.amount || transaction.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Net Realized</p>
                                    <p className="text-sm font-semibold text-emerald-600">{formatPrice(transaction.order.discountedTotalPrice || transaction.amount)}</p>
                                </div>
                            </div>

                            {transaction.order.notes && (
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-100 rounded-full"></div>
                                    <p className="text-sm italic text-gray-500 font-medium leading-relaxed pl-4">
                                        "{transaction.order.notes}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Associated Purchase */}
                    {transaction.purchase && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Procurement Record</p>
                                    <Link to={`/dashboard/purchases/${transaction.purchase.id}`} className="inline-flex items-center gap-3 group">
                                        <span className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                            {transaction.purchase.purchaseNumber}
                                        </span>
                                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <ExternalLink size={18} />
                                        </div>
                                    </Link>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Supplier</p>
                                    <p className="text-lg font-bold text-gray-900">#SUP-{transaction.purchase.supplierId}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Batch</p>
                                    <p className="text-sm font-bold text-gray-900">{transaction.purchase.batchNumber || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Outflow</p>
                                    <p className="text-sm font-semibold text-rose-600">{formatPrice(transaction.purchase.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PO Status</p>
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">{transaction.purchase.status}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Associated Refund */}
                    {transaction.refund && (
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reversal Voucher</p>
                                    <Link to={`/dashboard/refunds/${transaction.refund.id}`} className="inline-flex items-center gap-3 group">
                                        <span className="text-2xl font-semibold text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">
                                            #REF-{transaction.refund.id}
                                        </span>
                                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            <ExternalLink size={18} />
                                        </div>
                                    </Link>
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Origin</p>
                                    <Link to={`/dashboard/orders/${transaction.refund.orderId}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                        #ORD-{transaction.refund.orderId || 'N/A'}
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 bg-rose-50/30 rounded-2xl border border-rose-100 shadow-sm shadow-rose-500/5">
                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Stated Reason</p>
                                <p className="text-sm font-bold text-rose-900 capitalize tracking-tight leading-relaxed">
                                    {transaction.refund.refundReason?.replace(/_/g, ' ') || 'No reason provided'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Associated Expense */}
                    {transaction.expense && (
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Operating Expense</p>
                                <p className="text-2xl font-semibold text-amber-600 uppercase tracking-tight">#EXP-{transaction.expense.id}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-xl font-semibold text-rose-600">{formatPrice(transaction.expense.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Internal Cat</p>
                                    <p className="text-sm font-bold text-gray-900 tracking-tight">#EC-{transaction.expense.expenseCategoryId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generic Fallback */}
                    {!transaction.order && !transaction.purchase && !transaction.refund && !transaction.expense && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <Info className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Linked Activity Details</p>
                            <p className="text-gray-400 text-xs mt-1">This transaction is a direct ledger entry.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Sidebar: Meta & Audit */}
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 tracking-tight">Audit Trail</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-400">
                            <Hash size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Global Ref</p>
                            <p className="font-mono text-sm font-semibold text-gray-900 tracking-tighter">
                                TX_REC_{transaction.id.toString().padStart(6, '0')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-400 border border-gray-100">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-sm font-semibold text-gray-900 uppercase tracking-tight">
                                {transaction.paymentMethod?.replace(/_/g, ' ') || 'UNDETERMINED'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                            <CheckCircle size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">State Integrity</p>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest leading-tight">
                                High-Confidence Transaction
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 mt-2">
                         <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl shadow-gray-900/10">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Record Est:</span>
                                    <span className="text-white">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                    <span className="text-gray-500">System Trace:</span>
                                    <span className="text-emerald-400">ENCRYPTED</span>
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
