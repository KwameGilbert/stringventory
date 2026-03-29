import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  Hash, 
  Truck, 
  Clock, 
  AlertTriangle,
  History,
  ShoppingCart,
  CheckCircle2,
  XCircle
} from "lucide-react";
import inventoryService from "../../../services/inventoryService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { showError } from "../../../utils/alerts";
import { isProductApproved } from "../../../utils/productApproval";

const extractList = (response, key) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.[key])) return payload.data[key];

  return [];
};

export default function ViewInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inventoryRes, categoriesRes, suppliersRes] = await Promise.all([
          inventoryService.getInventory(),
          categoryService.getCategories(),
          supplierService.getSuppliers(),
        ]);

        const inventoryEntries = extractList(inventoryRes, "inventory");
        const categories = extractList(categoriesRes, "categories");
        const suppliers = extractList(suppliersRes, "suppliers");

        const found = inventoryEntries.find((entry) => String(entry.id) === String(id));
        
        if (found) {
          const product = found.product || {};
          
          if (product.id && !isProductApproved(product)) {
            showError("This product is not approved and cannot be viewed in Stock Management");
            navigate("/dashboard/inventory");
            return;
          }

          const category = categories.find((c) => String(c.id) === String(product?.categoryId));
          const supplier = suppliers.find((s) => String(s.id) === String(product?.supplierId));
          
          const unitCost = Number(found.unitCost ?? product?.costPrice ?? product?.cost ?? 0);
          const quantity = Number(found.quantity ?? found.currentStock ?? 0);

          setItem({
            ...found,
            productName: product?.name || found.productName || "Unknown Product",
            sku: product?.sku || "N/A",
            description: product?.description || "",
            category: category?.name || product?.categoryName || found.category || found.categoryName || "Uncategorized",
            supplier: supplier?.name || product?.supplierName || found.supplier || found.supplierName || "Unknown Supplier",
            unitCost,
            quantity,
            totalValue: Number(found.totalValue ?? quantity * unitCost),
            entryDate: found.createdAt || found.lastUpdated || found.lastStockCheck || new Date().toISOString(),
            expiryDate: found.soonestExpiryDate || found.expiryDate || null,
            batches: product?.batches || []
          });
        } else {
           showError("Inventory entry not found");
           navigate("/dashboard/inventory");
        }
      } catch (error) {
        console.error("Error fetching inventory", error);
        showError(error?.message || "Failed to fetch inventory details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days === null) return { label: "No Expiry", color: "bg-gray-100 text-gray-600" };
    if (days < 0) return { label: "Expired", color: "bg-rose-100 text-rose-700" };
    if (days <= 30) return { label: `${days} days left`, color: "bg-amber-100 text-amber-700" };
    if (days <= 90) return { label: `${days} days left`, color: "bg-blue-100 text-blue-700" };
    return { label: `${days} days left`, color: "bg-emerald-100 text-emerald-700" };
  };

  if (loading || !item) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
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

  const expiryStatus = getExpiryStatus(item.expiryDate);

  return (
    <div className="max-w-6xl mx-auto pb-8 px-4 animate-fade-in ">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/inventory")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Inventory</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center shadow-inner">
                <Package className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.productName}</h1>
                  {item.status === 'in_stock' ? (
                     <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">In Stock</span>
                  ) : (
                     <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-rose-100 text-rose-700 border border-rose-200">{item.status?.replace('_', ' ')}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    SKU: {item.sku}
                  </span>
                  {item.batchNumber && (
                    <span className="font-mono text-xs text-gray-500 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100/50">
                      Batch: {item.batchNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Actions removed */}
            </div>
          </div>
        </div>
        
        {item.description && (
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50">
            <p className="text-sm text-gray-600 leading-relaxed italic">"{item.description}"</p>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Metrics Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50/50 to-white">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Current Stock Profile
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Quantity</p>
                      <div className="p-2 rounded-xl bg-blue-50">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                   </div>
                   <p className="text-3xl font-black text-gray-900">{item.quantity.toLocaleString()}</p>
                   <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Units Available</p>
                </div>

                {/* Unit Cost */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Unit Cost</p>
                      <div className="p-2 rounded-xl bg-emerald-50">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                   </div>
                   <p className="text-3xl font-black text-gray-900">{formatCurrency(item.unitCost)}</p>
                   <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Per Base Unit</p>
                </div>

                {/* Total Value */}
                <div className="md:col-span-2 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100 font-bold uppercase tracking-widest mb-1 opacity-80">Estimated Stock Value</p>
                      <p className="text-4xl font-black">{formatCurrency(item.totalValue)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Batches Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50/50 to-white flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                Inventory Batches
              </h3>
              <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase">
                {item.batches?.length || 0} Batches Tracked
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                       <th className="px-6 py-3">Batch ID / PO</th>
                       <th className="px-6 py-3">Quantity</th>
                       <th className="px-6 py-3">Cost/Selling</th>
                       <th className="px-6 py-3">Dates</th>
                       <th className="px-6 py-3">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {item.batches?.length > 0 ? item.batches.map((batch) => (
                       <tr key={batch.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-sm">{batch.batchNumber}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{batch.purchase?.purchaseNumber || 'No PO'}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-sm">{batch.remainingQuantity} / {batch.quantity}</span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                   <div 
                                      className={`h-full rounded-full ${batch.remainingQuantity === 0 ? 'bg-gray-300' : 'bg-blue-500'}`}
                                      style={{ width: `${(batch.remainingQuantity / batch.quantity) * 100}%` }}
                                   />
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="text-xs text-gray-600"><span className="text-gray-400 font-medium">Cost:</span> {formatCurrency(batch.costPrice)}</span>
                                <span className="text-xs text-emerald-600 font-bold"><span className="text-gray-400 font-medium">Sell:</span> {formatCurrency(batch.sellingPrice)}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                   <Calendar className="w-3 h-3" />
                                   Received: {formatDate(batch.purchase?.purchaseDate)}
                                </div>
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold ${getDaysUntilExpiry(batch.expiryDate) < 30 ? 'text-amber-600' : 'text-gray-500'}`}>
                                   <Clock className="w-3 h-3" />
                                   Expiry: {formatDate(batch.expiryDate)}
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            {batch.remainingQuantity > 0 ? (
                               <div className="flex items-center gap-1.5 text-emerald-600">
                                  <CheckCircle2 size={14} />
                                  <span className="text-[10px] font-bold uppercase">Active</span>
                               </div>
                            ) : (
                               <div className="flex items-center gap-1.5 text-gray-400">
                                  <XCircle size={14} />
                                  <span className="text-[10px] font-bold uppercase">Depleted</span>
                               </div>
                            )}
                          </td>
                       </tr>
                    )) : (
                       <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm italic">
                             No detailed batch information available for this product.
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supplier Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Manufacturer/Supplier</h3>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Source Carrier</p>
                  <p className="text-lg font-black text-gray-900 leading-tight">{item.supplier}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Audit Information</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 border border-gray-200">
                  <Hash className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase italic">System Trace ID</p>
                  <p className="text-sm font-black text-gray-900">#INV-{String(item.id).padStart(5, '0')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase italic">Last Activity Log</p>
                  <p className="text-sm font-black text-gray-900">{formatDate(item.entryDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Tracking */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Expiry Management</h3>
            </div>
            <div className="p-5">
              {item.expiryDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${getDaysUntilExpiry(item.expiryDate) <= 30 ? 'bg-amber-100 border-amber-200' : 'bg-gray-100 border-gray-200'} border`}>
                      <Clock className={`w-4 h-4 ${getDaysUntilExpiry(item.expiryDate) <= 30 ? 'text-amber-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase italic">Soonest Batch Expiry</p>
                      <p className="text-sm font-black text-gray-900">{formatDate(item.expiryDate)}</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl ${expiryStatus.color} shadow-sm border border-current transition-all duration-300`}>
                    {getDaysUntilExpiry(item.expiryDate) <= 30 && (
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    )}
                    <span className="text-sm font-black uppercase tracking-widest">{expiryStatus.label}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                  <div className="p-3 rounded-full bg-gray-50 inline-block mb-3 border border-gray-100">
                    <Clock className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-xs font-bold uppercase">No Perishable Risk Detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
