import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../../components/admin/Products/ProductForm";
import { productService } from "../../../services/productService";
import { showError, showSuccess } from "../../../utils/alerts";

const extractProduct = (response) => {
  const payload = response?.data || response || {};
  return payload?.product || payload?.data?.product || payload?.data || payload;
};

const isForbiddenError = (error) => {
  const statusCode = error?.statusCode || error?.status;
  const message = String(error?.message || "").toLowerCase();
  return statusCode === 403 || message.includes("insufficient permissions") || message.includes("forbidden");
};

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPermissionDenied(false);
        const response = await productService.getProductById(id);
        const product = extractProduct(response);
        if (product?.id) {
          setData({
            ...product,
            code: product.code || product.sku || "",
            sku: product.sku || product.code || "",
            costPrice: Number(product.costPrice ?? product.cost ?? 0),
            sellingPrice: Number(product.sellingPrice ?? product.price ?? 0),
            currentStock: Number(product.currentStock ?? product.quantity ?? 0),
            reorderThreshold: Number(product.reorderThreshold ?? product.reorderLevel ?? 0),
            unit: product.unit || product.unitOfMeasure || "piece",
          });
        }
      } catch (error) {
        console.error("Error fetching product", error);
        if (isForbiddenError(error)) {
          setPermissionDenied(true);
          return;
        }
        showError(error?.message || "Failed to fetch product");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await productService.updateProduct(id, {
        ...formData,
        unit: formData.unit || formData.unitOfMeasure || formData.unitOfMeasurementId || "piece",
        cost: Number(formData.costPrice ?? formData.cost ?? 0),
        price: Number(formData.sellingPrice ?? formData.price ?? 0),
        quantity: Number(formData.currentStock ?? formData.quantity ?? 0),
        reorderLevel: Number(formData.reorderThreshold ?? formData.reorderLevel ?? 0),
      });
      showSuccess("Product updated successfully");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Failed to update product", error);
      showError(error?.message || "Failed to update product");
    }
  };

  if (permissionDenied) {
    return (
      <div className="py-16 animate-fade-in">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Insufficient permissions</h2>
          <p className="text-sm text-gray-500">You do not have access to edit this product. Contact your administrator for the required permissions.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

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
