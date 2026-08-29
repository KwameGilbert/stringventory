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
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#00C49F] mb-3">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-[22px] font-medium text-slate-900 tracking-tight leading-none mb-0.5">{totalSuppliers}</h3>
          <p className="text-sm font-medium text-slate-700 mb-1">Total Suppliers</p>
        </div>

        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#4F46E5] mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 mb-0.5">
            <h3 className="text-[22px] font-medium text-slate-900 tracking-tight leading-none">{activeSuppliers}</h3>
            {totalSuppliers - activeSuppliers > 0 && (
              <span className="text-[10px] font-medium uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                {totalSuppliers - activeSuppliers} Inactive
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">Active Partners</p>
        </div>

        <div className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
          <div className="p-2 rounded-lg text-white bg-[#F59E0B] mb-3">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="text-[22px] font-medium text-slate-900 tracking-tight leading-none mb-0.5">{totalProducts}</h3>
          <p className="text-sm font-medium text-slate-700 mb-1">Supplied Products</p>
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
