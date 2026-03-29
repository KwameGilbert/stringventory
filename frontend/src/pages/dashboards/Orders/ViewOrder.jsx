import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, Printer, Mail, User, Phone, AtSign, Calendar, Hash, 
  CreditCard, Clock, CheckCircle, XCircle, RotateCcw, Package, 
  DollarSign, Percent, Receipt, Save, RefreshCw
} from "lucide-react";
import orderService from "../../../services/orderService";
import { showError, showInfo, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  fulfilled: {
    label: "Fulfilled",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: RotateCcw,
  },
};

export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const hasAutoPrintedRef = useRef(false);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const extractOrder = (response) => {
    const payload = response?.data || response || {};
    return payload?.order || payload?.data?.order || payload?.data || payload;
  };

  const normalizeOrder = (rawOrder) => {
    if (!rawOrder) return null;

    // Customer — API uses firstName/lastName, no combined name field
    const customerObj = rawOrder?.customer || {};
    const firstName = customerObj?.firstName || "";
    const lastName = customerObj?.lastName || "";
    const customerName = `${firstName} ${lastName}`.trim() || customerObj?.name || rawOrder?.customerName || "Unknown Customer";

    const customer = {
      name: customerName,
      email: customerObj?.email || rawOrder?.customerEmail || "",
      phone: customerObj?.phone || rawOrder?.customerPhone || "",
      businessName: customerObj?.businessName || "",
    };

    // Payment method comes from transactions array
    const firstTransaction = Array.isArray(rawOrder?.transactions) ? rawOrder.transactions[0] : null;
    const paymentMethod = firstTransaction?.paymentMethod || rawOrder?.paymentMethod || "cash";
    const amountPaid = Number(firstTransaction?.amount ?? rawOrder?.discountedTotalPrice ?? rawOrder?.total ?? 0);

    return {
      ...rawOrder,
      // Use orderNumber as the display reference
      displayRef: rawOrder?.orderNumber || rawOrder?.id,
      orderDate: rawOrder?.orderDate || rawOrder?.createdAt || rawOrder?.date,
      // No explicit subtotal/tax fields — use discountedTotalPrice as total
      subtotal: Number(rawOrder?.discountedPrice ?? rawOrder?.subtotal ?? rawOrder?.discountedTotalPrice ?? 0),
      discountAmount: Number(rawOrder?.discountAmount ?? rawOrder?.discount ?? 0),
      taxAmount: Number(rawOrder?.taxAmount ?? rawOrder?.tax ?? 0),
      total: Number(rawOrder?.discountedTotalPrice ?? rawOrder?.total ?? rawOrder?.totalAmount ?? amountPaid),
      amountPaid,
      paymentMethod,
      customer,
      items: Array.isArray(rawOrder?.items)
        ? rawOrder.items.map((item) => {
            const quantity = Number(item?.quantity ?? 0);
            const fulfilledQuantity = Number(item?.fulfilledQuantity ?? 0);
            return {
              ...item,
              // Product name is nested under item.product.name
              productName: item?.product?.name || item?.productName || item?.name || "Unknown Product",
              quantity,
              fulfilledQuantity,
              remainingQuantity: Math.max(0, quantity - fulfilledQuantity),
              // API returns sellingPrice as the unit price
              unitPrice: Number(item?.sellingPrice ?? item?.unitPrice ?? item?.price ?? 0),
              // API returns totalPrice as the line total
              subtotal: Number(item?.totalPrice ?? item?.subtotal ?? item?.total ?? 0),
              // pickedQuantity is for the CURRENT pickup session
              pickedQuantity: 0,
            };
          })
        : [],
    };
  };

  const loadData = async (showPulse = true) => {
    if (showPulse) setLoading(true);
    try {
      const response = await orderService.getOrderById(id);
      const found = normalizeOrder(extractOrder(response));
      if (!found) {
        showError("Order not found");
        navigate("/dashboard/orders");
        return;
      }

      setOrder(found);
      setItems(found.items || []);
    } catch (error) {
      console.error("Error fetching order", error);
      showError(error?.message || "Failed to fetch sale details");
      navigate("/dashboard/orders");
    } finally {
      if (showPulse) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleUpdatePicked = (index, change) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const item = newItems[index];
      // Only allow picking up to the remaining quantity
      const newPicked = Math.max(0, Math.min(item.remainingQuantity, (item.pickedQuantity || 0) + change));
      
      newItems[index] = { ...item, pickedQuantity: newPicked };
      return newItems;
    });
  };

  const handlePickAll = async () => {
    const unfulfilledItems = items.filter(item => item.remainingQuantity > 0);
    if (unfulfilledItems.length === 0) return;
    
    setIsSaving(true);
    try {
      // 1. Prepare fulfillment payload for remaining quantities
      const fulfillmentPayload = unfulfilledItems.map(item => ({
        orderItemId: item.id,
        fulfilledQuantity: Number(item.remainingQuantity),
      }));

      // 2. Persist to API
      await orderService.fulfillOrder(id, { items: fulfillmentPayload });
      
      // 3. Update local state for snappy UI
      setItems(prevItems => prevItems.map(item => ({
        ...item,
        // Since we fulfilled everything remaining, pickedQuantity resets to 0 after refresh
        // but for now we can set it to remainingQuantity
        pickedQuantity: item.remainingQuantity
      })));

      showSuccess("All remaining items fulfilled successfully", "Full Pickup Saved");
      // Refresh order to update status and quantities
      loadData(false);
    } catch (error) {
      console.error("Failed full fulfillment", error);
      showError(error?.message || "Failed to fulfill items");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    const pickedItems = items.filter(item => (item.pickedQuantity || 0) > 0);

    if (pickedItems.length === 0) {
      showInfo("Please pick at least one item before saving.", "Nothing to save");
      return;
    }

    setIsSaving(true);
    try {
      await orderService.fulfillOrder(id, {
        items: pickedItems.map(item => ({
          orderItemId: item.id,
          fulfilledQuantity: Number(item.pickedQuantity),
        })),
      });
      showSuccess(`Pickup saved for ${pickedItems.length} item(s).`, "Pickup Saved");
      // Refresh order to update status
      loadData(false);
    } catch (error) {
      console.error("Failed to save pickup", error);
      showError(error?.message || "Failed to save pickup");
    } finally {
      setIsSaving(false);
    }
  };

  const allItemsPicked = items.length > 0 && items.every(item => (item.fulfilledQuantity + (item.pickedQuantity || 0)) >= item.quantity);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (loading || !order) return;
    if (!location.state?.autoPrint) return;
    if (hasAutoPrintedRef.current) return;

    hasAutoPrintedRef.current = true;
    const timer = window.setTimeout(() => {
      window.print();
      navigate(location.pathname, { replace: true, state: null });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [loading, order, location.pathname, location.state, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || !order) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-xl p-8 border border-gray-100 animate-pulse">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto pb-8 animate-fade-in">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-payment-summary,
          .print-payment-summary * {
            visibility: visible !important;
          }

          .print-payment-summary {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
            background: #fff;
            color: #111827;
          }
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/orders")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Sales</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 font-mono">{order.displayRef || order.id}</h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? "Saving..." : "Save Pickup"}
              </button>
              <button 
                onClick={handlePickAll}
                disabled={isSaving || allItemsPicked}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors font-medium text-sm ${
                  allItemsPicked 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                {isSaving ? "Processing..." : (allItemsPicked ? 'All Picked' : 'Pick All')}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
              >
                <Printer size={16} />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
                <Mail size={16} />
                Email
              </button>
              <button 
                onClick={() => navigate(`/dashboard/orders/${id}/refund`)}
                className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm"
              >
                <RefreshCw size={16} />
                Refund
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Sale Items</h3>
                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{items.length} products</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, index) => {
                const picked = item.pickedQuantity || 0;
                const totalFulfilled = item.fulfilledQuantity + picked;
                const isFullyPicked = totalFulfilled >= item.quantity;
                
                return (
                  <div key={index} className={`px-6 py-4 flex items-center gap-4 transition-colors ${isFullyPicked ? 'bg-emerald-50/50' : ''}`}>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 relative">
                      <Package className={`w-5 h-5 ${isFullyPicked ? 'text-emerald-500' : 'text-gray-400'}`} />
                      {isFullyPicked && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                          <CheckCircle size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName || "Product"}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-4">
                            <p className="text-xs text-gray-400">Ordered: <span className="font-medium text-gray-600">{item.quantity}</span></p>
                            {item.fulfilledQuantity > 0 && (
                              <p className="text-xs text-emerald-600 font-medium">Fulfilled: {item.fulfilledQuantity}</p>
                            )}
                            <div className="flex items-center gap-1">
                                <button 
                                onClick={() => handleUpdatePicked(index, -1)}
                                disabled={isSaving || picked <= 0}
                                className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 bg-white shadow-xs"
                                >
                                -
                                </button>
                                <button 
                                onClick={() => handleUpdatePicked(index, 1)}
                                disabled={isSaving || picked >= item.remainingQuantity}
                                className="w-5 h-5 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 bg-white shadow-xs"
                                >
                                +
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-gray-500">
                            Pick Now: <span className={`font-bold ${picked > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{picked}</span>
                          </p>
                          {item.remainingQuantity > 0 && picked === 0 && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-bold uppercase">Pending {item.remainingQuantity}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                      {isFullyPicked && <span className="text-xs text-emerald-600 font-bold uppercase tracking-tight">Fully Fulfilled</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
                  {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Percent size={12} />
                    Discount
                  </span>
                  <span className="text-emerald-600">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{formatPrice(order.taxAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Customer</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {order.customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <AtSign className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-gray-600">{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-gray-600">{order.customer.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Payment</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount Paid</p>
                  <p className="font-bold text-gray-900 text-lg">{formatPrice(order.amountPaid || order.total)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Sale Details</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gray-100">
                  <Hash className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sale ID</p>
                  <p className="text-sm font-mono font-medium text-gray-900">{order.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gray-100">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sale Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${status.bg}`}>
                  <StatusIcon className={`w-3.5 h-3.5 ${status.text}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`text-sm font-medium ${status.text}`}>{status.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden print:block print-payment-summary">
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-xl font-bold mb-1">Payment Summary</h2>
          <p className="text-sm text-gray-600 mb-5">Receipt for sale {order.id}</p>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">{formatDate(order.orderDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-gray-900">-{formatPrice(order.discountAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">{formatPrice(order.taxAmount || 0)}</span>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-4" />

          <div className="flex justify-between text-base font-bold">
            <span>Total Paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
