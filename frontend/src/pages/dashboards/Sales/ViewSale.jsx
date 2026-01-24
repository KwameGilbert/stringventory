import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Printer, Mail, User, Phone, CheckCircle, 
  XCircle, RotateCcw, Package, DollarSign, Receipt, RefreshCw, Clock, CreditCard
} from "lucide-react";
import axios from "axios";

const statusConfig = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: Clock,
  },
  Completed: {
    label: "Completed",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-rose-100",
    text: "text-rose-700",
    icon: XCircle,
  },
  Refunded: {
    label: "Refunded",
    bg: "bg-purple-100",
    text: "text-purple-700",
    icon: RotateCcw,
  },
};

export default function ViewSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [items, setItems] = useState([]);

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
        }
      } catch (error) {
        console.error("Error fetching sale", error);
      }
    };
    fetchData();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (!sale) {
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

  const status = statusConfig[sale.status] || statusConfig.Pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/sales/history")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Sales History</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900 font-mono">{sale.id}</h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {sale.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm">
                <Printer size={16} />
                Print Receipt
              </button>
              <button 
                onClick={() => navigate(`/dashboard/sales/${id}/refund`)}
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
                <h3 className="font-semibold text-gray-900">Items Purchased</h3>
                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{items.length} items</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, index) => (
                <div key={index} className="px-6 py-4 flex items-center gap-4 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 relative">
                    <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</p>
                </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(sale.amount)}</span>
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {sale.customer === "Walk-in Customer" ? "W" : sale.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sale.customer}</p>
                   {sale.customer === "Walk-in Customer" && <p className="text-xs text-gray-500">Anonymous</p>}
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
                  <p className="font-medium text-gray-900 capitalize">{sale.method}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount Paid</p>
                  <p className="font-bold text-gray-900 text-lg">{formatCurrency(sale.amount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
