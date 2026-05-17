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
  { bg: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200", light: "bg-emerald-50" },
  { bg: "from-blue-500 to-indigo-600", shadow: "shadow-blue-200", light: "bg-blue-50" },
  { bg: "from-purple-500 to-indigo-600", shadow: "shadow-purple-200", light: "bg-purple-50" },
  { bg: "from-amber-500 to-orange-600", shadow: "shadow-orange-200", light: "bg-orange-50" },
  { bg: "from-rose-500 to-pink-600", shadow: "shadow-rose-200", light: "bg-rose-50" },
];

const CategoryGrid = ({ categories, onToggleStatus, onDelete, canManage = true }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No categories match your search</h3>
        <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => {
        const IconComponent = IconMap[category.icon] || Package;
        const isActive = category.status === 'active';
        const colors = colorSchemes[index % colorSchemes.length];
        
        return (
          <div 
            key={category.id} 
            className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group ${activeMenu === category.id ? 'relative z-50' : 'relative'}`}
          >
            <div>
              {/* Card Header with Full Width Image */}
              <div className="relative h-32 bg-slate-100 overflow-hidden">
                <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} flex items-center justify-center`}>
                  <IconComponent className="text-white drop-shadow-sm opacity-90" size={54} />
                </div>
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                
                {/* Actions Menu - Positioned over image */}
                <div className="absolute top-3 right-3 z-20">
                  {canManage ? (
                    <>
                      <button 
                        onClick={() => setActiveMenu(activeMenu === category.id ? null : category.id)}
                        className={`p-2 backdrop-blur-md rounded-xl transition-all shadow-sm ${activeMenu === category.id ? 'bg-white text-slate-900 shadow-md' : 'text-white bg-black/30 hover:bg-black/50 border border-white/20'}`}
                        title="Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {activeMenu === category.id && (
                        <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 min-w-44 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                          <Link 
                            to={`/dashboard/categories/${category.id}`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <Eye size={15} className="text-slate-400" />
                            <span>View Details</span>
                          </Link>
                          <Link 
                            to={`/dashboard/categories/${category.id}/edit`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <Edit2 size={15} className="text-slate-400" />
                            <span>Edit Category</span>
                          </Link>
                          <div className="my-1 border-t border-slate-100"></div>
                          <button
                            onClick={() => {
                              onDelete && onDelete(category.id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors w-full text-left cursor-pointer"
                          >
                            <Trash2 size={15} />
                            <span>Delete Category</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={`/dashboard/categories/${category.id}`}
                      className="p-2 text-white bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20 rounded-xl transition-all shadow-sm inline-flex"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-1.5 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem] font-medium">
                  {category.description || "No description provided for this category."}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900">{category.productsCount}</span>
                <span className="text-xs font-medium text-slate-500">products</span>
              </div>
              
              {canManage ? (
                <button 
                  onClick={() => onToggleStatus && onToggleStatus(category.id)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none group/toggle"
                  title="Click to toggle status"
                >
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shadow-2xs border ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </button>
              ) : (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs border ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
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
