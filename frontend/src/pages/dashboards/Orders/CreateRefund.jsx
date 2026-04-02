import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Package, DollarSign } from "lucide-react";
import orderService from "../../../services/orderService";
import refundService from "../../../services/refundService";
import { confirmAction, showError, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

export default function CreateRefund() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundReason, setRefundReason] = useState("");
  const [refundItems, setRefundItems] = useState({}); // { itemId: quantity }
  const [restockItems, setRestockItems] = useState({}); // { itemId: boolean }
  const [submitting, setSubmitting] = useState(false);

  const extractOrder = (response) => {
    const payload = response?.data || response || {};
    return payload?.order || payload?.data?.order || payload?.data || payload;
  };

  const normalizeOrder = (rawOrder) => {
    if (!rawOrder) return null;

    // Price and Total fields can vary depending on the API's return structure
    // We prioritize 'discountedTotalPrice' for the overall order total
    const totalAmount = Number(rawOrder?.discountedTotalPrice ?? rawOrder?.total ?? rawOrder?.totalAmount ?? 0);

    return {
      ...rawOrder,
      currency: rawOrder?.currency || "GHS",
      total: totalAmount,
      items: Array.isArray(rawOrder?.items)
        ? rawOrder.items.map((item) => {
            const quantity = Number(item?.quantity ?? 0);
            // API returns 'sellingPrice' for the price of the item at the time of sale
            const unitPrice = Number(item?.sellingPrice ?? item?.unitPrice ?? item?.price ?? 0);
            
            return {
              ...item,
              // API uses nested 'product.name' or 'productName'
              id: item?.id || item?.orderItemId || item?.productId,
              productName: item?.product?.name || item?.productName || item?.name || "Product",
              quantity,
              unitPrice,
            };
          })
        : [],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await orderService.getOrderById(id);
        const found = normalizeOrder(extractOrder(orderRes));
        if (found) {
          setOrder(found);
          const orderItems = found.items || [];
          setItems(orderItems);
          
          // Initialize refund items with 0 and restock with true
          const initialRefund = {};
          const initialRestock = {};
          orderItems.forEach((item) => {
             initialRefund[item.id] = 0;
             initialRestock[item.id] = true;
          });
          setRefundItems(initialRefund);
          setRestockItems(initialRestock);
        }
      } catch (error) {
        console.error("Error fetching order details", error);
        showError(error?.message || "Failed to fetch sale details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleQuantityChange = (itemId, value, max) => {
    const qty = Math.max(0, Math.min(max, parseInt(value) || 0));
    setRefundItems(prev => ({
      ...prev,
      [itemId]: qty
    }));
  };
  
  const handleRestockToggle = (itemId) => {
    setRestockItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const totalRefundAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const qty = refundItems[item.id] || 0;
      return total + (qty * item.unitPrice);
    }, 0);
  }, [items, refundItems]);

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    
    if (totalRefundAmount <= 0) {
      showError("Please select at least one item to refund");
      return;
    }

    const confirmation = await confirmAction(
      "Process Refund?",
      `Are you sure you want to refund ${formatCurrency(totalRefundAmount)}?`,
      "Yes, process refund"
    );

    if (!confirmation.isConfirmed) return;

    try {
      setSubmitting(true);

      const selectedItems = items
        .filter((item) => Number(refundItems[item.id] || 0) > 0)
        .map((item) => ({
          orderItemId: item.id,
          quantity: Number(refundItems[item.id]),
          restock: !!restockItems[item.id],
        }));

      await refundService.createRefund({
        orderId: Number(id),
        refundAmount: Number(totalRefundAmount.toFixed(2)),
        refundType: totalRefundAmount >= Number(order?.total || 0) ? "full" : "partial",
        reason: refundReason || "customer_request",
        items: selectedItems,
        notes: refundReason || undefined,
      });

      showSuccess("The refund request has been submitted successfully.", "Refund Requested!");
      navigate(`/dashboard/orders/${id}`);
    } catch (error) {
      console.error("Failed to process refund", error);
      showError(error?.message || "Failed to process refund");
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatCurrency = (value) => formatPrice(value, order?.currency || "GHS");



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
         <h2 className="text-xl font-semibold text-gray-900">Sale not found</h2>
         <Link to="/dashboard/orders" className="text-blue-600 hover:underline mt-2 inline-block">Back to Sales</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/dashboard/orders/${id}`)}
        className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-all mb-8 group"
      >
        <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs group-hover:border-gray-300 transition-all group-hover:-translate-x-1">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs uppercase font-semibold tracking-widest">Back to Sale Details</span>
      </button>

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-600/20">
                <RefreshCw className="w-6 h-6 hover:rotate-180 transition-transform duration-500" />
            </div>
            <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tighter">Create Refund</h1>
                <p className="text-gray-500 text-sm tracking-tight">
                    Select items to refund for Sale <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded ml-1 text-xs">{order.displayRef || order.id}</span>
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-6">
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                    <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Item Selection
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {items.length} total items
                    </span>
                </div>
                <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50/50 transition-all">
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-bold text-gray-900 tracking-tight leading-tight mb-1">{item.productName}</p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                        Ordered: <span className="text-gray-700">{item.quantity}</span>
                                    </p>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                        Price: <span className="text-gray-700">{formatCurrency(item.unitPrice)}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 sm:flex items-center gap-4 sm:gap-6 bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-gray-100">
                                {/* Return Qty Input */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase font-semibold text-gray-400 tracking-widest text-center sm:text-left">Qty to Refund</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0"
                                            max={item.quantity}
                                            value={refundItems[item.id] || 0}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value, item.quantity)}
                                            className="w-full sm:w-24 px-3 py-2 text-center bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Restock Toggle */}
                                <div className="space-y-2 flex flex-col items-center">
                                    <label className="block text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Restock?</label>
                                    <button
                                        type="button"
                                        onClick={() => handleRestockToggle(item.id)}
                                        className={`relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 focus:outline-none shadow-xs ${
                                            restockItems[item.id] ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`${
                                                restockItems[item.id] ? 'translate-x-8' : 'translate-x-1'
                                            } inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300`}
                                        />
                                    </button>
                                </div>

                                {/* Line Refund Amount */}
                                <div className="space-y-2 text-right min-w-[100px]">
                                    <label className="block text-[10px] uppercase font-semibold text-gray-400 tracking-widest">Line Total</label>
                                    <p className="text-lg font-semibold text-rose-600 tracking-tighter">
                                        {formatCurrency((refundItems[item.id] || 0) * item.unitPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-4">
                <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Refund Documentation
                </h3>
                <textarea
                    rows={4}
                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 outline-none p-4 text-sm font-medium text-gray-700 transition-all border shadow-xs"
                    placeholder="Provide details about the refund (e.g. Defective item, customer preferred exchange, sizing issue...)"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                ></textarea>
                <p className="text-[11px] text-gray-400 font-medium italic">This reason will be visible to administrators and printed on refund receipts.</p>
            </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-gray-900 rounded-3xl shadow-2xl shadow-gray-900/20 overflow-hidden border border-gray-800 transition-all hover:shadow-gray-900/30">
                <div className="px-8 py-6 border-b border-gray-800 bg-gray-800/30">
                    <h3 className="text-[10px] uppercase font-semibold text-rose-400 tracking-widest flex items-center gap-2">
                        <DollarSign size={14} />
                        Refund Summary
                    </h3>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-400 uppercase tracking-widest">Original Sale</span>
                            <span className="font-semibold text-white">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-400 uppercase tracking-widest">Items Count</span>
                            <span className="font-semibold text-white">{Object.values(refundItems).reduce((a, b) => a + b, 0)} items</span>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-800">
                        <div className="flex flex-col gap-1 mb-6">
                            <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-widest">Total Refundable Value</span>
                            <span className="text-4xl font-semibold text-white tracking-tighter">{formatCurrency(totalRefundAmount)}</span>
                        </div>

                        <button
                            onClick={handleProcessRefund}
                            disabled={submitting || totalRefundAmount <= 0}
                            className="w-full flex justify-center items-center gap-3 px-6 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-2xl text-white font-semibold text-sm uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95"
                        >
                            {submitting ? (
                                <RefreshCw size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw size={20} />
                                    Process Refund
                                </>
                            )}
                        </button>
                    </div>
                    
                     <div className="bg-gray-800/50 rounded-2xl p-4 flex gap-3 items-start border border-gray-700/50">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            A finalized refund will update stock levels (if restock is active) and log a financial payout. This action is irreversible.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Context Card */}
            <div className="mt-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Package size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Assoc. Customer</p>
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">{order.customer?.name || "Anonymous"}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
