import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Hash, Tag, Layers, AlertTriangle, Image } from "lucide-react";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";

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

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
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
            code: found.code || found.sku || "—",
            currentStock: Number(found.currentStock ?? found.quantity ?? 0),
            reorderThreshold: Number(found.reorderThreshold ?? found.reorderLevel ?? 0),
            category: found.category || found.categoryName || category?.name || "Unknown",
            supplier: found.supplier || found.supplierName || supplier?.name || "Unknown",
            unitOfMeasure: found.unitOfMeasure || found.unit || "N/A",
            createdAt: found.createdAt || null,
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
    if (product.currentStock === 0) return { label: "Out of Stock", color: "bg-rose-100 text-rose-700" };
    if (product.currentStock <= product.reorderThreshold) return { label: "Low Stock", color: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700" };
  };

  const stockStatus = getStockStatus();
  const isLowStock = product.currentStock <= product.reorderThreshold;

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
                    {product.currentStock}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">Reorder Level</p>
                  <p className="text-3xl font-bold text-gray-900">{product.reorderThreshold}</p>
                </div>
              </div>
              
              {isLowStock && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-700">Stock is below reorder threshold. Consider restocking soon.</p>
                </div>
              )}
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
                  <p className="text-xs text-gray-400 uppercase font-medium">Product Code</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{product.code}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Tag size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Layers size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Unit of Measure</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{product.unitOfMeasure}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Created</p>
                  <p className="text-sm font-semibold text-gray-900">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
