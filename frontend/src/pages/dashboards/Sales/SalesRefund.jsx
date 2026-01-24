import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle, Package, DollarSign } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SalesRefund() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundReason, setRefundReason] = useState("");
  const [refundItems, setRefundItems] = useState({}); // { itemId: quantity }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, itemsRes] = await Promise.all([
          axios.get('/data/sales.json'),
          axios.get('/data/sale-items.json')
        ]);
        
        const found = salesRes.data.find(s => s.id === id);
        if (found) {
          setSale(found);
          const saleItems = itemsRes.data.filter(item => item.saleId === id);
          setItems(saleItems);
          
          // Initialize refund items with 0
          const initialRefund = {};
          saleItems.forEach((item) => {
             // Using index/id as key
             initialRefund[item.id] = 0;
          });
          setRefundItems(initialRefund);
        }
      } catch (error) {
        console.error("Error fetching sale details", error);
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

  const totalRefundAmount = useMemo(() => {
    return items.reduce((total, item) => {
      const qty = refundItems[item.id] || 0;
      return total + (qty * item.unitPrice);
    }, 0);
  }, [items, refundItems]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(value);
  };

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
          navigate(`/dashboard/sales/history`);
        });
      }
    });
  };
  

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
         <h2 className="text-xl font-semibold text-gray-900">Transaction not found</h2>
         <Link to="/dashboard/sales/history" className="text-blue-600 hover:underline mt-2 inline-block">Back to Sales History</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/dashboard/sales/history`)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Sales History</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-rose-600" />
            </div>
            Process Refund
        </h1>
        <p className="text-gray-500 text-sm mt-1 ml-14">
            Select items to refund for Transaction <span className="font-mono font-medium text-gray-700">{sale.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        Purchased Items
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.productName}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="font-medium">{item.quantity}</span> × {formatCurrency(item.unitPrice)}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="text-right">
                                    <label className="block text-xs text-gray-500 mb-1">Return Qty</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        max={item.quantity}
                                        value={refundItems[item.id] || 0}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value, item.quantity)}
                                        className="w-20 px-2 py-1 text-center border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                    />
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-xs text-gray-500 mb-1">Refund</p>
                                    <p className="font-semibold text-rose-600">
                                        {formatCurrency((refundItems[item.id] || 0) * item.unitPrice)}
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
                    placeholder="e.g. Defective item, Wrong item charged..."
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
                        <span>Sale Total</span>
                        <span>{formatCurrency(sale.amount)}</span>
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
                            This action will update inventory counts and financial records properly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
