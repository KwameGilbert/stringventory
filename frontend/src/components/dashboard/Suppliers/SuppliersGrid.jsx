import { Building2, Mail, Phone, MapPin, Eye, Edit, Trash2, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const SuppliersGrid = ({ suppliers, onDelete }) => {

  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Truck className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No suppliers match your criteria</h3>
        <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {suppliers.map((supplier) => {
        const isActive = supplier.status === "Active";

        return (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group relative"
          >
            {/* Top Bar with Avatar & Actions */}
            <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-xl shadow-md shadow-emerald-500/20 shrink-0">
                  {supplier.name ? supplier.name.charAt(0) : "S"}
                </div>
                <div>
                  <Link
                    to={`/dashboard/suppliers/${supplier.id}`}
                    className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors text-base line-clamp-1"
                  >
                    {supplier.name}
                  </Link>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">#{supplier.id}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {supplier.status}
                </span>
              </div>
            </div>

            {/* Contact Details Content */}
            <div className="p-6 space-y-3.5 my-auto">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <Building2 size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{supplier.contactPerson || "No Contact Person"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{supplier.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{supplier.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                <span className="truncate">{supplier.address || "—"}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900">{supplier.productsCount || 0}</span>
                <span className="text-xs font-medium text-slate-500">products supplied</span>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  to={`/dashboard/suppliers/${supplier.id}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="View Details"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  to={`/dashboard/suppliers/${supplier.id}/edit`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  title="Edit Supplier"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => onDelete && onDelete(supplier.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Delete Supplier"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuppliersGrid;
