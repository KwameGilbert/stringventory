import { useState } from "react";
import { Save, Upload, ArrowLeft, Check, X, Image, FolderTree, Sliders, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CategoryForm = ({ initialData = {}, onSubmit, title, subTitle, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
    ...initialData,
  });
  const [imagePreview, setImagePreview] = useState(initialData.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/categories")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
      >
      </button>

      {/* Header Banner */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="p-3.5 rounded-2xl bg-slate-900 shadow-sm shadow-slate-900/20 text-white flex items-center justify-center shrink-0">
          <FolderTree className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">{subTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-100 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-blue-700" />
            <h3 className="font-semibold text-blue-950 text-sm uppercase tracking-wider">General Information</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
                placeholder="e.g., Guitars, Percussion, Accessories"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                placeholder="Briefly describe what products this classification encompasses..."
              />
            </div>
          </div>
        </div>

        {/* Media & Controls Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-100 bg-purple-100 flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-purple-700" />
            <h3 className="font-semibold text-purple-950 text-sm uppercase tracking-wider">Media & Controls</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category Thumbnail <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 shadow-2xs">
                {/* Image Preview */}
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <Image className="w-8 h-8 text-slate-300 absolute" />
                  )}
                </div>
                
                {/* Upload Area */}
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:scale-110 transition-transform shadow-2xs">
                        <Upload className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        <span className="font-semibold text-slate-900">Click to upload</span> or drag and drop
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-1">PNG, JPG, WEBP up to 2MB</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</label>
              <div className="flex gap-3.5">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "active" }))}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border transition-all font-semibold text-sm shadow-2xs cursor-pointer ${
                    formData.status === "active"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Check size={18} />
                  <span>Active</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: "inactive" }))}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border transition-all font-semibold text-sm shadow-2xs cursor-pointer ${
                    formData.status === "inactive"
                      ? "border-slate-300 bg-slate-100 text-slate-700 shadow-xs"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <X size={18} />
                  <span>Inactive</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3.5 pt-4">
          <Link
            to="/dashboard/categories"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all text-xs shadow-2xs active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold transition-all flex items-center gap-2 text-xs shadow-sm shadow-slate-900/20 active:scale-95 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSubmitting ? "Saving..." : "Save Category"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
