import { useState, useEffect } from "react";
import { Truck, CheckCircle2, Package } from "lucide-react";
import supplierService from "../../../services/business/supplierService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { handleApiError } from "../../../utils/errorHandler";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import SuppliersHeader from "../../../components/dashboard/Suppliers/SuppliersHeader";
import SuppliersGrid from "../../../components/dashboard/Suppliers/SuppliersGrid";
import SuppliersTable from "../../../components/dashboard/Suppliers/SuppliersTable";

const extractSuppliers = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.suppliers)) return payload.suppliers;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.suppliers)) return payload.data.suppliers;

  return [];
};

const normalizeSupplier = (supplier) => ({
  ...supplier,
  status:
    supplier?.status === "active" || supplier?.isActive === true
      ? "Active"
      : supplier?.status === "inactive" || supplier?.isActive === false
        ? "Inactive"
        : supplier?.status || "Active",
  productsCount:
    supplier?.productsCount ??
    supplier?.products_count ??
    supplier?.productCount ??
    0,
});

export default function Suppliers() {
  const [view, setView] = useState("list");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supplierService.getSuppliers();
        setSuppliers(extractSuppliers(response).map(normalizeSupplier));
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      (supplier.name && supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    const result = await confirmDelete("this supplier");
    if (!result.isConfirmed) return;

    try {
      await supplierService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((supplier) => String(supplier.id) !== String(id)));
      showSuccess("Supplier deleted successfully");
    } catch (error) {
      console.error("Failed to delete supplier", error);
      handleApiError(error);
    }
  };

  const handleExportExcel = () => {
    if (filteredSuppliers.length === 0) return;

    const dataToExport = filteredSuppliers.map((s) => ({
      ID: s.id,
      Name: s.name || "—",
      "Contact Person": s.contactPerson || "—",
      Email: s.email || "—",
      Phone: s.phone || "—",
      Address: s.address || "—",
      "Products Count": Number(s.productsCount || 0),
      Status: (s.status || "Active").toUpperCase(),
    }));

    exportToExcel(dataToExport, "stringventory_suppliers", "Suppliers");
  };

  const handleExportPDF = async () => {
    if (filteredSuppliers.length === 0) return;

    const tableData = {
      headers: ["ID", "Supplier", "Contact", "Email", "Phone", "Status"],
      rows: filteredSuppliers.map((s) => [
        s.id,
        s.name || "—",
        s.contactPerson || "—",
        s.email || "—",
        s.phone || "—",
        (s.status || "Active").toUpperCase(),
      ]),
    };

    try {
      const totalProductsCount = filteredSuppliers.reduce((sum, s) => sum + Number(s.productsCount || 0), 0);

      await exportToPDF({
        title: "Supplier Directory Report",
        subtitle: `Generated for ${filteredSuppliers.length} supplier(s)`,
        fileName: "stringventory_suppliers",
        table: tableData,
        totals: [
          { label: "Total Managed Products", value: totalProductsCount.toLocaleString(), bold: true, color: "emerald" },
        ],
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;
  const totalProducts = suppliers.reduce((sum, s) => sum + (Number(s.productsCount) || 0), 0);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
        <div className="h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Suppliers Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-emerald-100 font-semibold text-sm uppercase tracking-wider">Total Suppliers</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-semibold tracking-tight">{totalSuppliers}</h3>
            <p className="text-emerald-100/80 text-xs font-medium mt-1">Partners & distributors</p>
          </div>
        </div>

        {/* Active Partners Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Active Partners</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 flex items-baseline justify-between">
            <div>
              <h3 className="text-3xl font-semibold tracking-tight">{activeSuppliers}</h3>
              <p className="text-blue-100/80 text-xs font-medium mt-1">Active trading accounts</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-white/90">{totalSuppliers - activeSuppliers}</span>
              <p className="text-blue-100/80 text-xs font-medium mt-1">Inactive</p>
            </div>
          </div>
        </div>

        {/* Managed Products Card */}
        <div className="p-3 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-22 h-22 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-amber-100 font-semibold text-sm uppercase tracking-wider">Supplied Products</span>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-semibold tracking-tight">{totalProducts}</h3>
            <p className="text-amber-100/80 text-xs font-medium mt-1">Catalog items supplied</p>
          </div>
        </div>
      </div>

      <SuppliersHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        view={view}
        setView={setView}
        totalSuppliers={filteredSuppliers.length}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {view === "grid" ? (
        <SuppliersGrid suppliers={filteredSuppliers} onDelete={handleDelete} />
      ) : (
        <SuppliersTable suppliers={filteredSuppliers} onDelete={handleDelete} />
      )}
    </div>
  );
}
