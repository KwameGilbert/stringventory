import { useNavigate } from "react-router-dom";
import InventoryForm from "../../../components/admin/Inventory/InventoryForm";
import inventoryService from "../../../services/inventoryService";
import { showError, showSuccess } from "../../../utils/alerts";

export default function AddInventory() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await inventoryService.addInventory({
        productId: formData.productId,
        quantity: Number(formData.quantity),
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate || null,
        notes: formData.notes || `Supplier: ${formData.supplier || "N/A"}; UnitCost: ${formData.unitCost || 0}`,
      });
      showSuccess("Inventory entry added successfully");
      navigate("/dashboard/inventory");
    } catch (error) {
      console.error("Failed to add inventory", error);
      showError(error?.message || "Failed to add inventory entry");
    }
  };

  return (
    <div className="pb-8 animate-fade-in">
      <InventoryForm
        onSubmit={handleCreate}
        title="Add Stock Intake"
        subTitle="Record new inventory received"
      />
    </div>
  );
}
