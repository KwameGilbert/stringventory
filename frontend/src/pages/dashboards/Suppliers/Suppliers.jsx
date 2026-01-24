import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, Search, Filter, MoreVertical, Edit, Eye, Trash2, 
  Truck, Phone, Mail, MapPin, Building2 
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API loading delay
        setTimeout(async () => {
          const response = await axios.get("/data/suppliers.json");
          setSuppliers(response.data);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        Swal.fire(
          'Deleted!',
          'Supplier has been deleted.',
          'success'
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-8 h-8 text-emerald-600" />
            Suppliers
          </h1>
          <p className="text-gray-500 mt-1">Manage your product suppliers and partnerships</p>
        </div>
        
        <Link
          to="/dashboard/suppliers/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 font-medium"
        >
          <Plus size={18} />
          Add Supplier
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50">
            <Filter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                        {supplier.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{supplier.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{supplier.id}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    {supplier.status}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{supplier.contactPerson}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="truncate">{supplier.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                    <span className="text-gray-900 font-bold">{supplier.productsCount}</span> Products
                </span>
                
                <div className="flex items-center gap-2">
                    <Link 
                        to={`/dashboard/suppliers/${supplier.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </Link>
                    <Link 
                        to={`/dashboard/suppliers/${supplier.id}/edit`}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit size={18} />
                    </Link>
                    <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No suppliers found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-1">
                Try adjusting your search or filter, or add a new supplier to get started.
            </p>
        </div>
      )}
    </div>
  );
}
