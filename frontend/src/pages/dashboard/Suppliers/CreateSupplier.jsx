import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supplierService from "../../../services/business/supplierService";
import { showError, showSuccess } from "../../../utils/alerts";
import SupplierForm from "../../../components/dashboard/Suppliers/SupplierForm";

export default function CreateSupplier() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await supplierService.createSupplier({
        ...formData,
        status: formData.status?.toLowerCase() === "active" ? "active" : "inactive",
      });
      showSuccess("New supplier has been successfully added.");
      navigate("/dashboard/suppliers");
    } catch (error) {
      console.error("Failed to create supplier", error);
      showError(error?.message || "Failed to create supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SupplierForm
      onSubmit={handleSubmit}
      title="Add New Supplier"
      subTitle="Register a new partner or distributor"
      isSubmitting={loading}
    />
  );
}
