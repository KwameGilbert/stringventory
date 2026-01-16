import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../../../components/admin/Categories/CategoryForm";
import axios from "axios";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     const fetchData = async () => {
         try {
             const response = await axios.get('/data/categories.json');
             const category = response.data.find(c => c.id === id);
             if (category) {
                 setData(category);
             } else {
                 setError("Category not found");
             }
         } catch (error) {
             console.error("Error fetching category", error);
             setError("Failed to load category");
         } finally {
             setLoading(false);
         }
     }
     fetchData();
  }, [id]);

  const handleUpdate = (formData) => {
    console.log("Updating category:", formData);
    navigate("/dashboard/categories");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-red-500" />
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
    <div className="pb-8 animate-fade-in">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => navigate("/dashboard/categories")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium">Back to Categories</span>
        </button>
      </div>

      <CategoryForm 
          title="Edit Category"
          subTitle={`Edit details for ${data.name}`}
          initialData={data}
          onSubmit={handleUpdate}
      />
    </div>
  );
}

