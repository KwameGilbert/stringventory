import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, AlertTriangle } from "lucide-react";
import ProductsHeader from "../../../components/admin/Products/ProductsHeader";
import ProductsTable from "../../../components/admin/Products/ProductsTable";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";

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

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

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
          currentStock: Number(product.currentStock ?? product.quantity ?? 0),
          reorderThreshold: Number(product.reorderThreshold ?? product.reorderLevel ?? 0),
          category:
            product.category ||
            product.categoryName ||
            fetchedCategories.find((c) => String(c.id) === String(product.categoryId))?.name ||
            "Unknown",
          supplier:
            product.supplier ||
            product.supplierName ||
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
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
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
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                {outOfStock > 0 && (
                  <span className="text-xs text-rose-600 font-medium">+{outOfStock} out of stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable products={filteredProducts} onDelete={handleDelete} />
    </div>
  );
}



