import { useState, useEffect } from "react";
import axios from "axios";
import CategoryHeader from "../../../components/admin/Categories/CategoryHeader";
import CategoryGrid from "../../../components/admin/Categories/CategoryGrid";
import CategoryList from "../../../components/admin/Categories/CategoryList";

export default function Categories() {
  const [view, setView] = useState('grid');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now we'll import the local JSON or fetch it
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/data/categories.json');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    }
    fetchCategories();
  }, []);

  const handleToggleStatus = (id) => {
    setCategories(prev => prev.map(cat => 
        cat.id === id 
            ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active' }
            : cat
    ));
  };

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <CategoryHeader view={view} setView={setView} />
      
      {view === 'grid' ? (
        <CategoryGrid categories={categories} onToggleStatus={handleToggleStatus} />
      ) : (
        <CategoryList categories={categories} onToggleStatus={handleToggleStatus} />
      )}
    </div>
  );
}
