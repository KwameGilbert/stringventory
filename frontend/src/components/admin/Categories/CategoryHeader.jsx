import { Plus, Download, FileText, LayoutGrid, List } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryHeader = ({ view, setView, totalCategories }) => {
  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{totalCategories} categories</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Buttons */}
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200">
            <FileText size={15} className="text-emerald-600" />
            Excel
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200">
            <Download size={15} className="text-rose-600" />
            PDF
          </button>

          {/* View Switcher */}
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-all ${
                view === 'grid' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${
                view === 'list' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add Category Button */}
          <Link
            to="/dashboard/categories/new"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            Add Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;


