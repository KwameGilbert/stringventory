import { useState, useEffect } from "react";
import { Save, Upload, Package, X, Check, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import categoryService from "../../../services/business/categoryService";
import supplierService from "../../../services/business/supplierService";
import { productService } from "../../../services/business/productService";
import { apiClient, API_ENDPOINTS } from "../../../services/api/client";
import { showError } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

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
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  const { symbol } = useCurrency();
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
    costPrice: 0,
    sellingPrice: 0,
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

      // Fetch unit of measurements from API
      try {
        const uomRes = await apiClient.get(API_ENDPOINTS.UNIT_OF_MEASUREMENTS.LIST);
        const fetchedUoms = extractList(uomRes, "unitOfMeasurements");
        setUomList(fetchedUoms);
      } catch (err) {
        console.error("Error loading unit of measurements", err);
        setUomList([]);
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
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      image: formData.image || undefined,
    };
    onSubmit(productData);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all group"
      >
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="font-semibold text-sm">Back to Products Catalog</span>
      </button>

      {/* Header Banner */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="p-3.5 rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20 text-white flex items-center justify-center shrink-0">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">{subTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-100 flex items-center justify-between">
            <h3 className="font-semibold text-blue-950 text-sm uppercase tracking-wider">Basic Information</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-semibold text-slate-900 shadow-2xs"
                placeholder="e.g., Ultra-Durable Steel Cable 10m"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all bg-white font-medium text-slate-900 shadow-2xs cursor-pointer appearance-none truncate"
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
                  <p className="text-xs text-slate-400 font-medium mt-1">Loading categories...</p>
                ) : categoriesError ? (
                  <p className="text-xs text-rose-500 font-semibold mt-1">
                    Could not load categories. Please refresh and try again.
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-amber-600 font-semibold mt-1">
                    No active categories found. Create a category first.
                  </p>
                ) : null}
              </div>

              {/* Supplier */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Supplier <span className="text-rose-500">*</span>
                </label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all bg-white font-medium text-slate-900 shadow-2xs cursor-pointer appearance-none truncate"
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
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all resize-none font-medium text-slate-900 shadow-2xs"
                placeholder="Briefly describe this product, specifications, or special storage notes..."
              />
            </div>

            {/* Unit of Measure */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Unit of Measure <span className="text-rose-500">*</span>
              </label>
              <select
                name="unitOfMeasurementId"
                value={formData.unitOfMeasurementId || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all bg-white font-medium text-slate-900 shadow-2xs cursor-pointer appearance-none truncate"
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

        {/* Pricing Information Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-100 flex items-center justify-between">
            <h3 className="font-semibold text-emerald-950 text-sm uppercase tracking-wider">Pricing Information</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost Price */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Cost Price <span className="text-slate-400 font-mono">({symbol})</span>
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-semibold text-slate-900 font-mono shadow-2xs"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Selling Price <span className="text-slate-400 font-mono">({symbol})</span>
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-semibold text-slate-900 font-mono shadow-2xs"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Image Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-100 bg-purple-100 flex items-center justify-between">
            <h3 className="font-semibold text-purple-950 text-sm uppercase tracking-wider">Product Image</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {imagePreview && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</p>
                <div className="flex items-center justify-center p-2 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-2xs">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="max-w-xs h-48 rounded-xl border border-slate-200 object-cover shadow-sm"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                <div className="flex flex-col items-center justify-center py-5 text-center">
                  <div className="p-3 bg-white rounded-xl shadow-xs mb-3 group-hover:scale-110 transition-transform border border-slate-200/80">
                    <Upload className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">
                    <span className="font-semibold text-slate-900">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    PNG, JPG, WEBP up to 2MB
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
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-100 flex items-center justify-between">
            <h3 className="font-semibold text-amber-950 text-sm uppercase tracking-wider">Product Controls</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Catalog Status
              </label>
              <div className="flex gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "active" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border transition-all font-semibold text-sm shadow-2xs ${
                    formData.status === "active"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Check size={18} className={formData.status === "active" ? "text-emerald-600" : ""} />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "inactive" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border transition-all font-semibold text-sm shadow-2xs ${
                    formData.status === "inactive"
                      ? "border-slate-400 bg-slate-100 text-slate-800 shadow-xs"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <X size={18} className={formData.status === "inactive" ? "text-slate-600" : ""} />
                  Inactive
                </button>
              </div>
            </div>

            {/* Reorder Level */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Reorder Level <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-semibold text-slate-900 shadow-2xs"
                required
              />
              <p className="text-xs text-slate-400 font-medium mt-1.5">
                You'll be alerted when stock falls below this level threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3.5 pt-4">
          <Link
            to="/dashboard/products"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
