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
      setRefund(refundData);

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
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/refunds")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Refunds</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
             #{refund.id} Refund Request
             <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                <StatusIcon size={14} className={refund.refundStatus === 'pending' ? 'animate-spin' : ''} />
                {status.label}
             </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Submitted on {formatDate(refund.createdAt)} for Order{" "}
            <span className="font-semibold text-gray-900">{refund.order?.orderNumber || `#${refund.orderId}`}</span>
          </p>
        </div>
        
        {refund.refundStatus === 'pending' && (
           <div className="flex items-center gap-2">
              <button 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
              >
                <XCircle size={16} />
                Reject
              </button>
              <button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
                className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <CheckCircle size={16} />
                Approve & Complete
              </button>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items and Details */}
        <div className="lg:col-span-2 space-y-6">
           {/* Items Table */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Refunded Items
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {refund.items && refund.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {(() => {
                                        const orderItem = order?.items?.find(oi => String(oi.id) === String(item.orderItemId));
                                        const productName = item.productName || orderItem?.product?.name || orderItem?.name;
                                        return productName ? `${productName} (Item #${item.orderItemId})` : `Item #${item.orderItemId}`;
                                    })()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                {item.restock && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 block">To be Restocked</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Refund Amount</span>
                    <span className="text-xl font-bold text-rose-600">{formatPrice(refund.refundAmount)}</span>
                </div>
           </div>

           {/* Reason & Notes */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    Refund Analysis
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reason</label>
                        <p className="text-gray-700 capitalize mt-1">{refund.refundType} - {refund.reason?.replace(/_/g, ' ')}</p>
                    </div>
                    {refund.notes && (
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Notes</label>
                            <p className="text-gray-600 text-sm mt-1 italic">"{refund.notes}"</p>
                        </div>
                    )}
                </div>
           </div>
        </div>

        {/* Right: Meta Info */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Origin Sale</h3>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                            <Hash className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Order Number</p>
                            <Link to={`/dashboard/orders/${refund.orderId}`} className="font-medium text-blue-600 hover:underline">
                                {refund.order?.orderNumber || `#${refund.orderId}`}
                            </Link>
                        </div>
                    </div>
                    {/* Customer Info Card */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Customer Details</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400">Name</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {refund.customer?.firstName} {refund.customer?.lastName}
                                    {refund.customer?.businessName && ` (${refund.businessName || refund.customer?.businessName})`}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm text-gray-600">{refund.customer?.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <p className="text-sm text-gray-600">{refund.customer?.phone || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="p-2 rounded-lg bg-gray-100">
                            <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Refund Created</p>
                            <p className="font-medium text-gray-900">{formatDate(refund.createdAt)}</p>
                        </div>
                    </div>
                    {refund.processedBy && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                                <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Processed By</p>
                                <p className="font-medium text-gray-900">{refund.processedBy}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 border-dashed">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Approving this refund will mark it as <span className="font-bold">Completed</span> and automatically restock items. This action will be recorded in the financial logs.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
