import { useState } from "react";
import { Edit2, Trash2, Eye, Image, ChevronLeft, ChevronRight, FolderOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryList = ({ categories, onToggleStatus, onDelete, canManage = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <FolderOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No categories match your search</h3>
        <p className="text-slate-500 text-sm font-medium mb-6">Create a new category or adjust your search term</p>
        {canManage && (
          <Link
            to="/dashboard/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 shadow-sm shadow-slate-900/20 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] whitespace-nowrap text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedCategories.map((category) => {
              const isActive = category.status === 'active';
              
              return (
                <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      {/* Category Image */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
                        <Image className="w-5 h-5 text-slate-400 absolute" />
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover relative z-10"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <Link 
                          to={`/dashboard/categories/${category.id}`}
                          className="font-medium text-slate-900 hover:text-blue-600 transition-colors text-base"
                        >
                          {category.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">ID: #{category.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium line-clamp-1 max-w-xs sm:max-w-md truncate block">
                      {category.description || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/60 shadow-2xs">
                      {category.productsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {canManage ? (
                      <button
                        onClick={() => onToggleStatus && onToggleStatus(category.id)}
                        className={`text-xs font-medium px-3 py-1 rounded-lg transition-all shadow-2xs border cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                    ) : (
                      <span className={`text-xs font-medium px-3 py-1 rounded-lg shadow-2xs border ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/dashboard/categories/${category.id}`}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                      {canManage && (
                        <>
                          <Link
                            to={`/dashboard/categories/${category.id}/edit`}
                            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                            title="Edit Category"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => onDelete && onDelete(category.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900 font-semibold">{categories.length === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="text-slate-900 font-semibold">{Math.min(startIndex + itemsPerPage, categories.length)}</span> of{" "}
            <span className="text-slate-900 font-semibold">{categories.length}</span> categories
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/30 shadow-2xs"
            >
              {[5, 10, 20, 50].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-700"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                  currentPage === page
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-700"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
