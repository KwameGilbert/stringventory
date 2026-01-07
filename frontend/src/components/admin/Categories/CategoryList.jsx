import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const CategoryList = ({ categories, onToggleStatus }) => {
  const { themeColors } = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((category) => {
              const isActive = category.status === 'active';
              return (
              <tr key={category.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-bold text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 max-w-xs truncate">
                  {category.description}
                </td>
                <td className="px-6 py-5 text-center text-sm text-gray-500 font-medium">
                  {category.productsCount}
                </td>
                <td className="px-6 py-5 text-center">
                   <div className="flex justify-center items-center">
                     <button
                        onClick={() => onToggleStatus && onToggleStatus(category.id)}
                        className="flex items-center gap-3 cursor-pointer focus:outline-none"
                     >
                       <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                         <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                           isActive ? 'bg-slate-800' : 'bg-gray-200'
                         }`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                             isActive ? 'left-6' : 'left-1'
                           }`} />
                         </div>
                     </button>
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/dashboard/categories/${category.id}/edit`}
                      className={`p-2 rounded-lg hover:bg-gray-100 ${themeColors.textColor} transition-colors`}
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
