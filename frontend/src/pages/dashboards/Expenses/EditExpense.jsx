import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseForm from "../../../components/admin/Expenses/ExpenseForm";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get("/data/expenses.json");
        const found = response.data.find(e => e.id === parseInt(id));
        if (found) {
          setExpense(found);
        } else {
          console.error("Expense not found");
          navigate("/dashboard/expenses");
        }
      } catch (error) {
        console.error("Error loading expense", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, navigate]);

  const handleUpdate = (formData) => {
    console.log("Updating expense:", formData);
    navigate("/dashboard/expenses");
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-96 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in">
      <ExpenseForm
        initialData={expense}
        onSubmit={handleUpdate}
        title="Edit Expense"
        subTitle={`Update details for expense #${id}`}
      />
    </div>
  );
}
