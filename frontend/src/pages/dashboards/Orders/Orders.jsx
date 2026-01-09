import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBag, DollarSign, Clock, CheckCircle } from "lucide-react";
import OrdersHeader from "../../../components/admin/Orders/OrdersHeader";
import OrdersTable from "../../../components/admin/Orders/OrdersTable";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/orders.json");
        setOrders(response.data);
      } catch (error) {
        console.error("Error loading orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status === 'fulfilled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const fulfilledOrders = orders.filter(o => o.status === 'fulfilled').length;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* Header */}
      <OrdersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalOrders={orders.length}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Fulfilled */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fulfilled</p>
              <p className="text-2xl font-bold text-gray-900">{fulfilledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
