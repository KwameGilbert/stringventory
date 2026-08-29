import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, AlertTriangle } from "lucide-react";
import ProductsHeader from "../../../components/dashboard/Products/ProductsHeader";
import ProductsTable from "../../../components/dashboard/Products/ProductsTable";
import { productService } from "../../../services/business/productService";
import categoryService from "../../../services/business/categoryService";
import supplierService from "../../../services/business/supplierService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useAuth } from "../../../providers/AuthContext";
import { canManageCatalog } from "../../../utils/accessControl";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";

const extractList = (response, key) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.[key])) return payload.data[key];

  return [];
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient permissions") || message.includes("forbidden");
};

const toDisplayText = (value, fallback = "Unknown") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    if (typeof value.name === "string") return value.name;
    if (typeof value.title === "string") return value.title;
    if (typeof value.label === "string") return value.label;
  }
  return fallback;
};

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const canManage = canManageCatalog(user?.role || user?.normalizedRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermissionDenied(false);
        const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
          supplierService.getSuppliers(),
        ]);

        const fetchedProducts = extractList(productsRes, "products");
        const fetchedCategories = extractList(categoriesRes, "categories");
        const fetchedSuppliers = extractList(suppliersRes, "suppliers");

        const mappedProducts = fetchedProducts.map((product) => ({
          ...product,
          code: product.code || product.sku || "—",
          sku: product.sku || product.code || "",
          costPrice: Number(product.costPrice ?? product.cost ?? 0),
          sellingPrice: Number(product.sellingPrice ?? product.price ?? 0),
          currentStock: Number(product.inventory?.quantity ?? product.currentStock ?? product.quantity ?? 0),
          inventoryStatus: product.inventory?.status || null,
          reorderThreshold: Number(product.reorderThreshold ?? product.reorderLevel ?? 0),
          category:
            toDisplayText(product.category, "") ||
            toDisplayText(product.categoryName, "") ||
            fetchedCategories.find((c) => String(c.id) === String(product.categoryId))?.name ||
            "Unknown",
          supplier:
            toDisplayText(product.supplier, "") ||
            toDisplayText(product.supplierName, "") ||
            fetchedSuppliers.find((s) => String(s.id) === String(product.supplierId))?.name ||
            "Unknown",
          unitOfMeasure: product.unitOfMeasure || product.unit || "N/A",
          status: product.status || "active",
        }));

        setProducts(mappedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading data", error);
        if (isForbiddenError(error)) {
          setPermissionDenied(true);
          return;
        }
        showError(error?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.reorderThreshold && p.currentStock > 0).length;
  const outOfStock = products.filter(p => p.currentStock === 0).length;

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const productName = String(product.name || "").toLowerCase();
    const productCode = String(product.code || "").toLowerCase();
    const productSku = String(product.sku || "").toLowerCase();
    const productCategory = String(product.category || "");

    const matchesSearch =
      productName.includes(searchQuery.toLowerCase()) ||
      productCode.includes(searchQuery.toLowerCase()) ||
      productSku.includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || productCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (!canManage) return;
    const result = await confirmDelete("this product");
    if (result.isConfirmed) {
      try {
        await productService.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
        showSuccess("Product deleted successfully");
      } catch (error) {
        console.error("Failed to delete product", error);
        showError(error?.message || "Failed to delete product");
      }
    }
  };

  const handleExportExcel = () => {
    if (filteredProducts.length === 0) return;

    const dataToExport = filteredProducts.map((p) => ({
      Name: p.name,
      Code: p.code,
      SKU: p.sku,
      Category: p.category,
      Supplier: p.supplier,
      "Cost Price": p.costPrice,
      "Selling Price": p.sellingPrice,
      "Current Stock": p.currentStock,
      Status: p.status.toUpperCase(),
    }));

    exportToExcel(dataToExport, "stringventory_products", "Products");
  };

  const handleExportPDF = async () => {
    if (filteredProducts.length === 0) return;

    const tableData = {
      headers: ["Product", "SKU", "Category", "Price", "Stock", "Status"],
      rows: filteredProducts.map((p) => [
        p.name,
        p.sku || "—",
        p.category,
        p.sellingPrice.toFixed(2),
        p.currentStock,
        p.status.toUpperCase(),
      ]),
    };

    try {
      await exportToPDF({
        title: "Inventory Products Report",
        fileName: "stringventory_products",
        table: tableData,
      });
    } catch (error) {
      showError("Failed to generate PDF");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to view products. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* Header with Title, Export, Add Button */}
      <ProductsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        totalProducts={products.length}
        canManage={canManage}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#4F46E5] mb-3">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none mb-0.5">{totalProducts}</h3>
          <p className="text-sm font-medium text-slate-700 mb-1">Total Catalog</p>
        </div>

        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#00C49F] mb-3">
            <CheckCircle className="w-4 h-4" />
          </div>
          <h3 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none mb-0.5">{activeProducts}</h3>
          <p className="text-sm font-medium text-slate-700 mb-1">Active Products</p>
        </div>

        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#F59E0B] mb-3">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 mb-0.5">
            <h3 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none">{lowStockProducts}</h3>
            {outOfStock > 0 && (
              <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                {outOfStock} out of stock
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">Stock Warnings</p>
        </div>
      </div>

      {/* Products Table / Grid View */}
      <ProductsTable products={filteredProducts} onDelete={handleDelete} canManage={canManage} viewMode={viewMode} />
    </div>
  );
}



