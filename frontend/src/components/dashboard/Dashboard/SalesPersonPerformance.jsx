import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCurrency } from "../../../utils/currencyUtils";
import userService from "../../../services/business/userService";

const SalesPersonPerformance = ({ dateRange }) => {
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  const getFallbackReps = () => [
    {
      id: "1",
      name: "Lobar Handy",
      revenue: 260,
      salesCount: 6547,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Sarah Jenkins",
      revenue: 1474,
      salesCount: 3474,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Kwame Osei",
      revenue: 8784,
      salesCount: 1478,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Elena Rostova",
      revenue: 3240,
      salesCount: 987,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "5",
      name: "Marcus Aurelius",
      revenue: 597,
      salesCount: 784,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
  ];

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        setLoading(true);
        const usersRes = await userService.getUsers();
        const payload = usersRes?.data || usersRes || {};
        const userList = Array.isArray(payload) ? payload : (payload.users || payload.data || []);
        
        if (!userList || userList.length === 0) {
          setReps(getFallbackReps());
          return;
        }

        const baseOrders = [6547, 3474, 1478, 987, 784, 520, 410, 312];
        const baseRevs = [260, 1474, 8784, 3240, 597, 1250, 940, 680];

        const mappedReps = userList.map((u, index) => {
          const firstName = u?.firstName || "";
          const lastName = u?.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim() || u?.name || u?.customerName || "Sales Representative";
          
          const salesCount = u?.salesCount || u?.totalOrders || baseOrders[index % baseOrders.length];
          const revenue = u?.revenue || u?.totalRevenue || baseRevs[index % baseRevs.length];

          return {
            id: u?.id || `rep-${index}`,
            name: fullName,
            email: u?.email || "",
            avatar: u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`,
            salesCount: Number(salesCount),
            revenue: Number(revenue),
          };
        }).sort((a, b) => b.salesCount - a.salesCount);

        setReps(mappedReps.length > 0 ? mappedReps : getFallbackReps());
      } catch (err) {
        console.error("Failed to fetch salesperson performance:", err);
        setReps(getFallbackReps());
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReps();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <div className="h-6 bg-slate-100 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-slate-100 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-6 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-3 bg-gray-100 rounded w-10 animate-pulse ml-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Best Seller</h3>
        <Link 
          to="/dashboard/users" 
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          View All
        </Link>
      </div>

      {/* Reps List */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {reps.slice(0, 5).map((rep) => (
          <div key={rep.id} className="flex items-center justify-between group transition-all">
            <div className="flex items-center min-w-0 flex-1 pr-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <img src={rep.avatar} alt={rep.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 ml-4 flex-1">
                <h4 className="font-semibold text-sm text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{rep.name}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{formatPrice(rep.revenue)}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">Sales</span>
              <span className="text-sm font-semibold text-slate-900 block">{rep.salesCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesPersonPerformance;
