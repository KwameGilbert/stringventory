import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, User, FileText, Package } from "lucide-react";
import axios from "axios";

export default function ViewPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchasesRes, itemsRes] = await Promise.all([
          axios.get("/data/purchases.json"),
          axios.get("/data/purchase-items.json")
        ]);
        
        const found = purchasesRes.data.find((p) => p.id === id);
        if (found) {
          setPurchase(found);
          const purchaseItems = itemsRes.data.filter(item => item.purchaseId === id);
          setItems(purchaseItems);
        }
      } catch (error) {
        console.error("Error fetching purchase", error);
      }
    };
    fetchData();
  }, [id]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gray-100 text-gray-700",
      partial: "bg-amber-100 text-amber-700",
      received: "bg-emerald-100 text-emerald-700",
    };
    return badges[status] || "bg-gray-100 text-gray-600";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!purchase) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-xl p-8 border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/purchases")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Purchases</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{purchase.waybillNumber}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(purchase.status)}`}>
                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">{purchase.supplierName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {purchase.status === "pending" && (
                <Link
                  to={`/dashboard/purchases/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit2 size={16} />
                  Edit
                </Link>
              )}
              <button className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Purchase Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Cost</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Subtotal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3">
                        <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-600">{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-900">{formatCurrency(item.unitCost)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.subtotal)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{formatDate(item.expiryDate)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Total */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(purchase.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {purchase.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{purchase.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <FileText size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Waybill Number</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{purchase.waybillNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Purchase Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(purchase.purchaseDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Package size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Supplier</p>
                  <p className="text-sm font-semibold text-gray-900">{purchase.supplierName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <User size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Created By</p>
                  <p className="text-sm font-semibold text-gray-900">{purchase.createdBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
