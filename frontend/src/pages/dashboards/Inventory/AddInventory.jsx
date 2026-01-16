import { useNavigate } from "react-router-dom";
import InventoryForm from "../../../components/admin/Inventory/InventoryForm";

export default function AddInventory() {
  const navigate = useNavigate();

  const handleCreate = (formData) => {
    console.log("Creating inventory entry:", formData);
    // In a real app, this would be an API call
    // For now, just navigate back
    navigate("/dashboard/inventory");
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
