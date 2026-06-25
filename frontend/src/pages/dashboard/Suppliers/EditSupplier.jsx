import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supplierService from "../../../services/business/supplierService";
import { showError, showSuccess } from "../../../utils/alerts";
import SupplierForm from "../../../components/dashboard/Suppliers/SupplierForm";

const extractSupplier = (response) => {
  const payload = response?.data || response || {};
  return payload?.supplier || payload?.data?.supplier || payload?.data || payload;
};

export default function EditSupplier() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await supplierService.getSupplierById(id);
        const found = extractSupplier(response);
        if (found?.id) {
          setInitialData({
            ...found,
            status:
              found?.status === "active" || found?.isActive === true
                ? "Active"
                : found?.status === "inactive" || found?.isActive === false
                ? "Inactive"
                : found?.status || "Active",
          });
        } else {
          showError("Supplier not found");
          navigate("/dashboard/suppliers");
        }
      } catch (error) {
        console.error("Error loading supplier", error);
        showError(error?.message || "Failed to load supplier");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await supplierService.updateSupplier(id, {
        ...formData,
        status: formData.status?.toLowerCase() === "active" ? "active" : "inactive",
      });
      showSuccess("Supplier details have been successfully updated.");
      navigate("/dashboard/suppliers");
    } catch (error) {
      console.error("Failed to update supplier", error);
      showError(error?.message || "Failed to update supplier");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <SupplierForm
      initialData={initialData}
      onSubmit={handleSubmit}
      title={`Edit Supplier #${id}`}
      subTitle="Update supplier partner details"
      isSubmitting={submitting}
    />
  );
}
