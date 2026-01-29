import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Building2, User, Mail, Phone, MapPin, Truck } from "lucide-react";
import axios from "axios";

export default function ViewSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/suppliers.json");
        const found = response.data.find(s => s.id === id);
        if (found) {
           setSupplier(found);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Supplier Not Found</h2>
        <Link to="/dashboard/suppliers" className="text-blue-600 hover:underline mt-2 inline-block">Back to Suppliers</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
       {/* Back Button */}
       <div className="flex justify-between items-center mb-6">
            <button
                onClick={() => navigate("/dashboard/suppliers")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
            >
                <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
                <ArrowLeft size={18} />
                </div>
                <span className="font-medium">Back to Suppliers</span>
            </button>
            
            <Link 
                to={`/dashboard/suppliers/${id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 font-medium"
            >
                <Edit size={18} />
                Edit Supplier
            </Link>
       </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
                {supplier.name.charAt(0)}
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="font-mono text-gray-500">{supplier.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        supplier.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {supplier.status}
                    </span>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Details Card */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Contact Details</h3>
            
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mt-1">
                    <User size={18} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 uppercase font-semibold tracking-wider">Contact Person</label>
                    <p className="text-gray-900 font-medium">{supplier.contactPerson}</p>
                </div>
            </div>
            
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mt-1">
                    <Mail size={18} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 uppercase font-semibold tracking-wider">Email</label>
                    <p className="text-gray-900 font-medium">{supplier.email}</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mt-1">
                    <Phone size={18} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 uppercase font-semibold tracking-wider">Phone</label>
                    <p className="text-gray-900 font-medium">{supplier.phone}</p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mt-1">
                    <MapPin size={18} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 uppercase font-semibold tracking-wider">Address</label>
                    <p className="text-gray-900 font-medium">{supplier.address}</p>
                </div>
            </div>
         </div>

         {/* Stats / Other info */}
         <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                 <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Performance</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Products Supplied</p>
                        <p className="text-2xl font-bold text-gray-900">{supplier.productsCount}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                     </div>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
}
