import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Package, AlertCircle, CheckCircle } from "lucide-react";
import PurchasesHeader from "../../../components/admin/Purchases/PurchasesHeader";
import PurchasesTable from "../../../components/admin/Purchases/PurchasesTable";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/purchases.json");
        setPurchases(response.data);
      } catch (error) {
        console.error("Error loading purchases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalPurchases = purchases.length;
  const pendingPurchases = purchases.filter(p => p.status === "pending").length;
  const receivedPurchases = purchases.filter(p => p.status === "received").length;
  const partialPurchases = purchases.filter(p => p.status === "partial").length;

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.waybillNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    const result = await confirmDelete("this purchase");
    if (result.isConfirmed) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Purchase deleted successfully");
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
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <PurchasesTable purchases={filteredPurchases} onDelete={handleDelete} />
    </div>
  );
}
