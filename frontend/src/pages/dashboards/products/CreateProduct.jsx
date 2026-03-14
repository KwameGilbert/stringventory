import { useNavigate } from "react-router-dom";
import ProductForm from "../../../components/admin/Products/ProductForm";
import { productService } from "../../../services/productService";
import { showError, showSuccess } from "../../../utils/alerts";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await productService.createProduct({
        ...data,
        unit: data.unit || data.unitOfMeasure || data.unitOfMeasurementId || "piece",
        cost: Number(data.costPrice ?? data.cost ?? 0),
        price: Number(data.sellingPrice ?? data.price ?? 0),
        quantity: Number(data.currentStock ?? data.quantity ?? 0),
        reorderLevel: Number(data.reorderThreshold ?? data.reorderLevel ?? 0),
      });
      showSuccess("Product created successfully");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Failed to create product", error);
      showError(error?.message || "Failed to create product");
    }
  };

  return (
    <div className="pb-8 animate-fade-in">
      <ProductForm 
        title="Add New Product"
        subTitle="Create a new product in your inventory"
        onSubmit={handleCreate}
      />
    </div>
  );
}
