import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../../components/admin/Categories/CategoryForm";
import axios from "axios";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
     // Simulate fetching data
     const fetchData = async () => {
         try {
             const response = await axios.get('/data/categories.json');
             const category = response.data.find(c => c.id === parseInt(id));
             if (category) {
                 setData(category);
             }
         } catch (error) {
             console.error("Error fetching category", error);
         }
     }
     fetchData();
  }, [id]);

  const handleUpdate = (formData) => {
    console.log("Updating category:", formData);
    // Add API call here
    navigate("/dashboard/categories");
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="pb-8 animate-fade-in">
        <CategoryForm 
            title="Edit Category"
            subTitle={`Edit details for ${data.name}`}
            initialData={data}
            onSubmit={handleUpdate}
        />
    </div>
  );
}
