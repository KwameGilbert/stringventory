import { Edit2, Trash2, CupSoda, Cookie, Milk, Bean, Sparkles, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

const IconMap = {
  CupSoda: CupSoda,
  Cookie: Cookie,
  Milk: Milk,
  Bean: Bean,
  Sparkles: Sparkles,
};

const CategoryGrid = ({ categories, onToggleStatus }) => {
  const { themeColors } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {categories.map((category) => {
        const IconComponent = IconMap[category.icon] || Package;
        const isActive = category.status === 'active';
        
        return (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-2">
              <div className={`w-10 h-10 rounded-2xl bg-gray-200 bg-opacity-10 flex items-center justify-center`}>
                 <IconComponent className={themeColors.text} size={28} />
              </div>
              
              <div className="flex gap-2">
                <Link 
                  to={`/dashboard/categories/${category.id}/edit`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={18} />
                </Link>
                 <button 
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 h-10 line-clamp-2 leading-relaxed">{category.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <span className="text-xs font-medium text-gray-400">{category.productsCount} products</span>
              
              <button 
                onClick={() => onToggleStatus && onToggleStatus(category.id)}
                className="flex items-center gap-3 cursor-pointer group/toggle focus:outline-none"
              >
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
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
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
