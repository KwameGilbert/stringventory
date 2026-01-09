import { useState, useEffect } from "react";
import axios from "axios";
import { Package, DollarSign, Clock } from "lucide-react";
import InventoryHeader from "../../../components/admin/Inventory/InventoryHeader";
import InventoryTable from "../../../components/admin/Inventory/InventoryTable";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, categoriesRes] = await Promise.all([
          axios.get("/data/inventory.json"),
          axios.get("/data/categories.json"),
        ]);
        setInventory(inventoryRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const totalEntries = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  
  const today = new Date();
  const expiringCount = inventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const daysUntil = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil > 0;
  }).length;

  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    const result = await confirmDelete("this inventory entry");
    if (result.isConfirmed) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      showSuccess("Inventory entry deleted successfully");
    }
  };

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
      <InventoryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        totalItems={inventory.length}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
            </div>
          </div>
        </div>

        {/* Total Units */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{expiringCount} <span className="text-sm font-normal text-gray-400">batches</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable inventory={filteredInventory} onDelete={handleDelete} />
    </div>
  );
}
