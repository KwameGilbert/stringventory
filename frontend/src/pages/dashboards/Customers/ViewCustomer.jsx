import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit2, Trash2, User, Phone, Mail, MapPin, Building2, 
  Calendar, ShoppingBag, DollarSign, Clock, TrendingUp
} from "lucide-react";
import customerService from "../../../services/customerService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

const extractCustomer = (response) => {
  const payload = response?.data || response || {};
  return payload?.customer || payload?.data?.customer || payload?.data || payload;
};

const extractOrders = (customerData) => {
  if (Array.isArray(customerData?.orders)) return customerData.orders;
  if (Array.isArray(customerData?.data?.orders)) return customerData.data.orders;
  return [];
};

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [responseCurrency, setResponseCurrency] = useState("GHS");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await customerService.getCustomerById(id);
        const currency = customerRes?.currency || customerRes?.data?.currency || "GHS";
        setResponseCurrency(currency);
        const found = extractCustomer(customerRes);
        if (found) {
          setCustomer({
            ...found,
            name: found.name || `${found.firstName || ""} ${found.lastName || ""}`.trim(),
            status: found.status || "active",
            totalOrders: Number(found.totalOrders ?? 0),
            totalSpent: Number(found?.totalSpent ?? found?.totalAmountSpent ?? 0),
          });
          setOrders(extractOrders(found));
        }
      } catch (error) {
        console.error("Error fetching customer", error);
        showError(error?.message || "Failed to fetch customer details");
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const result = await confirmDelete("this customer");
    if (!result.isConfirmed) return;

    try {
      await customerService.deleteCustomer(id);
      showSuccess("Customer deleted successfully");
      navigate("/dashboard/customers");
    } catch (error) {
      console.error("Failed to delete customer", error);
      showError(error?.message || "Failed to delete customer");
    }
  };

  // Replaced local formatCurrency with useCurrency's formatPrice logic

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-xl p-8 border border-gray-100 animate-pulse">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/customers")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group px-1"
      >
        <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-bold text-xs uppercase tracking-widest">Back to Directory</span>
      </button>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-bl-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
                <div className={`w-24 h-24 rounded-3xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-3xl font-semibold shadow-2xl shadow-blue-500/20`}>
                    {getInitials(customer.name)}
                </div>
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{customer.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            customer.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-500'
                        } border border-current/10`}>
                            {customer.status || 'active'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-bold tracking-tight uppercase">
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {customer.city || 'Primary Region'}</span>
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /> Member since {new Date(customer.createdAt).getFullYear()}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Link
                    to={`/dashboard/customers/${id}/edit`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-gray-900/10 active:scale-95"
                >
                    <Edit2 size={16} />
                    Update Profile
                </Link>
                <button
                    onClick={handleDelete}
                    className="p-3 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-95 shadow-sm shadow-rose-500/5"
                    title="Terminate Profile"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Content Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Intelligence Context */}
        <div className="lg:col-span-2 space-y-6">
            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Conversion</p>
                            <p className="text-2xl font-semibold text-gray-900 tracking-tight leading-none">{customer.totalOrders} <span className="text-xs font-bold text-gray-400">Orders</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                            <p className="text-2xl font-semibold text-emerald-600 tracking-tight leading-none">{formatPrice(customer.totalSpent, responseCurrency)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order History Detail */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Global Order History</h3>
                    <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {orders.length} Cumulative
                    </div>
                </div>
                
                {orders.length > 0 ? (
                    <div className="divide-y divide-gray-50/50">
                        {orders.slice(0, 8).map((order) => (
                            <div key={order.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-gray-900 tracking-tighter uppercase mb-0.5">#{order.orderNumber || order.id}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{order.orderDate ? formatDate(order.orderDate) : "—"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900 tracking-tighter mb-0.5">{formatPrice(order.total ?? 0, order.currency)}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                        order.status === 'fulfilled' ? 'text-emerald-600' :
                                        order.status === 'pending' ? 'text-amber-600' :
                                        'text-gray-400'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-100" />
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Activity Record Established</p>
                    </div>
                )}
            </div>
        </div>

        {/* Profiles Sidebar: Meta & Contact */}
        <div className="space-y-6">
            {/* Contact Intelligence */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Connect Points</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Direct Line</p>
                            <p className="text-sm font-semibold text-gray-900 tracking-tight">{customer.phone || 'NO PHONE SAVED'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                            <Mail size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Node</p>
                            <p className="text-sm font-bold text-gray-900 tracking-tight truncate">{customer.email || 'DIRECTIVE_PENDING'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Physical Location</p>
                            <p className="text-sm font-bold text-gray-900 tracking-tight leading-snug">{customer.address || 'UNDEFINED LOCATION'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifecycle Audit */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Lifecycle Audit</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-400">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Onboarding Date</p>
                            <p className="text-xs font-semibold text-gray-900 tracking-widest">{customer.createdAt ? formatDate(customer.createdAt) : 'UNTRACKED'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-400">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Interaction</p>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest leading-none">
                                {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'No recent activity'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
