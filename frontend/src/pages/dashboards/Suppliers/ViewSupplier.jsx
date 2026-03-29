import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Building2, User, Mail, Phone, MapPin, Truck, ShoppingBag, Star } from "lucide-react";
import supplierService from "../../../services/supplierService";

const extractSupplier = (response) => {
  const payload = response?.data || response || {};
  return payload?.supplier || payload?.data?.supplier || payload?.data || payload;
};

export default function ViewSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supplierService.getSupplierById(id);
        const found = extractSupplier(response);
        if (found?.id) {
            setSupplier({
             ...found,
             status:
               found?.status === "active" || found?.isActive === true
                 ? "Active"
                 : found?.status === "inactive" || found?.isActive === false
                   ? "Inactive"
                   : found?.status || "Active",
             products: found?.products || [],
             purchases: found?.purchases || [],
             productsCount: found?.products?.length || found?.productsCount || found?.productCount || 0,
             totalPurchases: found?.purchases?.length || 0,
             lifetimeSpend: (found?.purchases || []).reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0),
             rating: Number(found?.rating || 0),
             
             // Advanced Stats
             ...(() => {
                const receivedPurchases = (found?.purchases || []).filter(p => p.status === 'received' && p.receivedDate);
                const onTimeCount = receivedPurchases.filter(p => new Date(p.receivedDate) <= new Date(p.expectedDeliveryDate)).length;
                const onTimeRate = receivedPurchases.length > 0 ? (onTimeCount / receivedPurchases.length) * 100 : 0;
                
                const totalLeadTimeDays = receivedPurchases.reduce((sum, p) => {
                    const diffTime = Math.abs(new Date(p.receivedDate) - new Date(p.purchaseDate));
                    return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }, 0);
                const avgLeadTime = receivedPurchases.length > 0 ? (totalLeadTimeDays / receivedPurchases.length).toFixed(1) : 0;
                
                const pendingBalance = (found?.purchases || []).filter(p => p.paymentStatus !== 'paid').reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
                
                return { onTimeRate, avgLeadTime, pendingBalance };
             })()
            });
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
             <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
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
                    {supplier.rating > 0 && (
                        <div className="flex items-center gap-0.5 ml-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < supplier.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                            ))}
                        </div>
                    )}
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
                  <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Supplier Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">On-Time Rate</p>
                         <p className={`text-2xl font-bold ${supplier.onTimeRate >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                           {Math.round(supplier.onTimeRate)}%
                         </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Avg Lead Time</p>
                         <p className="text-2xl font-bold text-gray-900">{supplier.avgLeadTime}d</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Lifetime Spend</p>
                         <p className="text-lg font-bold text-gray-900 leading-tight">
                           {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(supplier.lifetimeSpend)}
                         </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl">
                         <p className="text-xs text-amber-700 uppercase font-bold tracking-wider mb-1 text-[10px]">Pending Balance</p>
                         <p className="text-lg font-bold text-amber-700 leading-tight">
                           {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(supplier.pendingBalance)}
                         </p>
                      </div>
                  </div>
             </div>
          </div>
       </div>

       {/* Products List */}
       <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <ShoppingBag className="w-5 h-5 text-emerald-600" />
             Products Supplied
           </h3>
           <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
             {supplier.products.length} Items
           </span>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Product Name</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">SKU</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Price</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px] text-right">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 font-medium">
               {supplier.products.length > 0 ? (
                 supplier.products.map((product) => (
                   <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-gray-900">{product.name}</td>
                     <td className="px-6 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                     <td className="px-6 py-4 text-gray-900">
                       {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(product.sellingPrice)}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                         product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                       }`}>
                         {product.status}
                       </span>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No products registered for this supplier</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>

       {/* Purchases History */}
       <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <Truck className="w-5 h-5 text-blue-600" />
             Recent Purchases
           </h3>
           <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
             {supplier.purchases.length} Records
           </span>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">PO Number</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Date</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">Amount</th>
                 <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-[10px] text-right">Payment</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
               {supplier.purchases.length > 0 ? (
                 supplier.purchases.map((purchase) => (
                   <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-bold text-gray-900">{purchase.purchaseNumber}</td>
                     <td className="px-6 py-4 text-xs font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-gray-900">
                        {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(purchase.totalAmount)}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                         purchase.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {purchase.paymentStatus}
                       </span>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No purchase history found</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
}
