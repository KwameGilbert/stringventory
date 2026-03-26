import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InventoryForm from "../../../components/admin/Inventory/InventoryForm";
import inventoryService from "../../../services/inventoryService";
import { showError, showSuccess } from "../../../utils/alerts";

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

const toDateValue = (val) => (val ? String(val).split("T")[0] : "");

export default function EditInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryRes = await inventoryService.getInventory();
        const entries = extractList(inventoryRes, "inventory");
        const found = entries.find((e) => String(e.id) === String(id));
        if (!found) {
          showError("Inventory entry not found");
          navigate("/dashboard/inventory");
          return;
        }
        setInitialData({
          productId: found.productId || "",
          productName: found.productName || "",
          category: found.category || found.categoryName || "",
          batchNumber: found.batchNumber || found.reference || "",
          supplier: found.supplier || found.supplierName || "",
          notes: found.notes || "",
          unitCost: found.unitCost ?? "",
          quantity: found.quantity ?? found.currentStock ?? "",
          entryDate: toDateValue(found.entryDate || found.lastStockCheck || found.createdAt),
          expiryDate: toDateValue(found.expiryDate),
        });
      } catch (error) {
        console.error("Failed to load inventory entry", error);
        showError(error?.message || "Failed to load inventory entry");
        navigate("/dashboard/inventory");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await inventoryService.updateInventory(id, {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        unitCost: Number(formData.unitCost),
        costPrice: Number(formData.unitCost),
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate || null,
        notes: formData.notes || `Supplier: ${formData.supplier || "N/A"}; UnitCost: ${formData.unitCost || 0}`,
      });
      showSuccess("Inventory entry updated successfully");
      navigate(`/dashboard/inventory/${id}`);
    } catch (error) {
      console.error("Failed to update inventory", error);
      showError(error?.message || "Failed to update inventory entry");
    }
  };

  if (!initialData) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse pb-8">
        <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in">
      <InventoryForm
        initialData={initialData}
        onSubmit={handleUpdate}
        title="Edit Stock Entry"
        subTitle="Update the details for this inventory entry"
      />
    </div>
  );
}
