import { Edit2, Trash2, Eye, CupSoda, Cookie, Milk, Bean, Sparkles, Package, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const IconMap = {
  CupSoda: CupSoda,
  Cookie: Cookie,
  Milk: Milk,
  Bean: Bean,
  Sparkles: Sparkles,
};

// Color schemes for category icons
const colorSchemes = [
  { bg: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200", light: "bg-emerald-50" },
  { bg: "from-blue-400 to-cyan-500", shadow: "shadow-blue-200", light: "bg-blue-50" },
  { bg: "from-emerald-400 to-emerald-500", shadow: "shadow-emerald-200", light: "bg-emerald-50" },
  { bg: "from-orange-400 to-amber-500", shadow: "shadow-orange-200", light: "bg-orange-50" },
  { bg: "from-rose-400 to-pink-500", shadow: "shadow-rose-200", light: "bg-rose-50" },
];

const CategoryGrid = ({ categories, onToggleStatus, onDelete, canManage = true }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {categories.map((category, index) => {
        const IconComponent = IconMap[category.icon] || Package;
        const isActive = category.status === 'active';
        const colors = colorSchemes[index % colorSchemes.length];
        
        return (
          <div 
            key={category.id} 
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover-lift group"
          >
            {/* Card Header with Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className={`w-full h-full bg-linear-to-br ${colors.bg} flex items-center justify-center`}>
                  <IconComponent className="text-white" size={48} />
                </div>
              )}
              
              {/* Actions Menu - Positioned over image */}
              <div className="absolute top-3 right-3">
                {canManage ? (
                  <>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === category.id ? null : category.id)}
                      className="p-1.5 text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeMenu === category.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-35 z-10">
                        <Link 
                          to={`/dashboard/categories/${category.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        <Link 
                          to={`/dashboard/categories/${category.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            onDelete && onDelete(category.id);
                            setActiveMenu(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={`/dashboard/categories/${category.id}`}
                    className="p-1.5 text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-lg transition-colors inline-flex"
                    title="View"
                  >
                    <Eye size={18} />
                  </Link>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="px-5 py-4">
              <h3 className="text-base font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-10">
                {category.description}
              </p>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900">{category.productsCount}</span>
                <span className="text-xs text-gray-400">products</span>
              </div>
              
              {canManage ? (
                <button 
                  onClick={() => onToggleStatus && onToggleStatus(category.id)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <span className={`
                    text-xs font-medium px-2 py-0.5 rounded-full transition-colors
                    ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                  `}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <div className={`
                    w-9 h-5 rounded-full relative transition-colors duration-200
                    ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}
                  `}>
                    <div className={`
                      absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200
                      ${isActive ? 'left-4' : 'left-0.5'}
                    `} />
                  </div>
                </button>
              ) : (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;

