import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExpenseForm from "../../../components/admin/Expenses/ExpenseForm";
import expenseService from "../../../services/expenseService";
import { showError, showSuccess } from "../../../utils/alerts";

const extractExpense = (response) => {
  const payload = response?.data || response || {};
  return payload?.expense || payload?.data?.expense || payload?.data || payload;
};

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await expenseService.getExpenseById(id);
        const found = extractExpense(response);
        if (found) {
          setExpense({
            ...found,
            name: found?.name || found?.description || "",
            expenseCategoryId: found?.expenseCategoryId || found?.categoryId || "",
            paymentMethod: found?.paymentMethod || "",
            supplier: found?.supplier || found?.vendor || "",
            date: found?.date ? String(found.date).split("T")[0] : "",
            notes: found?.notes || "",
          });
        } else {
          console.error("Expense not found");
          showError("Expense not found");
          navigate("/dashboard/expenses");
        }
      } catch (error) {
        console.error("Error loading expense", error);
        showError(error?.message || "Failed to load expense");
        navigate("/dashboard/expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await expenseService.updateExpense(id, {
        description: formData.name,
        categoryId: formData.expenseCategoryId,
        amount: Number(formData.amount),
        date: formData.date,
        vendor: formData.supplier || undefined,
        paymentMethod: formData.paymentMethod,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
        status: formData.status || undefined,
      });

      showSuccess("Expense updated successfully");
      navigate("/dashboard/expenses");
    } catch (error) {
      console.error("Failed to update expense", error);
      showError(error?.message || "Failed to update expense");
    }
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
