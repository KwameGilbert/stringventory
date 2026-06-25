import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flag } from "lucide-react";
import orderService from "../../../services/business/orderService";
import { useCurrency } from "../../../utils/currencyUtils";
import { useAuth } from "../../../providers/AuthContext";
import { normalizeRole, ROLES } from "../../../utils/accessControl";

const ALL_TABS = ["Sale", "Purchase", "Expenses"];

const MOCK_TRANSACTIONS = {
  Sale: [
    { id: 1, date: "24 May 2025", customer: "Andrea Willer", code: "#114589", status: "Completed", statusColor: "bg-emerald-500", total: 4560, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: 2, date: "23 May 2025", customer: "Timothy Sands", code: "#114589", status: "Completed", statusColor: "bg-emerald-500", total: 3569, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { id: 3, date: "22 May 2025", customer: "Bonnie Rodrigues", code: "#114589", status: "Draft", statusColor: "bg-pink-500", total: 2659, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { id: 4, date: "21 May 2025", customer: "Randy McCree", code: "#114589", status: "Completed", statusColor: "bg-emerald-500", total: 2155, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
  ],
  Purchase: [
    { id: 5, date: "20 May 2025", customer: "Global Supplies Ltd", code: "#SUP-001", status: "Completed", statusColor: "bg-emerald-500", total: 12500, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80" },
    { id: 6, date: "19 May 2025", customer: "Apex Tech Importers", code: "#SUP-004", status: "Pending", statusColor: "bg-amber-500", total: 8400, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80" },
  ],
  Expenses: [
    { id: 8, date: "17 May 2025", customer: "Office Maintenance", code: "#EXP-40", status: "Paid", statusColor: "bg-emerald-500", total: 650, avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=100&auto=format&fit=crop&q=80" },
  ]
};

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
              avatar: order.customer?.avatar || MOCK_TRANSACTIONS.Sale[idx % MOCK_TRANSACTIONS.Sale.length].avatar,
            }));
            setTransactions(mapped);
            return;
          }
        }
        
        setTransactions(MOCK_TRANSACTIONS[activeTab] || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions(MOCK_TRANSACTIONS[activeTab] || []);
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
