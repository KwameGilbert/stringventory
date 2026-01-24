import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Package, DollarSign } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CreateRefund() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundReason, setRefundReason] = useState("");
  const [refundItems, setRefundItems] = useState({}); // { itemId: quantity }

  console.log("CreateRefund component mounted with ID:", id); // Debug Log

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, itemsRes] = await Promise.all([
          axios.get('/data/orders.json'),
          axios.get('/data/order-items.json')
        ]);
        
        const found = ordersRes.data.find(o => o.id === id);
        if (found) {
          setOrder(found);
          const orderItems = itemsRes.data.filter(item => item.orderId === id);
          setItems(orderItems);
          
          // Initialize refund items with 0
          const initialRefund = {};
          orderItems.forEach((item, index) => {
             // Using index as key since simple mock data might not have unique item IDs
             initialRefund[index] = 0;
          });
          setRefundItems(initialRefund);
        }
      } catch (error) {
        console.error("Error fetching order details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleQuantityChange = (index, value, max) => {
    const qty = Math.max(0, Math.min(max, parseInt(value) || 0));
    setRefundItems(prev => ({
      ...prev,
      [index]: qty
    }));
  };

  const totalRefundAmount = useMemo(() => {
    return items.reduce((total, item, index) => {
      const qty = refundItems[index] || 0;
      return total + (qty * item.unitPrice);
    }, 0);
  }, [items, refundItems]);

  const handleProcessRefund = (e) => {
    e.preventDefault();
    
    if (totalRefundAmount <= 0) {
      Swal.fire("Error", "Please select at least one item to refund", "error");
      return;
    }

    Swal.fire({
      title: 'Process Refund?',
      text: `Are you sure you want to refund ${formatCurrency(totalRefundAmount)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, process refund'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Refunded!',
          'The refund has been processed successfully.',
          'success'
        ).then(() => {
          navigate(`/dashboard/orders/${id}`);
        });
      }
    });
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };



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
         <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
         <Link to="/dashboard/orders" className="text-blue-600 hover:underline mt-2 inline-block">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/dashboard/orders/${id}`)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Order Details</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-rose-600" />
            </div>
            Create Refund
        </h1>
        <p className="text-gray-500 text-sm mt-1 ml-14">
            Select items to refund for Order <span className="font-mono font-medium text-gray-700">{order.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Select Items
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                        <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.productName}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Ordered: <span className="font-medium">{item.quantity}</span> × {formatCurrency(item.unitPrice)}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="text-right">
                                    <label className="block text-xs text-gray-500 mb-1">Return Qty</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max={item.quantity}
                                        value={refundItems[index] || 0}
                                        onChange={(e) => handleQuantityChange(index, e.target.value, item.quantity)}
                                        className="w-20 px-2 py-1 text-center border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                    />
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-xs text-gray-500 mb-1">Refund</p>
                                    <p className="font-semibold text-rose-600">
                                        {formatCurrency((refundItems[index] || 0) * item.unitPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Refund</label>
                <textarea
                    rows={3}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
                    placeholder="e.g. Defective item, Wrong item sent..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                ></textarea>
            </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-rose-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-rose-600" />
                        Refund Summary
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Original Total</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-gray-900">Total Refund</span>
                            <span className="text-2xl font-bold text-rose-600">{formatCurrency(totalRefundAmount)}</span>
                        </div>
                        <p className="text-xs text-gray-500 text-right">
                             {Object.values(refundItems).reduce((a, b) => a + b, 0)} items selected
                        </p>
                    </div>

                    <button
                        onClick={handleProcessRefund}
                        disabled={totalRefundAmount <= 0}
                        className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw size={18} />
                        Process Refund
                    </button>
                    
                     <div className="bg-yellow-50 rounded-lg p-3 flex gap-2 items-start mt-4">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                            This action will create a refund record and update inventory. It cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
