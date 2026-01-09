import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2, Tag, Download, FileText } from "lucide-react";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function ExpenseCategories() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", color: "#3B82F6" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/expense-categories.json");
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories", error);
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
      setFormData({ name: category.name, description: category.description, color: category.color });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "", color: "#3B82F6" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", color: "#3B82F6" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      // Update existing
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      showSuccess("Category updated successfully");
    } else {
      // Add new
      const newCategory = {
        id: Date.now(),
        ...formData,
        status: "active"
      };
      setCategories([...categories, newCategory]);
      showSuccess("Category created successfully");
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete("this category");
    if (result.isConfirmed) {
      setCategories(categories.filter(cat => cat.id !== id));
      showSuccess("Category deleted successfully");
    }
  };

  const colorOptions = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
    "#EC4899", "#06B6D4", "#F97316", "#6366F1", "#14B8A6"
  ];

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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <Tag size={20} style={{ color: category.color }} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-xs text-gray-400 uppercase">{category.status}</span>
            </div>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color ? "border-gray-900 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
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
