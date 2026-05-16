import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Hash, Tag, Layers, AlertTriangle, Image, Banknote, Truck, Info, MapPin, Mail, Phone, User, ShoppingBag, Clock, Package } from "lucide-react";
import { productService } from "../../../services/business/productService";
import categoryService from "../../../services/business/categoryService";
import supplierService from "../../../services/business/supplierService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

const extractList = (response, key) => {
  const payload = response?.data || response || {};
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.[key])) return payload.data[key];
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const extractProduct = (response) => {
  const payload = response?.data || response || {};
  return payload?.product || payload?.data?.product || payload?.data || payload;
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient permissions") || message.includes("forbidden");
};

const toDisplayText = (value, fallback = "Unknown") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    if (typeof value.name === "string") return value.name;
    if (typeof value.title === "string") return value.title;
    if (typeof value.label === "string") return value.label;
  }
  return fallback;
};

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermissionDenied(false);
        const [productRes, categoriesRes, suppliersRes] = await Promise.all([
          productService.getProductById(id),
          categoryService.getCategories(),
          supplierService.getSuppliers(),
        ]);

        const found = extractProduct(productRes);
        if (found?.id) {
          const categories = extractList(categoriesRes, "categories");
          const suppliers = extractList(suppliersRes, "suppliers");
          const category = categories.find((c) => String(c.id) === String(found.categoryId));
          const supplier = suppliers.find((s) => String(s.id) === String(found.supplierId));

          setProduct({
            ...found,
            name: toDisplayText(found.name, "Unnamed Product"),
            description: toDisplayText(found.description, "No description provided for this product."),
            code: toDisplayText(found.code || found.sku, "—"),
            barcode: toDisplayText(found.barcode, "—"),
            currentStock: Number(found.inventory?.quantity ?? found.currentStock ?? found.quantity ?? 0),
            reorderLevel: Number(found.reorderLevel ?? found.reorderThreshold ?? 0),
            warehouseLocation: toDisplayText(found.inventory?.warehouseLocation, "Not assigned"),
            inventoryStatus: found.inventory?.status || "unknown",
            soonestExpiryDate: found.soonestExpiryDate || found.inventory?.soonestExpiryDate || null,
            category: toDisplayText(found.category?.name || found.category, "Unknown"),
            categoryDescription: found.category?.description || null,
            categoryImage: found.category?.image || null,
            supplier: toDisplayText(found.supplier?.name || found.supplier, "Unknown"),
            supplierDetails: found.supplier || null,
            unitOfMeasure: toDisplayText(found.unit_of_measure?.name || found.unitOfMeasure || found.unit, "N/A"),
            unitAbbreviation: found.unit_of_measure?.abbreviation || null,
            createdAt: found.createdAt || null,
            updatedAt: found.updatedAt || null,
            batches: Array.isArray(found.batches) ? found.batches : [],
            orderItems: Array.isArray(found.order_items) ? found.order_items : [],
            costPrice: Number(found.costPrice || found.cost || 0),
            sellingPrice: Number(found.sellingPrice || found.price || 0),
          });
        }
      } catch (error) {
        console.error("Error fetching product", error);
        if (isForbiddenError(error)) {
          setPermissionDenied(true);
          return;
        }
        showError(error?.message || "Failed to fetch product details");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const result = await confirmDelete("this product");
    if (!result.isConfirmed) return;

    try {
      await productService.deleteProduct(id);
      showSuccess("Product deleted successfully");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Failed to delete product", error);
      showError(error?.message || "Failed to delete product");
    }
  };

  if (permissionDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to view this product. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-sm"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse shadow-sm">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>
          <div className="h-32 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const getStockStatus = () => {
    if (product.currentStock === 0 || product.inventoryStatus === "out_of_stock") return { label: "Out of Stock", color: "bg-rose-50 text-rose-700 border-rose-200" };
    if (product.currentStock <= product.reorderLevel) return { label: "Low Stock", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "In Stock", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  const stockStatus = getStockStatus();
  const isLowStock = product.currentStock <= product.reorderLevel;

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group"
      >
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="font-semibold text-sm">Back to Products Catalog</span>
      </button>

      {/* Premium Header Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Product Image */}
              <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-slate-400 stroke-1" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-2.5 mt-2 font-medium">
                  <span className="text-xs text-slate-700 font-mono font-semibold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                    {product.code}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border shadow-2xs ${
                    product.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {product.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border shadow-2xs ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Link
                to={`/dashboard/products/${id}/edit`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold text-sm shadow-sm"
              >
                <Edit2 size={16} />
                Edit Product
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 border border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all font-semibold text-sm shadow-2xs"
              >
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
          {/* Description Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2.5">
                <Info className="w-4 h-4 text-slate-700" />
                Product Description
              </h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {product.description || "No description provided for this product."}
              </p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-100 flex items-center gap-2.5">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <h3 className="font-semibold text-emerald-950 text-sm uppercase tracking-wider">Pricing Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-2xs">
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1 tracking-wider">Unit Cost Price</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatPrice(product.costPrice)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">Average purchase cost per unit</p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 shadow-2xs">
                  <p className="text-xs text-emerald-700 uppercase font-semibold mb-1 tracking-wider">Unit Selling Price</p>
                  <p className="text-2xl font-semibold text-emerald-600">
                    {formatPrice(product.sellingPrice)}
                  </p>
                  <p className="text-[10px] text-emerald-600/80 mt-1 italic">Base price before discounts/tax</p>
                </div>
                {product.sellingPrice > 0 && product.costPrice > 0 && (
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/60 shadow-2xs col-span-2 lg:col-span-1">
                    <p className="text-xs text-blue-700 uppercase font-semibold mb-1 tracking-wider">Est. Margin (%)</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-blue-600/80 mt-1 italic">Estimated gross profit margin</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stock Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 bg-amber-100 flex items-center justify-between">
              <h3 className="font-semibold text-amber-950 text-sm uppercase tracking-wider flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-700" />
                Stock & Inventory Controls
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200/60 shadow-2xs">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Stock</p>
                  <p className={`text-4xl font-semibold ${isLowStock ? "text-amber-600" : "text-slate-900"}`}>
                    {product.currentStock} <span className="text-sm font-semibold text-slate-400 ml-1">{product.unitAbbreviation || product.unitOfMeasure}</span>
                  </p>
                </div>
                <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200/60 shadow-2xs">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Reorder Level Threshold</p>
                  <p className="text-4xl font-semibold text-slate-900">{product.reorderLevel}</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-200 rounded-xl shadow-2xs">
                  <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 uppercase font-semibold tracking-wider mb-0.5">Warehouse Location</p>
                    <p className="text-sm font-semibold text-blue-900">{product.warehouseLocation}</p>
                  </div>
                </div>
                {product.soonestExpiryDate && (
                  <div className="flex items-center gap-3 p-4 bg-rose-50/50 border border-rose-200 rounded-xl shadow-2xs">
                    <div className="p-2.5 bg-rose-100 rounded-lg text-rose-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-rose-500 uppercase font-semibold tracking-wider mb-0.5">Soonest Expiry</p>
                      <p className="text-sm font-semibold text-rose-900">{new Date(product.soonestExpiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {isLowStock && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-2xs">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800 font-semibold">Stock is below reorder threshold. Consider restocking from supplier soon.</p>
                </div>
              )}

              {product.inventory?.lastUpdated && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Inventory last synced</span>
                  <span className="font-mono font-semibold text-slate-600">{new Date(product.inventory.lastUpdated).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Batch History Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-100 bg-blue-100 flex items-center justify-between">
              <h3 className="font-semibold text-blue-950 text-sm uppercase tracking-wider flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-blue-700" />
                Inventory Purchase Batches
              </h3>
              <span className="text-xs font-semibold bg-white text-blue-800 px-3 py-1 rounded-lg border border-blue-200 uppercase tracking-wider shadow-2xs">
                {product.batches.length} active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Batch / PO</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Waybill / Date</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px] text-right">Remaining</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px] text-right">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {product.batches.length > 0 ? (
                    product.batches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{batch.batchNumber}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-semibold mt-0.5">{batch.purchase?.purchaseNumber || "Manual entry"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700 font-semibold">{batch.purchase?.waybillNumber || "No waybill"}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{batch.purchase?.purchaseDate ? new Date(batch.purchase.purchaseDate).toLocaleDateString() : '—'}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {batch.purchase?.status && (
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase shadow-2xs ${
                                batch.purchase.status === 'received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {batch.purchase.status}
                              </span>
                            )}
                            {batch.purchase?.paymentStatus && (
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-semibold uppercase shadow-2xs ${
                                batch.purchase.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {batch.purchase.paymentStatus}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900 text-base">{batch.remainingQuantity}</p>
                          <p className="text-[11px] text-slate-400 font-semibold">of {batch.quantity}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`text-xs font-semibold ${
                            new Date(batch.expiryDate) <= new Date() ? 'text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs inline-block' : 'text-slate-700'
                          }`}>
                            {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic font-semibold">No inventory batches recorded for this product</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sales History Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-100 bg-purple-100 flex items-center justify-between">
              <h3 className="font-semibold text-purple-950 text-sm uppercase tracking-wider flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-purple-700" />
                Recent Sales Orders
              </h3>
              <span className="text-xs font-semibold bg-white text-purple-800 px-3 py-1 rounded-lg border border-purple-200 uppercase tracking-wider shadow-2xs">
                {product.orderItems.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Order #</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Fulfillment</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Summary</th>
                    <th className="px-6 py-3.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {product.orderItems.length > 0 ? (
                    product.orderItems.slice(0, 10).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 font-mono tracking-tight">{item.orderId ? `ORD-${item.orderId}` : "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-slate-700 font-semibold text-xs">{item.fulfilledQuantity} / {item.quantity} units</p>
                            {item.refundedQuantity > 0 && (
                              <p className="text-[10px] text-rose-600 font-semibold italic">-{item.refundedQuantity} refunded</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="text-slate-900 font-semibold text-xs">{formatPrice(item.totalPrice)}</p>
                            <p className="text-[10px] text-slate-500 font-semibold">@ {formatPrice(item.sellingPrice)} ea</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase shadow-2xs border ${
                            item.fulfillmentStatus === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {item.fulfillmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic font-semibold">This product hasn't been ordered yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-100 flex items-center justify-between">
              <h3 className="font-semibold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-700" />
                Catalog Details
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs">
                  <Hash size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Barcode / UPC</p>
                  <p className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60 w-fit mt-0.5">{product.barcode || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 shadow-2xs flex items-center justify-center overflow-hidden">
                  {product.categoryImage ? (
                    <img src={product.categoryImage} alt={product.category} className="w-5 h-5 object-cover rounded-md" />
                  ) : (
                    <Tag size={18} />
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Category</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5" title={product.categoryDescription}>{product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-2xs">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Unit of Measure</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize mt-0.5">
                    {product.unitOfMeasure} {product.unitAbbreviation && <span className="text-slate-400 font-semibold">({product.unitAbbreviation})</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Supplier Contact</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{product.supplierDetails?.contactPerson || product.supplier}</p>
                  {product.supplierDetails?.rating && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full shadow-2xs ${i < product.supplierDetails.rating ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {product.supplierDetails?.email && (
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{product.supplierDetails.email}</p>
                  </div>
                </div>
              )}

              {product.supplierDetails?.phone && (
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60 shadow-2xs">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Phone</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{product.supplierDetails.phone}</p>
                  </div>
                </div>
              )}

              {product.supplierDetails?.address && (
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-200/60 shadow-2xs">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Address</p>
                    <p className="text-xs font-medium text-slate-600 leading-snug mt-0.5">{product.supplierDetails.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Product Lifecycle</p>
                  <div className="space-y-1 mt-1">
                    <p className="text-xs font-medium text-slate-600 font-mono">
                      <span className="font-semibold text-slate-700">Created:</span> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}
                    </p>
                    <p className="text-xs font-medium text-slate-600 font-mono">
                      <span className="font-semibold text-slate-700">Updated:</span> {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
