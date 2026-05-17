import { useState } from "react";
import { Building2, Mail, Phone, MapPin, Eye, Edit, Trash2, Truck, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const SuppliersTable = ({ suppliers, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(suppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = suppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Truck className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No suppliers match your criteria</h3>
        <p className="text-slate-500 text-sm font-medium mb-6">Try adjusting your filters or search term</p>
        <Link
          to="/dashboard/suppliers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-sm shadow-slate-900/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Add Supplier</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] whitespace-nowrap text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 max-w-[180px]">Supplier</th>
              <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 max-w-[180px]">Contact Person</th>
              <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Details</th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {paginatedSuppliers.map((supplier) => {
              const isActive = supplier.status === "Active";

              return (
                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Supplier Info */}
                  <td className="px-4 py-4 w-48 max-w-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-md shadow-emerald-500/20 shrink-0">
                        {supplier.name ? supplier.name.charAt(0) : "S"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/dashboard/suppliers/${supplier.id}`}
                          className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors text-base block truncate max-w-full"
                          title={supplier.name}
                        >
                          {supplier.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">ID: #{supplier.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td className="px-6 py-4 w-48 max-w-[200px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 size={16} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate" title={supplier.contactPerson || ""}>
                        {supplier.contactPerson || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Contact Details (Email / Phone) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs font-mono">{supplier.email || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span className="font-mono">{supplier.phone || "—"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Products Supplied Count */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/60 shadow-2xs">
                      {supplier.productsCount || 0}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-lg shadow-2xs border inline-block ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/dashboard/suppliers/${supplier.id}`}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/dashboard/suppliers/${supplier.id}/edit`}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
                        title="Edit Supplier"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete && onDelete(supplier.id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Supplier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{" "}
          <span className="font-semibold text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)}</span> of{" "}
          <span className="font-semibold text-slate-900">{suppliers.length}</span> suppliers
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-700 cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-700 cursor-pointer"
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

export default SuppliersTable;
