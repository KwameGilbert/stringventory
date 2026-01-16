import { useState, useEffect } from "react";
import axios from "axios";
import CategoryHeader from "../../../components/admin/Categories/CategoryHeader";
import CategoryGrid from "../../../components/admin/Categories/CategoryGrid";
import CategoryList from "../../../components/admin/Categories/CategoryList";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function Categories() {
  const [view, setView] = useState('list');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/data/categories.json');
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleStatus = (id) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
        : cat
    ));
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete("this category");
    if (result.isConfirmed) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      showSuccess("Category deleted successfully");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <CategoryHeader view={view} setView={setView} totalCategories={categories.length} />
      
      {view === 'grid' ? (
        <CategoryGrid categories={categories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      ) : (
        <CategoryList categories={categories} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      )}
    </div>
  );
}

