import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Building2, User, Mail, Phone, MapPin, Truck, ShoppingBag, Star, Sliders, Info, DollarSign } from "lucide-react";
import supplierService from "../../../services/business/supplierService";
import { useCurrency } from "../../../utils/currencyUtils";

const extractSupplier = (response) => {
  const payload = response?.data || response || {};
  return payload?.supplier || payload?.data?.supplier || payload?.data || payload;
};

export default function ViewSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supplierService.getSupplierById(id);
        const found = extractSupplier(response);

        // Extract source currency from response
        const currency = response?.currency || response?.data?.currency || "GHS";

        if (found?.id) {
          setSupplier({
            ...found,
            currency,
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
              const receivedPurchases = (found?.purchases || []).filter((p) => p.status === "received" && p.receivedDate);
              const onTimeCount = receivedPurchases.filter(
                (p) => new Date(p.receivedDate) <= new Date(p.expectedDeliveryDate)
              ).length;
              const onTimeRate = receivedPurchases.length > 0 ? (onTimeCount / receivedPurchases.length) * 100 : 0;

              const totalLeadTimeDays = receivedPurchases.reduce((sum, p) => {
                const diffTime = Math.abs(new Date(p.receivedDate) - new Date(p.purchaseDate));
                return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              }, 0);
              const avgLeadTime = receivedPurchases.length > 0 ? (totalLeadTimeDays / receivedPurchases.length).toFixed(1) : 0;

              const pendingBalance = (found?.purchases || [])
                .filter((p) => p.paymentStatus !== "paid")
                .reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);

              return { onTimeRate, avgLeadTime, pendingBalance };
            })(),
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

  const formatCurrency = (val) => formatPrice(val, supplier?.currency || "GHS");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <Truck className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Supplier not found</h3>
        <p className="text-slate-500 mb-6 font-medium text-sm">The supplier you are looking for might have been removed or does not exist.</p>
        <button
          onClick={() => navigate("/dashboard/suppliers")}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all font-semibold text-xs shadow-sm cursor-pointer active:scale-95"
        >
          Back to Suppliers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/dashboard/suppliers")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-semibold text-sm">Back to Suppliers</span>
        </button>

        <Link
          to={`/dashboard/suppliers/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold text-xs shadow-sm shadow-emerald-500/20 active:scale-95"
        >
          <Edit size={16} />
          <span>Edit Supplier</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 flex items-center gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-emerald-500/20 shrink-0">
          {supplier.name ? supplier.name.charAt(0) : "S"}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{supplier.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <span className="font-mono text-slate-500 font-semibold">ID: #{supplier.id}</span>
            <span
              className={`px-2.5 py-1 rounded-lg font-semibold shadow-2xs border ${
                supplier.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {supplier.status}
            </span>
            {supplier.rating > 0 && (
              <div className="flex items-center gap-1 ml-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < supplier.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Details Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-slate-700" />
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Contact Details</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6 flex-1">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60 shadow-2xs">
                <User size={18} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Contact Person</label>
                <p className="text-slate-900 font-semibold text-sm mt-0.5">{supplier.contactPerson || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60 shadow-2xs">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <label className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Email Address</label>
                <p className="text-slate-900 font-mono text-sm mt-0.5 truncate">{supplier.email || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60 shadow-2xs">
                <Phone size={18} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Phone Number</label>
                <p className="text-slate-900 font-mono text-sm mt-0.5">{supplier.phone || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60 shadow-2xs">
                <MapPin size={18} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">Physical Address</label>
                <p className="text-slate-900 font-medium text-sm mt-0.5">{supplier.address || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Performance Card */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-100 flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-amber-700" />
            <h3 className="font-semibold text-amber-950 text-sm uppercase tracking-wider">Performance Metrics</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-2xs">
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">On-Time Rate</p>
                <p className={`text-2xl font-bold tracking-tight ${supplier.onTimeRate >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                  {Math.round(supplier.onTimeRate || 0)}%
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-2xs">
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Avg Lead Time</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">{supplier.avgLeadTime || 0}d</p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-2xs col-span-1">
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Lifetime Spend</p>
                <p className="text-lg font-bold tracking-tight text-slate-900 font-mono">{formatCurrency(supplier.lifetimeSpend)}</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-2xs col-span-1">
                <p className="text-[11px] text-amber-800 uppercase font-bold tracking-wider mb-1">Pending Balance</p>
                <p className="text-lg font-bold tracking-tight text-amber-700 font-mono">{formatCurrency(supplier.pendingBalance)}</p>
              </div>
            </div>

            {supplier.notes && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 font-medium">
                <span className="font-semibold text-slate-900 block mb-1">Internal Notes:</span>
                {supplier.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Supplied Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-emerald-950 text-sm uppercase tracking-wider">Products Supplied</h3>
          </div>
          <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-2xs">
            {supplier.products.length} Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">SKU</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right font-mono">Price</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {supplier.products.length > 0 ? (
                supplier.products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(product.sellingPrice)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-semibold shadow-2xs border ${
                          product.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No products registered for this supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Purchases Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DollarSign className="w-4 h-4 text-blue-700" />
            <h3 className="font-semibold text-blue-950 text-sm uppercase tracking-wider">Recent Purchase Orders</h3>
          </div>
          <span className="px-3 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-2xs">
            {supplier.purchases.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[650px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">PO Number</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right font-mono">Total Amount</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {supplier.purchases.length > 0 ? (
                supplier.purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 font-mono">{purchase.purchaseNumber}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-semibold shadow-2xs border ${
                          purchase.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {purchase.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No purchase order history found for this supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
