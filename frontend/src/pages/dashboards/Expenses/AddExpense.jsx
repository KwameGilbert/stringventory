import { useNavigate } from "react-router-dom";
import ExpenseForm from "../../../components/admin/Expenses/ExpenseForm";
import expenseService from "../../../services/expenseService";
import { showError, showSuccess } from "../../../utils/alerts";

export default function AddExpense() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await expenseService.createExpense({
        description: formData.name,
        categoryId: formData.expenseCategoryId,
        amount: Number(formData.amount),
        date: formData.date,
        vendor: formData.supplier || undefined,
        paymentMethod: formData.paymentMethod,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
      });

      showSuccess("Expense created successfully");
      navigate("/dashboard/expenses");
    } catch (error) {
      console.error("Failed to create expense", error);
      showError(error?.message || "Failed to create expense");
    }
  };

  return (
    <div className="pb-8 animate-fade-in">
      <ExpenseForm
        onSubmit={handleCreate}
        title="Add Expense"
        subTitle="Record a new operational cost"
      />
    </div>
  );
}
