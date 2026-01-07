import { useState } from "react";
import { Save, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const CategoryForm = ({ initialData = {}, onSubmit, title, subTitle }) => {
  const { themeColors } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    icon: "Package",
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">{subTitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${themeColors.focusRing}`}
                  placeholder="e.g., Beverages"
                  required
                />
              </div>

               <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${themeColors.focusRing} bg-white`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${themeColors.focusRing} resize-none`}
                  placeholder="Enter category description..."
                />
              </div>
            </div>
          </div>

          {/* Icon/Image Upload (Mock) */}
           <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Appearance</h3>
            
            <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category Icon</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-gray-900">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                            </div>
                            <input type="file" className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
             <Link
              to="/dashboard/categories"
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className={`px-8 py-2.5 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2 ${themeColors.buttonGradient} ${themeColors.buttonHover}`}
            >
              <Save size={18} />
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
