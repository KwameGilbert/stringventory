import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Tag, Download, FileText } from "lucide-react";
import expenseService from "../../../services/expenseService";
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
  name: category?.name || "Unnamed Category",
  description: category?.description || "",
  status: category?.status || "active",
});

export default function ExpenseCategories() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await expenseService.getExpenseCategories();
        setCategories(extractCategories(response).map(normalizeCategory));
      } catch (error) {
        console.error("Error loading categories", error);
        showError(error?.message || "Failed to load expense categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleToggleStatus = async (id) => {
    const targetCategory = categories.find((cat) => String(cat.id) === String(id));
    if (!targetCategory) return;

    const nextStatus = targetCategory.status === "active" ? "inactive" : "active";

    try {
      await expenseService.updateExpenseCategory(id, { status: nextStatus });
      setCategories((prev) =>
        prev.map((cat) =>
          String(cat.id) === String(id)
            ? { ...cat, status: nextStatus }
            : cat
        )
      );
      showSuccess("Category status updated");
    } catch (error) {
      console.error("Failed to update category status", error);
      showError(error?.message || "Failed to update category status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await expenseService.updateExpenseCategory(editingCategory.id, {
          name: formData.name,
          description: formData.description,
        });

        const updated = normalizeCategory(response?.data || response || {});

        setCategories((prev) =>
          prev.map((cat) =>
            String(cat.id) === String(editingCategory.id)
              ? { ...cat, ...updated, name: updated?.name || formData.name, description: updated?.description || formData.description }
              : cat
          )
        );

        showSuccess("Category updated successfully");
      } else {
        const response = await expenseService.createExpenseCategory({
          name: formData.name,
          description: formData.description,
        });

        const createdRaw = response?.data || response || {};
        const created = normalizeCategory(createdRaw?.data || createdRaw);

        setCategories((prev) => [...prev, created]);
        showSuccess("Category created successfully");
      }
    } catch (error) {
      console.error("Failed to save category", error);
      showError(error?.message || "Failed to save category");
      return;
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete("this category");
    if (result.isConfirmed) {
      try {
        await expenseService.deleteExpenseCategory(id);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200">
            <FileText size={15} />
            Excel
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-200">
            <Download size={15} />
            PDF
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm shadow-lg shadow-gray-900/10"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 shadow-sm"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Tag size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                category.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => handleToggleStatus(category.id)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {category.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
            {category.expenseCount > 0 && (
              <p className="text-xs text-gray-400 mt-2">{category.expenseCount} expenses</p>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No categories found</h3>
          <p className="text-gray-500 text-sm mb-4">Create your first expense category</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm"
                  placeholder="e.g., Electricity"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm resize-none"
                  placeholder="Brief description of this category..."
                />
              </div>



              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors text-sm"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
