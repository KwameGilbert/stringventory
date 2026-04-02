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
      currency: rawOrder?.currency || "GHS",
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
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in px-4 sm:px-6">
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
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-xs group-hover:border-gray-300 transition-all group-hover:-translate-x-1">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs uppercase font-semibold tracking-widest">Back to Sales</span>
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 font-mono tracking-tighter">{order.displayRef || order.id}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${status.bg} ${status.text} border-2 ${status.border}`}>
                <StatusIcon size={12} />
                {status.label}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
              {formatDate(order.orderDate)} • {formatTime(order.orderDate)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition-all font-bold text-xs shadow-lg shadow-gray-200 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            SAVE PICKUP
          </button>
          <button 
            onClick={handlePickAll}
            disabled={isSaving || allItemsPicked}
            className={`flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl transition-all font-bold text-xs active:scale-95 disabled:opacity-50 ${
              allItemsPicked 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {allItemsPicked ? 'ALL PICKED' : 'PICK ALL'}
          </button>
          
          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <button
            onClick={handlePrint}
            className="p-2.5 bg-white border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 rounded-xl transition-all shadow-xs active:scale-95"
            title="Print Receipt"
          >
            <Printer size={18} />
          </button>
          <button className="p-2.5 bg-white border-2 border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200 rounded-xl transition-all shadow-xs active:scale-95">
            <Mail size={18} />
          </button>
          <button 
            onClick={() => navigate(`/dashboard/orders/${id}/refund`)}
            className="p-2.5 bg-white border-2 border-rose-50 text-rose-400 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all shadow-xs active:scale-95"
            title="Refund Sale"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content - Order Items */}
        <div className="flex-1 space-y-8 w-full">
          {/* Items Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white shadow-xs border border-gray-100">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Sale Items</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{items.length} unique products</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, index) => {
                const picked = item.pickedQuantity || 0;
                const totalFulfilled = item.fulfilledQuantity + picked;
                const isFullyPicked = totalFulfilled >= item.quantity;
                
                return (
                  <div key={index} className={`px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-colors ${isFullyPicked ? 'bg-emerald-50/20' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 relative shadow-xs">
                      <Package className={`w-6 h-6 ${isFullyPicked ? 'text-emerald-500' : 'text-gray-400'}`} />
                      {isFullyPicked && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-4 border-white shadow-sm scale-110">
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate tracking-tight">{item.productName || "Product"}</p>
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Ordered: <span className="text-gray-700">{item.quantity}</span></p>
                            {item.fulfilledQuantity > 0 && (
                              <p className="text-[10px] uppercase font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 tracking-widest">Fulfilled: {item.fulfilledQuantity}</p>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-xs">
                                <button 
                                  onClick={() => handleUpdatePicked(index, -1)}
                                  disabled={isSaving || picked <= 0}
                                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-400 text-gray-900 font-semibold disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-90"
                                >
                                  -
                                </button>
                                <div className="w-10 text-center text-lg font-semibold text-blue-600 font-mono">
                                    {picked}
                                </div>
                                <button 
                                  onClick={() => handleUpdatePicked(index, 1)}
                                  disabled={isSaving || picked >= item.remainingQuantity}
                                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-400 text-gray-900 font-semibold disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xs active:scale-90"
                                >
                                  +
                                </button>
                            </div>
                            {item.remainingQuantity > 0 && picked === 0 && (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 font-semibold uppercase tracking-widest">
                                {item.remainingQuantity} PENDING
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 border-gray-50 pt-4 sm:pt-0">
                      <p className="text-lg font-semibold text-gray-900 tracking-tight">{formatPrice(item.subtotal, order.currency)}</p>
                      {isFullyPicked && <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Fulfilled</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary Footer */}
            <div className="px-8 py-8 bg-gray-50/50 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Subtotal</span>
                <span className="font-bold text-gray-900">{formatPrice(order.subtotal, order.currency)}</span>
              </div>
                  {order.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                    <Percent size={14} className="text-emerald-500" />
                    DISCOUNT
                  </span>
                  <span className="font-semibold text-emerald-600">-{formatPrice(order.discountAmount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">TAX / VAT</span>
                <span className="font-bold text-gray-900">{formatPrice(order.taxAmount || 0, order.currency)}</span>
              </div>
              <div className="pt-6 mt-2 border-t-2 border-dashed border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-semibold text-gray-900 tracking-widest">Grand Total</span>
                    <span className="text-3xl font-semibold text-gray-900 tracking-tighter">{formatPrice(order.total, order.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-8 shrink-0">
          {/* Customer Group */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
              <h3 className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Customer Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/20">
                  {order.customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 leading-tight tracking-tight">{order.customer.name}</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-gray-50 text-sm">
                <div className="flex items-center gap-4 group">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-600 break-all">{order.customer.email || "No Email"}</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-600">{order.customer.phone || "No Phone"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Group */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
              <h3 className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Payment Data</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs border border-emerald-100">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Method</p>
                  <p className="font-semibold text-gray-900 uppercase text-xs tracking-wider">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-5 border-t border-gray-50">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Paid</p>
                  <p className="font-semibold text-gray-900 text-2xl tracking-tighter">{formatPrice(order.amountPaid || order.total, order.currency)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Group */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
              <h3 className="text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Metadata</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 shrink-0">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Internal Reference</p>
                  <p className="text-[10px] font-mono font-bold text-gray-900 break-all">{order.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2">
                <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Creation Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(order.orderDate)}</p>
                  <p className="text-xs text-gray-400 font-bold">{formatTime(order.orderDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Receipt for Printing */}
      <div className="hidden print:block print-payment-summary">
        <div className="border-2 border-gray-200 rounded-2xl p-8">
          <div className="text-center mb-8">
             <h2 className="text-2xl font-semibold uppercase tracking-tighter">SALE RECEIPT</h2>
             <p className="text-sm font-mono text-gray-500 mt-1">REF: {order.displayRef || order.id}</p>
          </div>

          <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest">Date</span>
              <span className="font-bold text-gray-900 text-right">{formatDate(order.orderDate)} {formatTime(order.orderDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest">Customer</span>
              <span className="font-bold text-gray-900 text-right">{order.customer.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest">Payment Method</span>
              <span className="font-bold text-gray-900 uppercase text-right">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-[10px] font-semibold uppercase text-gray-400 tracking-widest pb-2 border-b border-gray-50">
              <span>Item Description</span>
              <span>Total</span>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="font-bold text-gray-800">{item.productName} (x{item.quantity})</span>
                <span className="font-semibold text-gray-900">{formatPrice(item.subtotal, order.currency)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-6 border-t-2 border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">Discount</span>
                <span className="font-bold text-emerald-600">-{formatPrice(order.discountAmount, order.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-4 mt-2 border-t border-gray-50">
              <span className="uppercase tracking-widest text-xs">Total Amount</span>
              <span className="text-2xl tracking-tighter">{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>

          <div className="text-center mt-12 text-[10px] font-semibold uppercase text-gray-400 tracking-widest">
            Thank you for shopping with us!
          </div>
        </div>
      </div>
    </div>
  );
}
