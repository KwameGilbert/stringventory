import { useState, useEffect } from "react";
import CategoryHeader from "../../../components/admin/Categories/CategoryHeader";
import CategoryGrid from "../../../components/admin/Categories/CategoryGrid";
import CategoryList from "../../../components/admin/Categories/CategoryList";
import categoryService from "../../../services/categoryService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";

const extractCategories = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.categories)) return payload.categories;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.categories)) return payload.data.categories;

  return [];
};

const normalizeCategory = (category) => ({
  ...category,
  productsCount:
    category?.productsCount ??
    category?.products_count ??
    category?.productCount ??
    0,
  image: category?.image || category?.imageUrl || null,
  status: category?.status || "active",
});

export default function Categories() {
  const [view, setView] = useState('list');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const data = extractCategories(response).map(normalizeCategory);
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
      showError(error?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id) => {
    const targetCategory = categories.find((cat) => String(cat.id) === String(id));
    if (!targetCategory) return;

    const nextStatus = targetCategory.status === 'active' ? 'inactive' : 'active';

    try {
      await categoryService.updateCategory(id, {
        name: targetCategory.name,
        description: targetCategory.description,
        image: targetCategory.image,
        status: nextStatus,
      });

      setCategories((prev) =>
        prev.map((cat) =>
          String(cat.id) === String(id)
            ? { ...cat, status: nextStatus }
            : cat
        )
      );
      showSuccess(`Category ${nextStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Failed to update category status", error);
      showError(error?.message || "Failed to update category status");
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete("this category");
    if (result.isConfirmed) {
      try {
        await categoryService.deleteCategory(id);
        setCategories((prev) => prev.filter((cat) => String(cat.id) !== String(id)));
        showSuccess("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category", error);
        showError(error?.message || "Failed to delete category");
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <CategoryHeader view={view} setView={setView} totalCategories={categories.length} />
      
      {view === 'grid' ? (
        <CategoryGrid categories={categories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      ) : (
        <CategoryList categories={categories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      )}
    </div>
  );
}

