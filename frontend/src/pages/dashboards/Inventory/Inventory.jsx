import { useState, useEffect } from "react";
import { Package, DollarSign, Clock } from "lucide-react";
import InventoryHeader from "../../../components/admin/Inventory/InventoryHeader";
import InventoryTable from "../../../components/admin/Inventory/InventoryTable";
import inventoryService from "../../../services/inventoryService";
import { productService } from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import supplierService from "../../../services/supplierService";
import { showError, showSuccess, showInfo } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { isProductApproved } from "../../../utils/productApproval";
import { resolveApiMediaUrl } from "../../../utils/mediaUrl";
import { useCurrency } from "../../../utils/currencyUtils";

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
  
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [responseCurrency, setResponseCurrency] = useState("GHS");

  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, categoriesRes, suppliersRes] = await Promise.all([
          inventoryService.getInventory(),
          categoryService.getCategories(),
          supplierService.getSuppliers(),
        ]);

        const fetchedInventory = extractList(inventoryRes, "inventory");
        const fetchedCategories = extractList(categoriesRes, "categories");
        const fetchedSuppliers = extractList(suppliersRes, "suppliers");
        
        const currency = inventoryRes?.currency || inventoryRes?.data?.currency || "GHS";
        setResponseCurrency(currency);

        const normalizedInventory = fetchedInventory.map((item) => {
          const product = item.product || {};
          const category = fetchedCategories.find((c) => String(c.id) === String(product?.categoryId));
          const supplier = fetchedSuppliers.find((s) => String(s.id) === String(product?.supplierId));

          const unitCost = Number(item.unitCost ?? product?.costPrice ?? product?.cost ?? 0);
          const quantity = Number(item.quantity ?? item.currentStock ?? 0);

          return {
            ...item,
            productName: item.productName || product?.name || "Unknown Product",
            image: resolveApiMediaUrl(
              item.image ||
              item.imageUrl ||
              item.image_url ||
              product?.image ||
              product?.imageUrl ||
              product?.image_url ||
              null
            ),
            category: item.category || item.categoryName || product?.categoryName || category?.name || "Uncategorized",
            batchNumber: item.batchNumber || item.reference || `BATCH-${item.id}`,
            supplier: item.supplier || item.supplierName || product?.supplierName || supplier?.name || "Unknown Supplier",
            unitCost,
            quantity,
            totalValue: Number(item.totalValue ?? quantity * unitCost),
            entryDate: item.createdAt || item.lastUpdated || item.lastStockCheck || new Date().toISOString(),
            expiryDate: item.soonestExpiryDate || item.expiryDate || null,
            productId: item.productId || item.product_id || item.product?.id || product?.id,
            currency: currency
          };
        }).filter((item) => {
          return isProductApproved(item.product || { id: item.productId });
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

  const handleOpenAdjustment = (item) => {
    setSelectedItem(item);
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjustment = async ({ itemId, type, reason, quantity, notes }) => {
    const currentItem = inventory.find((item) => String(item.id) === String(itemId));
    if (!currentItem) {
      throw new Error("Inventory item not found");
    }

    const resolvedProductId =
      currentItem.productId || currentItem.product_id || currentItem.product?.id;
    if (!resolvedProductId) {
      throw new Error("Product ID is missing for this inventory item");
    }

    const absoluteQuantity = Number(quantity);
    const adjustmentValue = type === "decrease" ? -absoluteQuantity : absoluteQuantity;
    const operation = type === "increase" ? "add" : "subtract";

    try {
      await inventoryService.adjustInventory({
        productId: resolvedProductId,
        product_id: resolvedProductId,
        product: resolvedProductId,
        productID: resolvedProductId,
        adjustmentValue,
        adjustment_value: adjustmentValue,
        adjustment: absoluteQuantity,
        value: absoluteQuantity,
        quantity: absoluteQuantity,
        delta: adjustmentValue,
        adjustmentType: type,
        operation,
        action: operation,
        direction: type,
        type,
        reason,
        notes,
      });

      setInventory((prev) =>
        prev.map((item) => {
          if (String(item.id) !== String(itemId)) return item;
          const newQuantity = type === 'increase'
            ? item.quantity + absoluteQuantity
            : Math.max(0, item.quantity - absoluteQuantity);
          return {
            ...item,
            quantity: newQuantity,
            totalValue: newQuantity * item.unitCost,
          };
        })
      );

      showSuccess(`Stock ${type}d successfully`);
    } catch (error) {
      console.error("Failed to adjust stock", error);
      showError(error?.message || "Failed to adjust stock");
      throw error;
    }
  };

  const handleExportExcel = () => {
    if (filteredInventory.length === 0) return;

    const dataToExport = filteredInventory.map((item) => ({
      Product: item.productName,
      Batch: item.batchNumber,
      Category: item.category,
      Supplier: item.supplier,
      "Unit Cost": item.unitCost,
      Quantity: item.quantity,
      "Total Value": item.totalValue,
      "Entry Date": new Date(item.entryDate).toLocaleDateString("en-GB"),
      "Expiry Date": item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-GB") : "—",
    }));

    exportToExcel(dataToExport, "stringventory_inventory", "Inventory");
  };

  const handleExportPDF = async () => {
    if (filteredInventory.length === 0) return;

    const tableData = {
      headers: ["Product", "Batch", "Category", "Qty", "Value", "Expiry"],
      rows: filteredInventory.map((item) => [
        item.productName,
        item.batchNumber,
        item.category,
        item.quantity,
        item.totalValue.toFixed(2),
        item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-GB") : "—",
      ]),
    };

    try {
      await exportToPDF({
        title: "Stock Intake Inventory Report",
        fileName: "stringventory_inventory",
        table: tableData,
      });
    } catch (error) {
      showError("Failed to generate PDF");
    }
  };

  const formatCurrency = (val) => formatPrice(val, responseCurrency);

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
    <div className="pb-8 animate-fade-in space-y-6 px-4 sm:px-0">
      {/* Header */}
      <InventoryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        totalItems={inventory.length}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Batches</p>
              <p className="text-2xl font-black text-gray-900">{totalEntries}</p>
            </div>
          </div>
        </div>

        {/* Total Units */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Stock</p>
              <p className="text-2xl font-black text-gray-900">{totalUnits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
              <p className="text-2xl font-black text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expiring Soon</p>
              <p className="text-2xl font-black text-gray-900">{expiringCount} <span className="text-xs font-bold text-gray-400 italic">batches</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable 
        inventory={filteredInventory} 
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
