import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Hash, Image, Package, Eye, AlertCircle } from "lucide-react";
import categoryService from "../../../services/categoryService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { resolveApiMediaUrl } from "../../../utils/mediaUrl";
import { useCurrency } from "../../../utils/currencyUtils";

const extractCategory = (response) => {
  const payload = response?.data || response || {};
  return payload?.category || payload?.data?.category || payload?.data || payload;
};

export default function ViewCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [category, setCategory] = useState(null);
  const [sourceCurrency, setSourceCurrency] = useState("GHS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await categoryService.getCategoryById(id);
        const data = response?.data || response;
        const currentSourceCurrency = data?.currency || "GHS";
        setSourceCurrency(currentSourceCurrency);
        
        const found = extractCategory(response);
        if (found?.id) {
          setCategory({
            ...found,
            image: resolveApiMediaUrl(
              found?.image || found?.imageUrl || found?.image_url || found?.thumbnail || found?.photo || null
            ),
            productsCount:
              found.productsCount ??
              found.products_count ??
              found.productCount ??
              found.products?.length ??
              0,
            products: (found.products || []).map(p => ({
              ...p,
              image: resolveApiMediaUrl(p.image || p.image_url || null)
            }))
          });
        } else {
          setError("Category not found");
        }
      } catch (error) {
        console.error("Error fetching category", error);
        setError(error?.message || "Failed to load category details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const result = await confirmDelete("this category");
    if (!result.isConfirmed) return;

    try {
      await categoryService.deleteCategory(id);
      showSuccess("Category deleted successfully");
      navigate("/dashboard/categories");
    } catch (error) {
      console.error("Failed to delete category", error);
      showError(error?.message || "Failed to delete category");
    }
  };

  if (loading) {
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

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{error || "Category not found"}</h3>
          <p className="text-gray-500 mb-6">The category you are looking for might have been removed or does not exist.</p>
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/categories")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Categories</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Category Image */}
              <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                <Image className="w-8 h-8 text-gray-400 absolute" />
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover relative z-10"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-500">ID: #{category.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to={`/dashboard/categories/${id}/edit`}
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
                {category.description || "No description provided for this category."}
              </p>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                <h3 className="font-semibold text-gray-900">Products in Category</h3>
              </div>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                {category.products?.length || 0} Products
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {category.products && category.products.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Product</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Selling Price</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Cost Price</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Soonest Expiry</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatPrice(product.sellingPrice || 0, sourceCurrency)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-medium text-gray-500">
                            {formatPrice(product.costPrice || 0, sourceCurrency)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {product.soonestExpiryDate ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                <Calendar size={12} className="text-gray-400" />
                                {new Date(product.soonestExpiryDate).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              {/* Simple expiry warning logic: if within 30 days */}
                              {new Date(product.soonestExpiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30)) && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-tighter font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                  <AlertCircle size={10} />
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/dashboard/products/${product.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white rounded-lg transition-all text-xs font-bold"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="text-gray-900 font-bold mb-1">No products found</h4>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    This category doesn't have any products assigned to it yet.
                  </p>
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
              <h3 className="font-semibold text-gray-900">Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Hash size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Category ID</p>
                  <p className="text-sm font-semibold text-gray-900">#{category.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Package size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Products</p>
                  <p className="text-sm font-semibold text-gray-900">{category.productsCount} items</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Created</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Clock size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Last Modified</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

