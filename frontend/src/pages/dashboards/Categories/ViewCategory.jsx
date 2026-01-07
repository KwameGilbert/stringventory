import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Package } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import axios from "axios";

export default function ViewCategory() {
  const { id } = useParams();
  const { themeColors } = useTheme();
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
     }
     fetchData();
  }, [id]);

  if (!category) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard/categories" 
            className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
                <ArrowLeft size={20} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
               <p className="text-sm text-gray-500">Category Details</p>
            </div>
          </Link>
        </div>
        
        <Link
          to={`/dashboard/categories/${id}/edit`}
          className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium`}
        >
          <Edit2 size={16} />
          Edit Category
        </Link>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {category.description || "No description provided."}
            </p>
          </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Products</h3>
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
               <Package className="mx-auto mb-2 opacity-20" size={48} />
               <p>Product list integration coming soon...</p>
               <p className="text-sm mt-1">This category contains {category.productsCount} products.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex flex-col items-center text-center p-6 border-b border-gray-50 mb-4">
                <div className={`w-20 h-20 rounded-2xl ${themeColors.bgPrimary} bg-opacity-10 flex items-center justify-center mb-4 text-${themeColors.id}-600`}>
                   <Package size={40} className={themeColors.text} />
                </div>
                <h2 className="font-bold text-xl text-gray-900">{category.name}</h2>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  category.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </span>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Created</span>
                 <span className="font-medium text-gray-900">Oct 24, 2024</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Last Modified</span>
                 <span className="font-medium text-gray-900">Jan 7, 2025</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Products</span>
                 <span className="font-medium text-gray-900">{category.productsCount}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
