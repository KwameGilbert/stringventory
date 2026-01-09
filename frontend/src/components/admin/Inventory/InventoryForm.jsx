import { useState, useEffect, useMemo } from "react";
import { Save, ArrowLeft, Package, Truck, DollarSign, Calendar, Hash, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const InventoryForm = ({ initialData = {}, onSubmit, title, subTitle }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    batchNumber: "",
    supplier: "",
    unitCost: "",
    quantity: "",
    entryDate: today,
    expiryDate: "",
    ...initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/products.json");
        setProducts(response.data);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: product.id,
        productName: product.name,
        category: product.category,
      }));
    }
  };

  const totalValue = useMemo(() => {
    const cost = parseFloat(formData.unitCost) || 0;
    const qty = parseInt(formData.quantity) || 0;
    return cost * qty;
  }, [formData.unitCost, formData.quantity]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const generateBatchNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BN-${year}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      totalValue: totalValue,
      batchNumber: formData.batchNumber || generateBatchNumber(),
    };
    onSubmit(submissionData);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6 w-48"></div>
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/inventory")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Inventory</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm">{subTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Product Selection</h3>
                <p className="text-xs text-gray-500">Choose the product for this stock entry</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Product Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Product <span className="text-rose-500">*</span>
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleProductChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm bg-white"
                required
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Display */}
            {formData.category && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-sm text-blue-600">Category:</span>
                <span className="text-sm font-medium text-blue-700">{formData.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Supplier & Batch Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-violet-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Supply Details</h3>
                <p className="text-xs text-gray-500">Supplier and batch information</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Supplier */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Supplier / Manufacturer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-sm"
                placeholder="e.g., Coca-Cola Ghana Ltd"
                required
              />
            </div>

            {/* Batch Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                Batch Number
                <span className="text-xs text-gray-400 font-normal">(auto-generated if empty)</span>
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-sm font-mono"
                placeholder="e.g., BN-2024-001"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Quantity Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pricing & Quantity</h3>
                <p className="text-xs text-gray-500">Cost and quantity details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Unit Cost */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unit Cost Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Quantity Received <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-sm"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Total Value Display */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Stock Value</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(totalValue)}</p>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
              <p className="text-emerald-100 text-xs mt-2">
                {formData.quantity || 0} units × {formatCurrency(parseFloat(formData.unitCost) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Dates Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Date Information</h3>
                <p className="text-xs text-gray-500">Entry and expiry dates</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Entry Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Entry Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="entryDate"
                    value={formData.entryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    Auto
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Expiry Date
                  <span className="text-xs text-gray-400 font-normal">(if applicable)</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-sm"
                />
              </div>
            </div>

            {formData.expiryDate && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  This batch will expire on {new Date(formData.expiryDate).toLocaleDateString("en-US", { 
                    year: "numeric", month: "long", day: "numeric" 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/dashboard/inventory"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-900/20"
          >
            <Save size={18} />
            Save Stock Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;
