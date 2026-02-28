import { useState, useEffect } from "react";
import { Users, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import CustomersHeader from "../../../components/admin/Customers/CustomersHeader";
import CustomersTable from "../../../components/admin/Customers/CustomersTable";
import customerService from "../../../services/customerService";
import { showError } from "../../../utils/alerts";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageCatalog } from "../../../utils/accessControl";

const extractCustomers = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.customers)) return payload.customers;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.customers)) return payload.data.customers;

  return [];
};

const normalizeCustomer = (customer) => {
  const firstName = customer?.firstName || "";
  const lastName = customer?.lastName || "";

  return {
    ...customer,
    name: customer?.name || `${firstName} ${lastName}`.trim() || "Unknown Customer",
    status: customer?.status || "active",
    totalOrders: Number(customer?.totalOrders ?? 0),
    totalSpent: Number(customer?.totalSpent ?? 0),
  };
};

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const canManage = canManageCatalog(user?.role || user?.normalizedRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customerService.getCustomers();
        setCustomers(extractCustomers(response).map(normalizeCustomer));
      } catch (error) {
        console.error("Error loading customers", error);
        showError(error?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      String(customer.name || "").toLowerCase().includes(searchLower) ||
      String(customer.email || "").toLowerCase().includes(searchLower) ||
      String(customer.phone || "").includes(searchQuery)
    );
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
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
      <CustomersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCustomers={customers.length}
        canManage={canManage}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Lifetime Revenue */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lifetime Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <CustomersTable customers={filteredCustomers} canManage={canManage} />
    </div>
  );
}
