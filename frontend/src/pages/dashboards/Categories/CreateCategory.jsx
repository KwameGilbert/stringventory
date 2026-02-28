import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "../../../components/admin/Categories/CategoryForm";
import categoryService from "../../../services/categoryService";
import { showError, showSuccess } from "../../../utils/alerts";

const sanitizeImage = (image) => {
  if (!image || typeof image !== "string") return undefined;
  const trimmedImage = image.trim();

  if (!trimmedImage) return undefined;
  if (trimmedImage.startsWith("data:")) return undefined;
  if (trimmedImage.length > 500) return undefined;

  return trimmedImage;
};

export default function CreateCategory() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await categoryService.createCategory({
        name: data.name,
        description: data.description,
        status: data.status,
        image: sanitizeImage(data.image),
      });
      showSuccess("Category created successfully");
      navigate("/dashboard/categories");
    } catch (error) {
      console.error("Failed to create category", error);
      showError(error?.message || "Failed to create category");
    }
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
