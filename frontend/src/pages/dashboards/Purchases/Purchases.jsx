import { useState, useEffect } from "react";
import { FileText, Package, AlertCircle, CheckCircle } from "lucide-react";
import PurchasesHeader from "../../../components/admin/Purchases/PurchasesHeader";
import PurchasesTable from "../../../components/admin/Purchases/PurchasesTable";
import purchaseService from "../../../services/purchaseService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useAuth } from "../../../contexts/AuthContext";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import Swal from "sweetalert2";

const extractPurchases = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.purchases)) return payload.purchases;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.purchases)) return payload.data.purchases;

  return [];
};

const extractPagination = (response) => {
  const payload = response?.data || response || {};
  const pagination = payload?.pagination || payload?.data?.pagination || {};

  return {
    page: Number(pagination?.page || 1),
    limit: Number(pagination?.limit || 20),
    total: Number(pagination?.total || 0),
    totalPages: Number(pagination?.totalPages || 1),
  };
};

const resolveCreatedBy = (purchase) => {
  const createdBy = purchase?.createdBy || purchase?.created_by || "";
  if (createdBy && typeof createdBy === 'string' && isNaN(Number(createdBy)) && createdBy.toLowerCase() !== "system") return createdBy;

  const createdByName = purchase?.createdByName || purchase?.created_by_name || purchase?.user_name || "";
  const createdByRole = purchase?.createdByRole || purchase?.created_by_role || purchase?.user_role || "";

  // 2. Try nested relation objects
  const creatorObj = purchase?.user || purchase?.creator || purchase?.createdByUser || purchase?.created_by_user || (typeof purchase?.created_by === 'object' ? purchase?.created_by : {});
  const firstName = creatorObj?.firstName || creatorObj?.first_name || "";
  const lastName = creatorObj?.lastName || creatorObj?.last_name || "";
  const name = creatorObj?.name || (firstName ? `${firstName} ${lastName}`.trim() : "");
  const role = creatorObj?.role || "";

  // 3. Final merge
  const finalName = createdByName || name || "";
  const finalRole = createdByRole || role || "";

  if (finalRole && finalName) {
    const roleLabel = String(finalRole).charAt(0).toUpperCase() + String(finalRole).slice(1).toLowerCase();
    return `${roleLabel} - ${finalName}`;
  }

  return finalName || "System";
};

const normalizePurchase = (purchase) => ({
  ...purchase,
  waybillNumber: purchase?.waybillNumber || "",
  supplierName: purchase?.supplierName || purchase?.supplier?.name || "Unknown Supplier",
  purchaseDate: purchase?.purchaseDate || purchase?.date || purchase?.createdAt,
  totalAmount: Number(purchase?.totalAmount ?? purchase?.total ?? purchase?.amount ?? 0),
  createdBy: resolveCreatedBy(purchase),
  status: String(purchase?.status || "pending").toLowerCase(),
});

export default function Purchases() {
  const { user } = useAuth();
  const currentUserRole = user?.role || user?.normalizedRole;

  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await purchaseService.getPurchases({
          page: currentPage,
          limit: pagination.limit,
          search: searchQuery || undefined,
          status: statusFilter || undefined,
        });
        setPurchases(extractPurchases(response).map(normalizePurchase));
        setPagination((prev) => ({
          ...prev,
          ...extractPagination(response),
        }));
      } catch (error) {
        console.error("Error loading purchases", error);
        showError(error?.message || "Failed to load purchases");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchQuery, statusFilter, pagination.limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate stats
  const totalPurchases = pagination.total || purchases.length;
  const pendingPurchases = purchases.filter(p => p.status === "pending").length;
  const receivedPurchases = purchases.filter(p => p.status === "received").length;
  const partialPurchases = purchases.filter(p => p.status === "partial").length;

  const handleDelete = async (id) => {
    const result = await confirmDelete("this purchase");
    if (result.isConfirmed) {
      try {
        await purchaseService.deletePurchase(id);
        setPurchases((prev) => prev.filter((p) => String(p.id) !== String(id)));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
        showSuccess("Purchase deleted successfully");
      } catch (error) {
        console.error("Failed to delete purchase", error);
        showError(error?.message || "Failed to delete purchase");
      }
    }
  };

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "Approve Purchase?",
      text: "Are you sure you want to approve this purchase?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve it",
    });

    if (result.isConfirmed) {
      try {
        await purchaseService.approvePurchase(id);
        setPurchases((prev) =>
          prev.map((p) =>
            String(p.id) === String(id) ? { ...p, status: "approved" } : p
          )
        );
        showSuccess("Purchase approved successfully");
      } catch (error) {
        console.error("Failed to approve purchase", error);
        showError(error?.message || "Failed to approve purchase");
      }
    }
  };

  const handleExportExcel = () => {
    if (purchases.length === 0) return;

    const dataToExport = purchases.map((p) => ({
      "Waybill #": p.waybillNumber || "—",
      Supplier: p.supplierName,
      Date: new Date(p.purchaseDate).toLocaleDateString("en-GB"),
      Amount: p.totalAmount,
      Status: p.status.toUpperCase(),
      "Created By": p.createdBy,
    }));

    exportToExcel(dataToExport, "stringventory_purchases", "Purchases");
  };

  const handleExportPDF = async () => {
    if (purchases.length === 0) return;

    const tableData = {
      headers: ["Waybill / Ref", "Supplier", "Date", "Amount", "Status", "Created By"],
      rows: purchases.map((p) => [
        p.waybillNumber || p.purchaseNumber || "—",
        p.supplierName,
        new Date(p.purchaseDate).toLocaleDateString("en-GB"),
        p.totalAmount.toFixed(2),
        p.status.toUpperCase(),
        p.createdBy || "—",
      ]),
    };

    try {
      await exportToPDF({
        title: "Inventory Purchase Orders Report",
        fileName: "stringventory_purchases",
        table: tableData,
      });
    } catch (error) {
      showError("Failed to generate PDF");
    }
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
      <PurchasesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Purchases */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gray-50">
              <AlertCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPurchases}</p>
            </div>
          </div>
        </div>

        {/* Partial */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Partial</p>
              <p className="text-2xl font-bold text-gray-900">{partialPurchases}</p>
            </div>
          </div>
        </div>

        {/* Received */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="text-2xl font-bold text-gray-900">{receivedPurchases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <PurchasesTable
        purchases={purchases}
        onDelete={handleDelete}
        onApprove={handleApprove}
        currentUserRole={currentUserRole}
        currentPage={pagination.page || currentPage}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.total || purchases.length}
        pageSize={pagination.limit || 20}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
