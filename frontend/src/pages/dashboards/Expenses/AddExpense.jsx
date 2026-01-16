import { useNavigate } from "react-router-dom";
import ExpenseForm from "../../../components/admin/Expenses/ExpenseForm";

export default function AddExpense() {
  const navigate = useNavigate();

  const handleCreate = (formData) => {
    // In a real app, this would be an API call
    console.log("Creating expense:", formData);
    navigate("/dashboard/expenses");
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
