import { useState, useEffect } from "react";
import { Save, Upload, Package, X, Check, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductForm = ({ initialData = {}, onSubmit, title, subTitle, isEdit = false }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [uoms, setUoms] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    supplierId: "",
    unitOfMeasurementId: "",
    status: "active",
    reorderThreshold: 10,
    ...initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, supRes, uomRes] = await Promise.all([
          axios.get("/data/categories.json"),
          axios.get("/data/suppliers.json"),
          axios.get("/data/unit-of-measurements.json")
        ]);
        
        setCategories(catRes.data.filter(cat => cat.status === "active"));
        setSuppliers(supRes.data.filter(sup => sup.isActive));
        setUoms(uomRes.data.filter(uom => uom.isActive));
      } catch (error) {
        console.error("Error loading form data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      code: formData.code || `PRD-${Date.now().toString().slice(-6)}`,
    };
    // Clean up derived fields if any, ensure IDs are used
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
            {/* Product Code */}
            {isEdit && formData.code && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Product Code</label>
                <div className="px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 font-mono text-sm">
                  {formData.code}
                </div>
                <p className="text-xs text-gray-400">Auto-generated, cannot be changed</p>
              </div>
            )}

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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
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
                value={formData.unitOfMeasurementId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                required
              >
                <option value="">Select Unit</option>
                {uoms.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name} ({unit.abbreviation})</option>
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
          
          <div className="p-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="p-2.5 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform border border-gray-100">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
                <input type="file" className="hidden" accept="image/*" />
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
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "active" }))}
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
                  onClick={() => setFormData(prev => ({ ...prev, status: "inactive" }))}
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

            {/* Reorder Threshold */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Reorder Threshold <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="reorderThreshold"
                value={formData.reorderThreshold}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
              <p className="text-xs text-gray-400">You'll be alerted when stock falls below this level</p>
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
