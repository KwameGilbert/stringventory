import { useState, useEffect } from "react";
import { Package, DollarSign, Clock } from "lucide-react";
import InventoryHeader from "../../../components/admin/Inventory/InventoryHeader";
import InventoryTable from "../../../components/admin/Inventory/InventoryTable";
import inventoryService from "../../../services/inventoryService";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { confirmDelete, showError, showSuccess, showInfo } from "../../../utils/alerts";

import StockAdjustmentModal from "../../../components/admin/Inventory/StockAdjustmentModal";

const extractList = (response, key) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.[key])) return payload.data[key];

  return [];
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Stock Adjustment State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, categoriesRes, productsRes, suppliersRes] = await Promise.all([
          inventoryService.getInventory(),
          categoryService.getCategories(),
          productService.getProducts(),
          supplierService.getSuppliers(),
        ]);

        const fetchedInventory = extractList(inventoryRes, "inventory");
        const fetchedCategories = extractList(categoriesRes, "categories");
        const fetchedProducts = extractList(productsRes, "products");
        const fetchedSuppliers = extractList(suppliersRes, "suppliers");

        const normalizedInventory = fetchedInventory.map((item) => {
          const product = fetchedProducts.find((p) => String(p.id) === String(item.productId));
          const category = fetchedCategories.find((c) => String(c.id) === String(product?.categoryId));
          const supplier = fetchedSuppliers.find((s) => String(s.id) === String(product?.supplierId));

          const unitCost = Number(item.unitCost ?? product?.costPrice ?? product?.cost ?? 0);
          const quantity = Number(item.quantity ?? item.currentStock ?? 0);

          return {
            ...item,
            productName: item.productName || product?.name || "Unknown Product",
            category: item.category || item.categoryName || product?.categoryName || category?.name || "Uncategorized",
            batchNumber: item.batchNumber || item.reference || `BATCH-${item.id}`,
            supplier: item.supplier || item.supplierName || product?.supplierName || supplier?.name || "Unknown Supplier",
            unitCost,
            quantity,
            totalValue: Number(item.totalValue ?? quantity * unitCost),
            entryDate: item.entryDate || item.lastStockCheck || item.createdAt || new Date().toISOString(),
            expiryDate: item.expiryDate || null,
            productId: item.productId || product?.id,
          };
        });

        setInventory(normalizedInventory);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading data", error);
        showError(error?.message || "Failed to load inventory");
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
      String(item.productName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.batchNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.supplier || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    const result = await confirmDelete("this inventory entry");
    if (result.isConfirmed) {
      setInventory((prev) => prev.filter((item) => String(item.id) !== String(id)));
      showInfo("Inventory delete endpoint is not available yet; removed from current view only.");
    }
  };

  const handleOpenAdjustment = (item) => {
    setSelectedItem(item);
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjustment = async ({ itemId, type, reason, quantity, notes }) => {
    const currentItem = inventory.find((item) => String(item.id) === String(itemId));
    if (!currentItem) return;

    try {
      await inventoryService.adjustInventory({
        productId: currentItem.productId,
        adjustmentType: type,
        quantity,
        reason,
        notes,
      });

      setInventory((prev) =>
        prev.map((item) => {
          if (String(item.id) !== String(itemId)) return item;
          const newQuantity = type === 'increase'
            ? item.quantity + quantity
            : Math.max(0, item.quantity - quantity);
          return {
            ...item,
            quantity: newQuantity,
            totalValue: newQuantity * item.unitCost,
          };
        })
      );

      showSuccess(`Stock ${type}d successfully`);
      setAdjustModalOpen(false);
    } catch (error) {
      console.error("Failed to adjust stock", error);
      showError(error?.message || "Failed to adjust stock");
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
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <Package className="w-5 h-5 text-emerald-600" />
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
      <InventoryTable 
        inventory={filteredInventory} 
        onDelete={handleDelete} 
        onAdjust={handleOpenAdjustment}
      />

      {/* Adjustment Modal */}
      <StockAdjustmentModal 
        key={selectedItem ? selectedItem.id : 'modal'}
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        item={selectedItem}
        onConfirm={handleConfirmAdjustment}
      />
    </div>
  );
}
