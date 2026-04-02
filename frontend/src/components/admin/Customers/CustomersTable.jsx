import { useState } from "react";
import { Eye, Edit2, MessageSquare, ChevronLeft, ChevronRight, Users, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";
import SendMessageModal from "./SendMessageModal";

const ITEMS_PER_PAGE = 8;

const CustomersTable = ({ customers, canManage = true }) => {
  const { formatPrice } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [messageModal, setMessageModal] = useState({ isOpen: false, customer: null });

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (val, currency = "GHS") => formatPrice(val, currency);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "from-blue-400 to-cyan-500",
      "from-emerald-400 to-pink-500",
      "from-emerald-400 to-teal-500",
      "from-orange-400 to-red-500",
      "from-indigo-400 to-emerald-500",
      "from-rose-400 to-pink-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No customers found</h3>
        <p className="text-gray-500 text-sm mb-4">Add your first customer to get started</p>
        {canManage && (
          <Link
            to="/dashboard/customers/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add Customer
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engagement</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">LTV</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                {/* Customer Profile */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${getAvatarColor(customer.name)} flex items-center justify-center text-white text-base font-semibold shadow-lg shadow-current/10 group-hover:scale-105 transition-transform`}>
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 tracking-tight leading-none mb-1.5">{customer.name}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                        customer.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {customer.status || 'active'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Phone size={14} className="text-gray-400" />
                      {customer.phone || '—'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <Mail size={14} className="text-gray-400" />
                      {customer.email || '—'}
                    </div>
                  </div>
                </td>

                {/* Address */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 max-w-[200px]">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{customer.address || 'No address saved'}</span>
                  </div>
                </td>

                {/* Engagement */}
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-semibold text-gray-900 tracking-tighter leading-none">{customer.totalOrders}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Orders</span>
                  </div>
                </td>

                {/* LTV (Lifetime Value) */}
                <td className="px-6 py-4 text-right">
                  <span className="text-base font-semibold text-emerald-600 tracking-tighter">
                    {formatCurrency(customer.totalSpent, customer.currency)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/dashboard/customers/${customer.id}`}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-xs"
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </Link>
                    {canManage && (
                      <Link
                        to={`/dashboard/customers/${customer.id}/edit`}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-xs"
                        title="Edit Details"
                      >
                        <Edit2 size={16} />
                      </Link>
                    )}
                    <button 
                      onClick={() => setMessageModal({ isOpen: true, customer })}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-xs"
                      title="Message Customer"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {paginatedCustomers.map((customer) => (
          <div key={customer.id} className="p-5 space-y-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${getAvatarColor(customer.name)} flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-current/10`}>
                  {getInitials(customer.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg leading-none mb-2">{customer.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    customer.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-gray-50 text-gray-500 border-gray-100'
                  }`}>
                    {customer.status || 'active'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lifetime Value</span>
                  <span className="text-xl font-semibold text-emerald-600 tracking-tighter">
                    {formatCurrency(customer.totalSpent, customer.currency)}
                  </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 outline-none">Total Orders</p>
                    <p className="text-sm font-semibold text-gray-900">{customer.totalOrders} Trans.</p>
                </div>
                <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{customer.phone || customer.email || '—'}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
                <Link
                  to={`/dashboard/customers/${customer.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 shadow-sm active:scale-95 transition-all"
                >
                  <Eye size={18} />
                  Profile
                </Link>
                <button 
                  onClick={() => setMessageModal({ isOpen: true, customer })}
                  className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <MessageSquare size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Immersive Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Displaying <span className="text-gray-900">{startIndex + 1}</span> -{" "}
          <span className="text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, customers.length)}</span> of{" "}
          <span className="text-gray-900">{customers.length}</span> Profiles
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-gray-900/10">
              {currentPage} / {totalPages}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
            >
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <SendMessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, customer: null })}
        customer={messageModal.customer}
      />
    </div>
  );
};

export default CustomersTable;
