import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, User, FileText, Package, CheckCircle, CreditCard, Landmark, Truck, AlertCircle, Clock, Banknote, Star, Mail, Phone, MapPin, UserCheck, Hash, Activity, ArrowUpRight } from "lucide-react";
import purchaseService from "../../../services/purchaseService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useAuth } from "../../../contexts/AuthContext";
import { useCurrency } from "../../../utils/currencyUtils";
import Swal from "sweetalert2";

const extractPurchase = (response) => {
  const payload = response?.data || response || {};
  return payload?.purchase || payload?.data?.purchase || payload?.data || payload;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePurchaseItem = (item) => {
  const quantity = toNumber(item?.quantity);
  const unitCost = toNumber(item?.unitCost ?? item?.costPrice);
  const sellingPrice = toNumber(item?.sellingPrice);
  const subtotal = toNumber(item?.subtotal ?? item?.lineTotal ?? item?.total ?? item?.totalPrice);

  return {
    ...item,
    quantity,
    unitCost,
    sellingPrice,
    subtotal: subtotal || quantity * unitCost,
    batchNumber: item?.batchNumber || item?.batch_number || "—",
    remainingQuantity: toNumber(item?.remainingQuantity ?? item?.remaining_quantity),
    expiryDate: item?.expiryDate || item?.expiry || item?.expirationDate || item?.expiresAt || null,
  };
};

const resolveCreatedBy = (purchase) => {
  // 1. Try custom attributes (camelCase or snake_case)
  const createdBy = purchase?.createdBy || purchase?.created_by || "";
  if (createdBy && typeof createdBy === 'string' && isNaN(Number(createdBy)) && createdBy.toLowerCase() !== "system") return createdBy;

  const createdByName = purchase?.createdByName || purchase?.created_by_name || purchase?.user_name || "";
  const createdByRole = purchase?.createdByRole || purchase?.created_by_role || purchase?.user_role || "";

  // 2. Try nested relation objects
  const creatorObj = purchase?.user || purchase?.creator || purchase?.createdByUser || purchase?.created_by_user || (typeof purchase?.created_by === 'object' ? purchase?.created_by : {});
  const firstName = creatorObj?.firstName || creatorObj?.first_name || "";
  const lastName = creatorObj?.lastName || creatorObj?.last_name || "";
  const name = creatorObj?.name || (firstName ? `${firstName} ${lastName}`.trim() : "");
  const role = creatorObj?.role || "";

  // 3. Final merge
  const finalName = createdByName || name || "";
  const finalRole = createdByRole || role || "";

  if (finalRole && finalName) {
    const roleLabel = String(finalRole).charAt(0).toUpperCase() + String(finalRole).slice(1).toLowerCase();
    return `${roleLabel} - ${finalName}`;
  }

  return finalName || "System";
};

export default function ViewPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const isCEO = user?.role === 'CEO' || user?.normalizedRole === 'CEO';
  const [purchase, setPurchase] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await purchaseService.getPurchaseById(id);
        const found = extractPurchase(response);
        if (found?.id) {
          setPurchase({
            ...found,
            status: String(found.status || "pending").toLowerCase(),
            paymentStatus: String(found.paymentStatus || "unpaid").toLowerCase(),
            paymentMethod: found.paymentMethod || "bank_transfer",
            supplierName: found.supplierName || found.supplier?.name || "Unknown Supplier",
            purchaseDate: found.purchaseDate || found.date || found.createdAt,
            dueDate: found.dueDate || null,
            expectedDeliveryDate: found.expectedDeliveryDate || null,
            receivedDate: found.receivedDate || null,
            subtotal: toNumber(found.subtotal ?? 0),
            tax: toNumber(found.tax ?? 0),
            shippingCost: toNumber(found.shippingCost ?? 0),
            totalAmount: toNumber(found.totalAmount ?? found.total ?? found.amount ?? 0),
            batchNumber: found.batchNumber || found.batch_number || "—",
            notes: found.notes || "",
            supplier: {
                name: found.supplier?.name || found.supplierName || "Unknown",
                phone: found.supplier?.phone || "—",
                email: found.supplier?.email || "—",
                address: found.supplier?.address || "—",
                contactPerson: found.supplier?.contactPerson || found.supplier?.contact_person || "—",
                rating: Number(found.supplier?.rating || 0),
                id: found.supplier?.id || found.supplierId
            },
            transactions: found.transactions || [],
            createdBy: resolveCreatedBy(found),
          });
          const purchaseItems = found.purchaseItems || found.items || [];
          setItems(purchaseItems.map(normalizePurchaseItem));
        }
      } catch (error) {
        console.error("Error fetching purchase", error);
        showError(error?.message || "Failed to fetch purchase details");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const result = await confirmDelete("this purchase");
    if (!result.isConfirmed) return;

    try {
      await purchaseService.deletePurchase(id);
      showSuccess("Purchase deleted successfully");
      navigate("/dashboard/purchases");
    } catch (error) {
      console.error("Failed to delete purchase", error);
      showError(error?.message || "Failed to delete purchase");
    }
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Approve Purchase?",
      text: "Are you sure you want to approve this purchase?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve it",
    });

    if (result.isConfirmed) {
      try {
        await purchaseService.approvePurchase(id);
        setPurchase((prev) => ({ ...prev, status: "approved" }));
        showSuccess("Purchase approved successfully");
      } catch (error) {
        console.error("Failed to approve purchase", error);
        showError(error?.message || "Failed to approve purchase");
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-amber-100 text-amber-700",
      partial: "bg-blue-100 text-blue-700",
      received: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-rose-100 text-rose-700",
      approved: "bg-emerald-100 text-emerald-700",
    };
    return badges[status] || "bg-gray-100 text-gray-600";
  };

  const getPaymentBadge = (status) => {
    const badges = {
      unpaid: "bg-rose-100 text-rose-700",
      partial: "bg-amber-100 text-amber-700",
      paid: "bg-emerald-100 text-emerald-700",
    };
    return badges[status] || "bg-gray-100 text-gray-600";
  };

  const getPaymentMethodIcon = (method) => {
      const methods = {
          bank_transfer: Landmark,
          cash: Banknote,
          credit_card: CreditCard,
          mobile_money: Landmark,
      };
      return methods[method?.toLowerCase()] || FileText;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const purchaseReference = purchase?.waybillNumber || purchase?.purchaseNumber || "";

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
              <h1 className="text-2xl font-bold text-gray-900 group flex items-center gap-2">
                  <span>{purchaseReference}</span>
                  {purchase.purchaseNumber && purchase.purchaseNumber !== purchaseReference && (
                      <span className="text-sm font-normal text-gray-400 font-mono">({purchase.purchaseNumber})</span>
                  )}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusBadge(purchase.status)}`}>
                  PO: {purchase.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getPaymentBadge(purchase.paymentStatus)}`}>
                  Payment: {purchase.paymentStatus}
                </span>
                <span className="text-sm text-gray-500 font-medium ml-1">Supplier: {purchase.supplier.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCEO && purchase.status === "pending" && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              )}
              {purchase.status === "pending" && (
                <Link
                  to={`/dashboard/purchases/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Edit2 size={16} />
                  Edit
                </Link>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Purchase Items</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                Batch: {purchase.batchNumber}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qty / Rem</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Unit Cost</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Selling</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Batch / Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50/50 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {item.productName || item.product?.name || `Product ${index + 1}`}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono mt-0.5">{item.product?.sku || "No SKU"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                            <span className={`text-[10px] font-bold ${item.remainingQuantity > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                                Left: {item.remainingQuantity}
                            </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm text-gray-600">{formatPrice(item.unitCost)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium text-emerald-600">{formatPrice(item.sellingPrice)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">{formatPrice(item.subtotal)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-mono text-gray-500">{item.batchNumber}</span>
                            <span className="text-[10px] text-rose-500 font-bold mt-0.5">
                                {item.expiryDate ? formatDate(item.expiryDate) : "NO EXPIRY"}
                            </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Financial Summary */}
            <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/10">
                <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
                    <div className="flex-1 max-w-md">
                        <div className="flex items-center gap-2 mb-2">
                            <Hash size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Batch Reference</span>
                        </div>
                        <p className="text-sm font-mono font-bold text-gray-600 bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm">
                            {purchase.batchNumber}
                        </p>
                    </div>

                    <div className="max-w-xs w-full space-y-3">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-semibold text-gray-900">{formatPrice(purchase.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="font-medium">Tax</span>
                            <span className="font-semibold text-gray-900">{formatPrice(purchase.tax)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="font-medium">Shipping Cost</span>
                            <span className="font-semibold text-gray-900">{formatPrice(purchase.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-base font-black text-gray-900 uppercase tracking-tight">Total Payable</span>
                            <span className="text-xl font-black text-emerald-600">{formatPrice(purchase.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Transactions History */}
          {purchase.transactions && purchase.transactions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <Activity size={18} className="text-emerald-500" />
                    <h3 className="font-semibold text-gray-900">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {purchase.transactions.map((tx, idx) => (
                                <tr key={tx.id || idx} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm font-semibold text-gray-900 capitalize">{tx.transactionType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            {tx.paymentMethod === 'bank_transfer' ? <Landmark size={14} /> : <Banknote size={14} />}
                                            <span className="text-xs font-medium capitalize">{tx.paymentMethod?.replace(/_/g, ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-gray-900">{formatPrice(Math.abs(tx.amount))}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs text-gray-400 font-medium">{formatDate(tx.createdAt)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* Notes */}
          {purchase.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed text-sm italic">"{purchase.notes}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Purchase Metadata</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <FileText size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Waybill Number</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono tracking-tighter">{purchaseReference}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Purchase Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(purchase.purchaseDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <UserCheck size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Created By</p>
                  <p className="text-sm font-semibold text-gray-900">{purchase.createdBy}</p>
                </div>
              </div>

              <div className="pt-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-2">
                          <Activity size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">Last Update</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{new Date(purchase.updatedAt).toLocaleTimeString()}</span>
                  </div>
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Supplier</h3>
              <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < purchase.supplier.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  ))}
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{purchase.supplier.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{purchase.supplier.contactPerson}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><Phone size={14} /></div>
                      <p className="text-xs font-semibold text-gray-600 tracking-tight">{purchase.supplier.phone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><Mail size={14} /></div>
                      <p className="text-xs font-semibold text-gray-600 tracking-tight break-all">{purchase.supplier.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><MapPin size={14} /></div>
                      <p className="text-xs font-medium text-gray-500 leading-relaxed italic">{purchase.supplier.address}</p>
                  </div>
              </div>

              <Link 
                to={`/dashboard/suppliers/${purchase.supplier.id}`}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
              >
                  View Full Profile <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Logistics & Payment Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Truck size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-900 uppercase text-[10px] tracking-widest">Procurement tracking</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  {(() => {
                    const Icon = getPaymentMethodIcon(purchase.paymentMethod);
                    return <Icon size={16} className="text-gray-500" />;
                  })()}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Method</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{purchase.paymentMethod?.replace(/_/g, " ")}</p>
                </div>
              </div>

              {purchase.dueDate && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-500">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Payment Due</p>
                    <p className="text-sm font-bold text-rose-600">{formatDate(purchase.dueDate)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-500 font-bold">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Expected Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">{purchase.expectedDeliveryDate ? formatDate(purchase.expectedDeliveryDate) : "NOT SPECIFIED"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 font-bold">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Warehouse Recv</p>
                  <p className="text-sm font-semibold text-gray-900">{purchase.receivedDate ? formatDate(purchase.receivedDate) : "PENDING"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
