import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../../components/admin/Products/ProductForm";
import axios from "axios";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/products.json");
        const product = response.data.find((p) => p.id === parseInt(id));
        if (product) {
          setData(product);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = (formData) => {
    console.log("Updating product:", formData);
    navigate("/dashboard/products");
  };

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in">
      <ProductForm
        title="Edit Product"
        subTitle={`Update details for ${data.name}`}
        initialData={data}
        onSubmit={handleUpdate}
        isEdit={true}
      />
    </div>
  );
}
