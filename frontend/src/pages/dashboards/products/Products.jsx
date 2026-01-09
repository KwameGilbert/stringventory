import { useState, useEffect } from "react";
import axios from "axios";
import { Package, CheckCircle, AlertTriangle } from "lucide-react";
import ProductsHeader from "../../../components/admin/Products/ProductsHeader";
import ProductsTable from "../../../components/admin/Products/ProductsTable";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, uomsRes] = await Promise.all([
          axios.get("/data/products.json"),
          axios.get("/data/categories.json"),
          axios.get("/data/unit-of-measurements.json")
        ]);
        
        const fetchedProducts = productsRes.data;
        const fetchedCategories = categoriesRes.data;
        const fetchedUoms = uomsRes.data;

        const mappedProducts = fetchedProducts.map(product => ({
          ...product,
          category: fetchedCategories.find(c => c.id === product.categoryId)?.name || "Unknown",
          unitOfMeasure: fetchedUoms.find(u => u.id === product.unitOfMeasurementId)?.abbreviation || "N/A"
        }));

        setProducts(mappedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading data", error);
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
      product.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    const result = await confirmDelete("this product");
    if (result.isConfirmed) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Product deleted successfully");
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



