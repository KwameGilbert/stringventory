import { Plus, Download, FileText, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const CategoryHeader = ({ view, setView }) => {
  const { themeColors } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-1">Manage product categories</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button className={`flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200`}>
            <FileText size={16} />
            Excel
          </button>
          <button className={`flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-200`}>
            <Download size={16} />
            PDF
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
             title="List View"
          >
            <List size={18} />
          </button>
        </div>

        {/* Add Category Button */}
        <Link
          to="/dashboard/categories/new"
          className={`${themeColors.bgPrimary} ${themeColors.buttonHover} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium`}
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>
    </div>
  );
};

export default CategoryHeader;
