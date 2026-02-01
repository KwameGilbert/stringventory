import { useState } from "react";
import { Eye, Edit2, MessageSquare, ChevronLeft, ChevronRight, Users, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import SendMessageModal from "./SendMessageModal";

const ITEMS_PER_PAGE = 8;

const CustomersTable = ({ customers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [messageModal, setMessageModal] = useState({ isOpen: false, customer: null });

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = customers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(value);
  };

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
        <Link
          to="/dashboard/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add Customer
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Customer */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(customer.name)} flex items-center justify-center text-white text-sm font-bold`}>
                      {getInitials(customer.name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        customer.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail size={12} className="text-gray-400" />
                      {customer.email}
                    </div>
                  </div>
                </td>

                {/* Address */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{customer.address}</span>
                  </div>
                </td>

                {/* Orders */}
                <td className="px-4 py-4 text-center">
                  <span className="text-sm font-semibold text-gray-900">{customer.totalOrders}</span>
                </td>

                {/* Total Spent */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(customer.totalSpent)}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/dashboard/customers/${customer.id}`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/dashboard/customers/${customer.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => setMessageModal({ isOpen: true, customer })}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Send Message"
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
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, customers.length)}</span> of{" "}
          <span className="font-medium text-gray-700">{customers.length}</span> customers
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600" />
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
