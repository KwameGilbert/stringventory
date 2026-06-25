import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Hash, Image, Package, Eye, AlertCircle, Info, Tag } from "lucide-react";
import categoryService from "../../../services/business/categoryService";
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
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs animate-pulse">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-slate-200 rounded w-48"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-xs text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{error || "Category not found"}</h3>
          <p className="text-slate-500 mb-6 font-medium">The category you are looking for might have been removed or does not exist.</p>
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold text-sm shadow-sm"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/categories")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
      >
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="font-semibold text-sm">Back to Categories</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Category Image */}
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden relative shadow-2xs">
                <Image className="w-8 h-8 text-slate-400 absolute" />
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
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{category.name}</h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs border ${
                    category.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">ID: #{category.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Link
                to={`/dashboard/categories/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold text-xs shadow-sm shadow-slate-900/20 active:scale-95"
              >
                <Edit2 size={15} />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold text-xs shadow-2xs active:scale-95 cursor-pointer"
              >
                <Trash2 size={15} />
                <span>Delete</span>
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
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-slate-700" />
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Description</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {category.description || "No description provided for this category."}
              </p>
            </div>
          </div>

          {/* Products Table Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Package size={18} className="text-emerald-700" />
                <h3 className="font-semibold text-emerald-950 text-sm uppercase tracking-wider">Products in Category</h3>
              </div>
              <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-2xs">
                {category.products?.length || 0} Products
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {category.products && category.products.length > 0 ? (
                <table className="w-full text-left whitespace-nowrap min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Selling Price</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Cost Price</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Soonest Expiry</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {category.products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover relative z-10" />
                              ) : (
                                <Package className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate max-w-xs">{product.name}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-semibold text-slate-900 font-mono">
                            {formatPrice(product.sellingPrice || 0, sourceCurrency)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-semibold text-slate-500 font-mono">
                            {formatPrice(product.costPrice || 0, sourceCurrency)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {product.soonestExpiryDate ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                <Calendar size={13} className="text-slate-400" />
                                {new Date(product.soonestExpiryDate).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              {new Date(product.soonestExpiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30)) && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg w-fit shadow-2xs">
                                  <AlertCircle size={12} />
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/dashboard/products/${product.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl transition-all text-xs font-semibold shadow-2xs active:scale-95"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-200">
                    <Package className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-semibold mb-1">No products found</h4>
                  <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">
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
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-100 flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-indigo-700" />
              <h3 className="font-semibold text-indigo-950 text-sm uppercase tracking-wider">Information</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shadow-2xs">
                  <Hash size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Category ID</p>
                  <p className="text-sm font-mono font-semibold text-slate-900 mt-0.5">#{category.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shadow-2xs">
                  <Package size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Products</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{category.productsCount} items</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shadow-2xs">
                  <Calendar size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Created</p>
                  <p className="text-xs font-semibold text-slate-700 font-mono mt-0.5">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shadow-2xs">
                  <Clock size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Last Modified</p>
                  <p className="text-xs font-semibold text-slate-700 font-mono mt-0.5">
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
