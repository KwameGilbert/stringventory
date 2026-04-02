import { useState, useEffect } from "react";
import { Users, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import CustomersHeader from "../../../components/admin/Customers/CustomersHeader";
import CustomersTable from "../../../components/admin/Customers/CustomersTable";
import customerService from "../../../services/customerService";
import { showError } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { useAuth } from "../../../contexts/AuthContext";
import { canManageCatalog } from "../../../utils/accessControl";
import { useCurrency } from "../../../utils/currencyUtils";

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
    totalSpent: Number(customer?.totalSpent ?? customer?.totalAmountSpent ?? 0),
  };
};

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [responseCurrency, setResponseCurrency] = useState("GHS");
  const canManage = canManageCatalog(user?.role || user?.normalizedRole);

  const { formatPrice } = useCurrency();
  const formatCurrency = (val) => formatPrice(val, responseCurrency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customerService.getCustomers();
        const currency = response?.currency || response?.data?.currency || "GHS";
        setResponseCurrency(currency);
        setCustomers(extractCustomers(response).map(c => ({ ...normalizeCustomer(c), currency })));
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
  }).sort((a, b) => {
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "spend_desc") return b.totalSpent - a.totalSpent;
    if (sortBy === "orders_desc") return b.totalOrders - a.totalOrders;
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const handleExportExcel = () => {
    if (filteredCustomers.length === 0) return;

    try {
      const dataToExport = filteredCustomers.map((c) => ({
        Name: c.name || "—",
        Email: c.email || "—",
        Phone: c.phone || "—",
        Status: (c.status || "active").toUpperCase(),
        "Total Orders": Number(c.totalOrders || 0),
        "Total Spent": Number(c.totalSpent || 0).toFixed(2),
        Currency: c.currency || responseCurrency,
        "Joined Date": c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : "—",
      }));

      exportToExcel(dataToExport, "stringventory_customers", "Customers");
    } catch (error) {
      console.error("Excel Export Error:", error);
      showError("Failed to generate Excel report");
    }
  };

  const handleExportPDF = async () => {
    if (filteredCustomers.length === 0) return;

    const tableData = {
      headers: ["Customer", "Email", "Phone", "Orders", "Spent"],
      rows: filteredCustomers.map((c) => [
        c.name || "—",
        c.email || "—",
        c.phone || "—",
        Number(c.totalOrders || 0),
        `${c.currency || responseCurrency} ${Number(c.totalSpent || 0).toFixed(2)}`,
      ]),
    };

    try {
      await exportToPDF({
        title: "Customer Intelligence Report",
        subtitle: `Generated on ${new Date().toLocaleDateString("en-GB")} for ${filteredCustomers.length} customer profile(s)`,
        fileName: "stringventory_customers",
        table: tableData,
        totals: [
          { label: "Total Lifetime Revenue", value: formatCurrency(totalRevenue), bold: true, color: 'emerald' },
        ]
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-20 bg-gray-100 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 space-y-6 animate-fade-in">
      {/* Immersive Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <CustomersHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCustomers={customers.length}
          canManage={canManage}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* Immersive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
        {/* Total Customers */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Profiles</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{totalCustomers}</p>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Active Status</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{activeCustomers}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Engagement</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight"><span className="text-indigo-600">{totalOrders}</span> <span className="text-sm">Trans.</span></p>
            </div>
          </div>
        </div>

        {/* Lifetime Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Lifetime Revenue</p>
              <p className="text-2xl font-bold text-emerald-600 tracking-tight">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="animate-fade-in-up md:animate-delay-100">
        <CustomersTable customers={filteredCustomers} canManage={canManage} />
      </div>
    </div>
  );
}
