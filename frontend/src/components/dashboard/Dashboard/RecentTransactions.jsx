import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flag } from "lucide-react";
import orderService from "../../../services/business/orderService";
import { useCurrency } from "../../../utils/currencyUtils";
import { useAuth } from "../../../providers/AuthContext";
import { normalizeRole, ROLES } from "../../../utils/accessControl";

const ALL_TABS = ["Sale", "Purchase", "Expenses"];


const RecentTransactions = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState("Sale");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const roleName = user?.role?.name || user?.role || user?.roleName;
  const role = normalizeRole(roleName);
  const isSales = role === ROLES.SALES;
  const availableTabs = isSales ? ["Sale"] : ALL_TABS;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (activeTab === "Sale") {
          const res = await orderService.getOrders({ limit: 3 });
          const payload = res?.data || res || {};
          const orderList = Array.isArray(payload) ? payload : payload.orders || [];

          if (orderList.length > 0) {
            const mapped = orderList.slice(0, 3).map((order, idx) => ({
              id: order.id || idx,
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "24 May 2025",
              customer: order.customer?.name || order.customerName || "Unknown Customer",
              code: `#${order.orderNumber || order.id}`,
              status: order.status || "Completed",
              statusColor: order.status === "pending" ? "bg-amber-500" : order.status === "cancelled" ? "bg-red-500" : "bg-emerald-500",
              total: Number(order.total || 0),
              avatar: order.customer?.avatar || "",
            }));
            setTransactions(mapped);
            return;
          }
        }
        setTransactions([]);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [activeTab]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shrink-0">
              <Flag size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight truncate">Recent Transactions</h3>
          </div>
          <Link to="/dashboard/orders" className="text-xs font-bold text-slate-500 underline hover:text-slate-800 shrink-0 ml-2">
            View All
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-100 mb-6 overflow-x-auto">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold relative whitespace-nowrap transition-colors ${
                activeTab === tab ? "text-[#E65F2B]" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E65F2B] rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 py-3 px-4 bg-slate-50 rounded-lg text-xs font-semibold text-slate-900 mb-3">
          <div className="col-span-3">Date</div>
          <div className="col-span-5">Customer</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* Transaction Rows */}
        <div className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 animate-pulse font-medium">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">No transactions found</div>
          ) : (
            transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="grid grid-cols-12 items-center gap-2 py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                {/* Date */}
                <div className="col-span-3 text-xs font-medium text-slate-500">{tx.date}</div>

                {/* Customer */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img src={tx.avatar} alt={tx.customer} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-medium text-slate-800 truncate">{tx.customer}</h5>
                    <p className="text-xs font-medium text-[#E65F2B] truncate">{tx.code}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <div className={`w-1.5 h-1.5 rounded-full ${tx.statusColor}`}></div>
                    <span className="text-[10px] font-medium text-slate-700">{tx.status}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-slate-900">{formatPrice(tx.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
