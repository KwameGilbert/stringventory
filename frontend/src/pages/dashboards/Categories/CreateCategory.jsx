import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../../../components/admin/Categories/CategoryForm";

export default function CreateCategory() {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    console.log("Creating category:", data);
    // Add API call here
    navigate("/dashboard/categories");
  };

  return (
    <div className="pb-8 animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/categories")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
             <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Categories</span>
        </button>
      </div>

      <CategoryForm 
          title="Create New Category"
          subTitle="Add a new category to your inventory"
          onSubmit={handleCreate}
      />
    </div>
  );
}
