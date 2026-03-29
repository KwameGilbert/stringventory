import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Hash, Tag, Layers, AlertTriangle, Image, Banknote, Truck, Info, MapPin, Mail, Phone, User, ShoppingBag, Clock } from "lucide-react";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
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
      <div className="py-16 animate-fade-in ">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to view this product. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-xl p-8 border border-gray-100 animate-pulse">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getStockStatus = () => {
    if (product.currentStock === 0 || product.inventoryStatus === "out_of_stock") return { label: "Out of Stock", color: "bg-rose-100 text-rose-700" };
    if (product.currentStock <= product.reorderLevel) return { label: "Low Stock", color: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700" };
  };

  const stockStatus = getStockStatus();
  const isLowStock = product.currentStock <= product.reorderLevel;

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Products</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{product.code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {product.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/dashboard/products/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Edit2 size={16} />
                Edit
              </Link>
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Description</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No description provided for this product."}
              </p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-gray-900">Pricing Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1 tracking-wider">Unit Cost Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.costPrice)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">Average purchase cost per unit</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1 tracking-wider">Unit Selling Price</p>
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {formatPrice(product.sellingPrice)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">Base price before discounts/tax</p>
                </div>
                {product.sellingPrice > 0 && product.costPrice > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1 tracking-wider">Est. Margin (%)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 italic">Estimated gross profit margin</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stock Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Stock Information</h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">Current Stock</p>
                  <p className={`text-3xl font-bold ${isLowStock ? "text-amber-600" : "text-gray-900"}`}>
                    {product.currentStock} <span className="text-sm font-medium text-gray-400 ml-1">{product.unitAbbreviation || product.unitOfMeasure}</span>
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">Reorder Level</p>
                  <p className="text-3xl font-bold text-gray-900">{product.reorderLevel}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                          <p className="text-[10px] text-blue-400 uppercase font-bold leading-none mb-1">Warehouse Location</p>
                          <p className="text-sm font-semibold text-blue-700">{product.warehouseLocation}</p>
                      </div>
                  </div>
                  {product.soonestExpiryDate && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                          <Clock className="w-4 h-4 text-rose-500" />
                          <div>
                              <p className="text-[10px] text-rose-400 uppercase font-bold leading-none mb-1">Soonest Expiry</p>
                              <p className="text-sm font-semibold text-rose-700">{new Date(product.soonestExpiryDate).toLocaleDateString()}</p>
                          </div>
                      </div>
                  )}
              </div>
              
              {isLowStock && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-700">Stock is below reorder threshold. Consider restocking soon.</p>
                </div>
              )}

              {product.inventory?.lastUpdated && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Inventory last synced</span>
                    <span className="font-medium font-mono">{new Date(product.inventory.lastUpdated).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Batch History Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Inventory Batches
              </h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                {product.batches.length} active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Batch / PO</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Waybill / Date</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px] text-right">Remaining</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px] text-right">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {product.batches.length > 0 ? (
                    product.batches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors cursor-default">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{batch.batchNumber}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{batch.purchase?.purchaseNumber || "Manual entry"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-600 font-medium">{batch.purchase?.waybillNumber || "No waybill"}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{batch.purchase?.purchaseDate ? new Date(batch.purchase.purchaseDate).toLocaleDateString() : '—'}</p>
                          <div className="flex items-center gap-1 mt-1">
                              {batch.purchase?.status && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    batch.purchase.status === 'received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {batch.purchase.status}
                                </span>
                              )}
                              {batch.purchase?.paymentStatus && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                    batch.purchase.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {batch.purchase.paymentStatus}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-gray-900">{batch.remainingQuantity}</p>
                          <p className="text-[10px] text-gray-400 italic">of {batch.quantity}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`text-xs font-medium ${
                            new Date(batch.expiryDate) <= new Date() ? 'text-rose-600' : 'text-gray-600'
                          }`}>
                            {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No batches found for this product</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sales History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                Recent Orders
              </h3>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                {product.orderItems.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Order #</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Fulfillment</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Summary</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {product.orderItems.length > 0 ? (
                    product.orderItems.slice(0, 10).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 font-mono tracking-tight">{item.orderId ? `ORD-${item.orderId}` : "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                              <p className="text-gray-600 font-medium text-xs">{item.fulfilledQuantity} / {item.quantity} units</p>
                              {item.refundedQuantity > 0 && (
                                <p className="text-[10px] text-rose-500 font-semibold italic">-{item.refundedQuantity} refunded</p>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                              <p className="text-gray-900 font-bold text-xs">{formatPrice(item.totalPrice)}</p>
                              <p className="text-[10px] text-gray-400 font-medium">@ {formatPrice(item.sellingPrice)} ea</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.fulfillmentStatus === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.fulfillmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">This product hasn't been sold yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Hash size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Barcode / UPC</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono text-[10px]">{product.barcode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.categoryImage ? (
                    <img src={product.categoryImage} alt={product.category} className="w-5 h-5 object-cover" />
                  ) : (
                    <Tag size={16} className="text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Category</p>
                  <p className="text-sm font-semibold text-gray-900" title={product.categoryDescription}>{product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Layers size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Unit of Measure</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {product.unitOfMeasure} {product.unitAbbreviation && <span className="text-gray-400 font-normal">({product.unitAbbreviation})</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <User size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Supplier Contact</p>
                  <p className="text-sm font-semibold text-gray-900">{product.supplierDetails?.contactPerson || product.supplier}</p>
                  {product.supplierDetails?.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < product.supplierDetails.rating ? 'bg-amber-400' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {product.supplierDetails?.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Mail size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{product.supplierDetails.email}</p>
                  </div>
                </div>
              )}

              {product.supplierDetails?.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Phone size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">{product.supplierDetails.phone}</p>
                  </div>
                </div>
              )}

              {product.supplierDetails?.address && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Address</p>
                    <p className="text-[10px] font-medium text-gray-600 leading-tight">{product.supplierDetails.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Product Lifecycle</p>
                  <div className="space-y-1">
                      <p className="text-[10px] text-gray-500">
                        <span className="font-bold">Created:</span> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        <span className="font-bold">Last Update:</span> {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "—"}
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
