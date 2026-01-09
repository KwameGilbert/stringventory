import { useState } from "react";
import { Save, Upload, ArrowLeft, Check, X, Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CategoryForm = ({ initialData = {}, onSubmit, title, subTitle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/categories")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Categories</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm">{subTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm"
                placeholder="e.g., Beverages"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all resize-none text-sm"
                placeholder="Briefly describe what products this category contains..."
              />
            </div>

            {/* Category Image */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category Image <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                {/* Upload Area */}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Click to upload</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "active" }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm ${
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
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm ${
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/dashboard/categories"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all flex items-center gap-2 text-sm"
          >
            <Save size={16} />
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;


