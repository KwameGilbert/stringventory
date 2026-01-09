import { useNavigate } from "react-router-dom";
import ProductForm from "../../../components/admin/Products/ProductForm";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    console.log("Creating product:", data);
    // Add API call here
    navigate("/dashboard/products");
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
