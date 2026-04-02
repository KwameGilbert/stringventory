import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Package, DollarSign, Calendar, Hash, User } from "lucide-react";
import refundService from "../../../services/refundService";
import orderService from "../../../services/orderService";
import { confirmAction, showError, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: RefreshCw,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
};

export default function ViewRefund() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [refund, setRefund] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRefund = async () => {
    setLoading(true);
    try {
      const response = await refundService.getRefundById(id);
      const refundData = response?.data || response;
      const currency = refundData?.currency || "GHS";
      setRefund({ ...refundData, currency });

      // Fetch the order to get item names
      if (refundData?.orderId) {
        try {
          const orderRes = await orderService.getOrderById(refundData.orderId);
          setOrder(orderRes?.data || orderRes);
        } catch (err) {
          console.error("Error fetching order for refund coverage", err);
        }
      }
    } catch (error) {
      console.error("Error fetching refund", error);
      showError(error?.message || "Failed to load refund details");
      navigate("/dashboard/refunds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    const action = newStatus === 'completed' ? 'Approve' : 'Reject';
    const confirmation = await confirmAction(
      `${action} Refund?`,
      `Are you sure you want to ${action.toLowerCase()} this refund?`,
      `Yes, ${action.toLowerCase()}`
    );

    if (!confirmation.isConfirmed) return;

    setIsUpdating(true);
    try {
      await refundService.updateRefundStatus(id, newStatus);
      showSuccess(`Refund has been successfully ${newStatus === 'completed' ? 'approved' : 'rejected'}.`, "Status Updated");
      fetchRefund();
    } catch (error) {
      console.error("Failed to update status", error);
      showError(error?.message || "Failed to update refund status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading refund details...</p>
      </div>
    );
  }

  if (!refund) return null;

  const status = statusConfig[refund.refundStatus] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in px-4 sm:px-6">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <button
          onClick={() => navigate("/dashboard/refunds")}
          className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-all group w-fit"
        >
          <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs group-hover:border-gray-300 transition-all group-hover:-translate-x-1">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs uppercase font-semibold tracking-widest">Back to Refunds</span>
        </button>

        {refund.refundStatus === 'pending' && (
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-semibold text-xs uppercase tracking-widest active:scale-95"
              >
                <XCircle size={18} />
                Reject
              </button>
              <button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl transition-all font-semibold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <CheckCircle size={18} />
                Approve & Refund
              </button>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: Refund Details */}
        <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <StatusIcon size={120} />
                </div>
                
                <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            REF-{refund.id}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${status.bg} ${status.text} border-2 border-transparent shadow-sm`}>
                            <StatusIcon size={14} className={refund.refundStatus === 'pending' ? 'animate-spin' : ''} />
                            {status.label}
                        </span>
                    </div>

                    <h1 className="text-4xl font-semibold text-gray-900 tracking-tighter leading-none">
                        Refund Request
                    </h1>
                    
                    <p className="text-gray-500 font-medium max-w-md">
                        Requested for order <Link to={`/dashboard/orders/${refund.orderId}`} className="text-blue-600 font-bold hover:underline">#{refund.order?.orderNumber || refund.orderId}</Link> on {formatDate(refund.createdAt)}
                    </p>
                </div>
            </div>

            {/* Items Section */}
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Returned Items
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {refund.items && refund.items.map((item, idx) => (
                      <div key={idx} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-gray-900 tracking-tight">
                                    {(() => {
                                        const orderItem = order?.items?.find(oi => String(oi.id) === String(item.orderItemId));
                                        return item.productName || orderItem?.product?.name || orderItem?.name || `Product #${item.orderItemId}`;
                                    })()}
                                </p>
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                        Quantity: <span className="text-gray-900">{item.quantity}</span>
                                    </p>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                        Ref: <span className="text-gray-900 font-mono">#{item.orderItemId}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                {item.restock && (
                                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-semibold uppercase tracking-widest border border-emerald-100 shadow-xs">Restock Active</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-8 py-8 bg-rose-50/30 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-rose-400 tracking-widest mb-1">Total Refund Value</p>
                        <p className="text-4xl font-semibold text-rose-600 tracking-tighter">{formatPrice(refund.refundAmount, refund.currency)}</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-2xl border border-rose-100 shadow-xs">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Currency: <span className="text-gray-900">{refund.currency}</span></p>
                    </div>
                </div>
            </div>

            {/* Analysis Section */}
            <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8 space-y-6">
                <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Internal Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest block">Reason for Request</label>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-sm font-bold text-gray-900 capitalize tracking-tight">
                                {refund.refundType} Process - {refund.reason?.replace(/_/g, ' ') || 'standard_payout'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest block">System Notes</label>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                            <p className="text-sm text-gray-600 font-medium">
                                {refund.notes ? `"${refund.notes}"` : "No special notes provided for this transaction."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar: Meta Context */}
        <div className="lg:col-span-4 space-y-6">
            {/* Origin Sale Card */}
            <div className="bg-gray-900 rounded-4xl shadow-xl shadow-gray-900/10 overflow-hidden border border-gray-800">
                <div className="px-6 py-5 border-b border-gray-800 bg-gray-800/30">
                    <h3 className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest flex items-center gap-2">
                        <Hash size={14} />
                        Origin Transaction
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 group">
                        <div className="p-3 rounded-2xl bg-gray-800 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Sale Reference</p>
                            <Link to={`/dashboard/orders/${refund.orderId}`} className="text-lg font-semibold text-white hover:text-blue-400 transition-colors tracking-tight">
                                {refund.order?.orderNumber || `SAL-${refund.orderId}`}
                            </Link>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="pt-6 border-t border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gray-800 text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest leading-none mb-1">Customer Profile</p>
                                <p className="text-lg font-semibold text-white tracking-tight truncate">
                                    {refund.customer?.firstName} {refund.customer?.lastName}
                                </p>
                                <p className="text-[11px] font-bold text-gray-500 tracking-tight truncate group-hover:text-gray-300">
                                    {refund.customer?.businessName}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span className="p-1 rounded bg-gray-800"><Calendar size={10} /></span>
                                Registered: {refund.customer?.createdAt ? new Date(refund.customer.createdAt).getFullYear() : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Meta Dates */}
                    <div className="pt-6 border-t border-gray-800 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gray-800 text-gray-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Submitted Date</p>
                                <p className="text-sm font-semibold text-white tracking-tight">{formatDate(refund.createdAt)}</p>
                            </div>
                        </div>
                        
                        {refund.processedBy && (
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gray-800 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Admin Handler</p>
                                    <p className="text-sm font-semibold text-white tracking-tight">{refund.processedBy}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Context Warning */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-sm shadow-amber-900/5">
                <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                        <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest mb-1">Impact Warning</p>
                        <p className="text-[11px] text-amber-800 font-bold leading-relaxed tracking-tight">
                            Approving this record will finalize the <span className="border-b-2 border-amber-300">financial reversal</span> and notify the customer. This action is recorded permanently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
