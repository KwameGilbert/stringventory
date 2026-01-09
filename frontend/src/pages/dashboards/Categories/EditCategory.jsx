import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../../../components/admin/Categories/CategoryForm";
import axios from "axios";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
     const fetchData = async () => {
         try {
             const response = await axios.get('/data/categories.json');
             const category = response.data.find(c => c.id === parseInt(id));
             if (category) {
                 setData(category);
             }
         } catch (error) {
             console.error("Error fetching category", error);
         }
     }
     fetchData();
  }, [id]);

  const handleUpdate = (formData) => {
    console.log("Updating category:", formData);
    navigate("/dashboard/categories");
  };

  if (!data) {
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

