import { useState, useEffect } from "react";
import axios from "axios";
import { Users, User, TrendingUp, ShoppingBag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const TopCustomers = ({ dateRange }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("spent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/top-customers.json");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching top customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-br from-emerald-400 to-emerald-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-amber-400 to-amber-600",
      "bg-gradient-to-br from-rose-400 to-rose-600",
      "bg-gradient-to-br from-cyan-400 to-cyan-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-teal-400 to-teal-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    return activeTab === "spent" ? b.totalSpent - a.totalSpent : b.totalOrders - a.totalOrders;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Top Customers</h3>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("spent")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "spent"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Spent
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "orders"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-gray-50">
          {sortedCustomers.slice(0, 6).map((customer, index) => (
            <div
              key={customer.id}
              className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors group"
            >
              {/* Rank */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0
                    ? "bg-amber-100 text-amber-700"
                    : index === 1
                    ? "bg-gray-200 text-gray-600"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </div>

              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${getAvatarColor(
                  customer.name
                )}`}
              >
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getInitials(customer.name)
                )}
              </div>

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {customer.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {customer.businessName ? (
                    <span className="truncate">{customer.businessName}</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {customer.totalOrders} orders
                    </span>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {activeTab === "spent"
                    ? formatCurrency(customer.totalSpent)
                    : customer.totalOrders}
                </p>
                <p className="text-xs text-gray-400">
                  {activeTab === "spent" ? "total spent" : "total orders"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <Link
          to="/dashboard/customers"
          className="flex items-center justify-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          View all customers
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TopCustomers;
