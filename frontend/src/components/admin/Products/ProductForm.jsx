import { useState, useEffect } from "react";
import { Save, Upload, Package, X, Check, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { productService } from "../../../services/productService";
import { apiClient, API_ENDPOINTS } from "../../../services/api.client";
import { showError } from "../../../utils/alerts";

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

const ProductForm = ({
  initialData = {},
  onSubmit,
  title,
  subTitle,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [uomList, setUomList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    supplierId: "",
    unitOfMeasurementId: "",
    status: "active",
    reorderLevel: 10,
    image: "",
    ...initialData,
  });
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  useEffect(() => {
    const fetchData = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");

      const [catRes, supRes] = await Promise.allSettled([
        categoryService.getCategories(),
        supplierService.getSuppliers(),
      ]);

      const isActiveStatus = (status) => {
        if (status === undefined || status === null || status === "") return true;
        return String(status).toLowerCase() === "active";
      };

      if (catRes.status === "fulfilled") {
        const fetchedCategories = extractList(catRes.value, "categories").filter(
          (cat) => (cat?.isActive !== false) && isActiveStatus(cat?.status),
        );
        setCategories(fetchedCategories);
        setCategoriesLoading(false);
      } else {
        console.error("Error loading categories", catRes.reason);
        const message = catRes.reason?.message || "Failed to load categories";
        setCategoriesError(message);
        setCategories([]);
        setCategoriesLoading(false);
        showError(message);
      }

      if (supRes.status === "fulfilled") {
        const fetchedSuppliers = extractList(supRes.value, "suppliers").filter(
          (sup) => sup?.isActive !== false && isActiveStatus(sup?.status),
        );
        setSuppliers(fetchedSuppliers);
      } else {
        console.error("Error loading suppliers", supRes.reason);
      }

      // Fetch unit of measurements from API, fallback to local JSON
      try {
        const uomRes = await apiClient.get(API_ENDPOINTS.UNIT_OF_MEASUREMENTS.LIST);
        const fetchedUoms = extractList(uomRes, "unitOfMeasurements");
        if (fetchedUoms.length > 0) {
          setUomList(fetchedUoms);
        } else {
          throw new Error("Empty UOM response");
        }
      } catch {
        try {
          const localRes = await fetch("/data/unit-of-measurements.json");
          const localData = await localRes.json();
          setUomList(localData);
        } catch (err) {
          console.error("Error loading unit of measurements", err);
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      productCode: formData.productCode || `PRD-${Date.now().toString().slice(-6)}`,
      categoryId: formData.categoryId,
      supplierId: formData.supplierId || undefined,
      unitOfMeasurementId: formData.unitOfMeasurementId,
      status: formData.status,
      reorderLevel: parseInt(formData.reorderLevel) || 10,
      image: formData.image || undefined,
    };
    onSubmit(productData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Products</span>
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-200">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            <p className="text-sm text-gray-500">Enter the product details</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="e.g., Coca-Cola Classic"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  required
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.name || cat.title}
                    </option>
                  ))}
                </select>
                {categoriesLoading ? (
                  <p className="text-xs text-gray-400">Loading categories...</p>
                ) : categoriesError ? (
                  <p className="text-xs text-rose-500">
                    Could not load categories. Please refresh and try again.
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-amber-600">
                    No active categories found. Create a category first.
                  </p>
                ) : null}
              </div>

              {/* Supplier */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Supplier <span className="text-rose-500">*</span>
                </label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  required
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id || sup._id} value={sup.id || sup._id}>
                      {sup.name || sup.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Briefly describe this product..."
              />
            </div>

            {/* Unit of Measure */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Unit of Measure <span className="text-rose-500">*</span>
              </label>
              <select
                name="unitOfMeasurementId"
                value={formData.unitOfMeasurementId || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                required
              >
                <option value="">Select Unit</option>
                {uomList.map((uom) => (
                  <option key={uom.id} value={uom.id}>
                    {uom.name} ({uom.abbreviation})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Image Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Product Image</h3>
            <p className="text-sm text-gray-500">Upload an image (optional)</p>
          </div>

          <div className="p-6 space-y-4">
            {imagePreview && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Preview</p>
                <div className="flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="max-w-xs h-auto rounded-lg border border-gray-200 object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="p-2.5 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform border border-gray-100">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Stock Controls Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Product Controls</h3>
            <p className="text-sm text-gray-500">Configure stock settings</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                    formData.status === "active"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Check size={16} />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "inactive" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                    formData.status === "inactive"
                      ? "border-gray-500 bg-gray-100 text-gray-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <X size={16} />
                  Inactive
                </button>
              </div>
            </div>

            {/* Reorder Level */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Reorder Level <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
              <p className="text-xs text-gray-400">
                You'll be alerted when stock falls below this level
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard/products"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <Save size={18} />
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
