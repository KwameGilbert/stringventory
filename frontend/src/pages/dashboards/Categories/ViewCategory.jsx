import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, Hash, Image } from "lucide-react";
import axios from "axios";

export default function ViewCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/categories.json');
        const found = response.data.find(c => c.id === parseInt(id));
        if (found) setCategory(found);
      } catch (error) {
        console.error("Error fetching category", error);
      }
    };
    fetchData();
  }, [id]);

  if (!category) {
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

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
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
              <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
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

          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Products in Category</h3>
              <span className="text-sm text-gray-500">{category.productsCount} items</span>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">Product list integration coming soon</p>
              <p className="text-sm text-gray-400">This category contains {category.productsCount} products</p>
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
                  <p className="text-sm font-semibold text-gray-900">Oct 24, 2024</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Clock size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Last Modified</p>
                  <p className="text-sm font-semibold text-gray-900">Jan 8, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

