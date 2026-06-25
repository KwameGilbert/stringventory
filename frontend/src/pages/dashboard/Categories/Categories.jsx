import { useState, useEffect } from "react";
import { FolderTree, Package, CheckCircle2 } from "lucide-react";
import CategoryHeader from "../../../components/dashboard/Categories/CategoryHeader";
import CategoryGrid from "../../../components/dashboard/Categories/CategoryGrid";
import CategoryList from "../../../components/dashboard/Categories/CategoryList";
import categoryService from "../../../services/business/categoryService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useAuth } from "../../../providers/AuthContext";
import { canManageCatalog } from "../../../utils/accessControl";
import { resolveApiMediaUrl } from "../../../utils/mediaUrl";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";

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

const resolveCategoryImageUrl = (category) =>
  resolveApiMediaUrl(
    category?.image ||
      category?.imageUrl ||
      category?.image_url ||
      category?.thumbnail ||
      category?.photo ||
      null
  );

const normalizeCategory = (category) => ({
  ...category,
  productsCount:
    category?.productsCount ??
    category?.products_count ??
    category?.productCount ??
    0,
  image: resolveCategoryImageUrl(category),
  status: category?.status || "active",
});

export default function Categories() {
  const { user } = useAuth();
  const [view, setView] = useState('list');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const canManage = canManageCatalog(user?.role || user?.normalizedRole);

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
    if (!canManage) return;
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
    if (!canManage) return;
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

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportExcel = () => {
    if (filteredCategories.length === 0) return;

    const dataToExport = filteredCategories.map((cat) => ({
      ID: cat.id,
      Name: cat.name,
      Description: cat.description || "N/A",
      Status: cat.status.charAt(0).toUpperCase() + cat.status.slice(1),
      "Products Count": cat.productsCount,
      "Created At": cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "N/A",
      "Last Updated": cat.updatedAt ? new Date(cat.updatedAt).toLocaleDateString() : "N/A",
    }));

    exportToExcel(dataToExport, "stringventory_categories", "Categories");
  };

  const handleExportPDF = async () => {
    if (filteredCategories.length === 0) return;

    const tableData = {
      headers: ["ID", "Name", "Description", "Status", "Products"],
      rows: filteredCategories.map(cat => [
        cat.id,
        cat.name,
        cat.description || "N/A",
        cat.status.toUpperCase(),
        cat.productsCount
      ])
    };

    try {
      await exportToPDF({
        title: "Inventory Categories Report",
        fileName: "stringventory_categories",
        table: tableData
      });
    } catch (error) {
      showError("Failed to generate PDF");
    }
  };

  const totalCategories = categories.length;
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productsCount || 0), 0);
  const activeCategories = categories.filter((c) => c.status === "active").length;

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
        <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-2">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Categories Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Total Categories</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-semibold tracking-tight">{totalCategories}</h3>
            <p className="text-blue-100/80 text-xs font-medium mt-1">Structured product classification</p>
          </div>
        </div>

        {/* Total Products Assigned Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-emerald-100 font-semibold text-sm uppercase tracking-wider">Total Products</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-semibold tracking-tight">{totalProducts}</h3>
            <p className="text-emerald-100/80 text-xs font-medium mt-1">Items cataloged across groups</p>
          </div>
        </div>

        {/* Active Status Breakdown Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-amber-100 font-semibold text-sm uppercase tracking-wider">Catalog Status</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-baseline justify-between">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight">{activeCategories}</h3>
              <p className="text-amber-100/80 text-xs font-medium mt-1">Active categories</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-white/90">{totalCategories - activeCategories}</span>
              <p className="text-amber-100/80 text-xs font-medium mt-1">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      <CategoryHeader 
        view={view} 
        setView={setView} 
        totalCategories={filteredCategories.length} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        canManage={canManage} 
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      
      {view === 'grid' ? (
        <CategoryGrid categories={filteredCategories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} canManage={canManage} />
      ) : (
        <CategoryList categories={filteredCategories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} canManage={canManage} />
      )}
    </div>
  );
}

