import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Package, Calendar, DollarSign, Hash, Truck, Clock, AlertTriangle } from "lucide-react";
import inventoryService from "../../../services/inventoryService";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { confirmDelete, showError, showInfo, showSuccess } from "../../../utils/alerts";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, productsRes, categoriesRes, suppliersRes] = await Promise.all([
          inventoryService.getInventory(),
          productService.getProducts(),
          categoryService.getCategories(),
          supplierService.getSuppliers(),
        ]);

        const inventoryEntries = extractList(inventoryRes, "inventory");
        const products = extractList(productsRes, "products");
        const categories = extractList(categoriesRes, "categories");
        const suppliers = extractList(suppliersRes, "suppliers");

        const found = inventoryEntries.find((entry) => String(entry.id) === String(id));
        if (found) {
          const product = products.find((p) => String(p.id) === String(found.productId));
          const category = categories.find((c) => String(c.id) === String(product?.categoryId));
          const supplier = suppliers.find((s) => String(s.id) === String(product?.supplierId));
          const unitCost = Number(found.unitCost ?? product?.costPrice ?? product?.cost ?? 0);
          const quantity = Number(found.quantity ?? found.currentStock ?? 0);

          setItem({
            ...found,
            productName: found.productName || product?.name || "Unknown Product",
            category: found.category || found.categoryName || product?.categoryName || category?.name || "Uncategorized",
            batchNumber: found.batchNumber || found.reference || `BATCH-${found.id}`,
            supplier: found.supplier || found.supplierName || product?.supplierName || supplier?.name || "Unknown Supplier",
            unitCost,
            quantity,
            totalValue: Number(found.totalValue ?? quantity * unitCost),
            entryDate: found.entryDate || found.lastStockCheck || found.createdAt || new Date().toISOString(),
            expiryDate: found.expiryDate || null,
          });
        }
      } catch (error) {
        console.error("Error fetching inventory", error);
        showError(error?.message || "Failed to fetch inventory details");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const result = await confirmDelete("this inventory entry");
    if (!result.isConfirmed) return;

    showInfo("Inventory delete endpoint is not available yet; this action cannot be persisted from detail view.");
    navigate("/dashboard/inventory");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  if (!item) {
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
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const expiryStatus = getExpiryStatus(item.expiryDate);

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Product Image/Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.productName}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                  <span className="font-mono text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                    {item.batchNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-sm">
                <Edit2 size={16} />
                Edit
              </button>
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
          {/* Stock Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Stock Details</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity Received</p>
                    <p className="text-xl font-bold text-gray-900">{item.quantity.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">units</p>
                  </div>
                </div>

                {/* Unit Cost */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unit Cost</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(item.unitCost)}</p>
                    <p className="text-xs text-gray-400">per unit</p>
                  </div>
                </div>

                {/* Total Value */}
                <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Total Stock Value</p>
                      <p className="text-3xl font-bold text-emerald-700">{formatCurrency(item.totalValue)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-emerald-100">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Supplier Information</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier / Manufacturer</p>
                  <p className="text-lg font-semibold text-gray-900">{item.supplier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Entry Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Entry Information</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Hash className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Entry ID</p>
                  <p className="text-sm font-medium text-gray-900">#{item.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Entry Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(item.entryDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Expiry Status</h3>
            </div>
            <div className="p-5">
              {item.expiryDate ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getDaysUntilExpiry(item.expiryDate) <= 30 ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      <Clock className={`w-4 h-4 ${getDaysUntilExpiry(item.expiryDate) <= 30 ? 'text-amber-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Expiry Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(item.expiryDate)}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${expiryStatus.color}`}>
                    {getDaysUntilExpiry(item.expiryDate) <= 30 && (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{expiryStatus.label}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="p-3 rounded-full bg-gray-100 inline-block mb-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No expiry date set</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
