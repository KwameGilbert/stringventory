import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../../../components/admin/Expenses/ExpenseForm";
import expenseService from "../../../services/expenseService";
import { showError, showSuccess } from "../../../utils/alerts";

export default function AddExpense() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        description: formData.name,
        expenseCategoryId: formData.expenseCategoryId,
        categoryId: formData.expenseCategoryId,
        amount: Number(formData.amount),
        transactionDate: formData.date,
        date: formData.date,
        vendor: formData.supplier || undefined,
        paymentMethod: formData.paymentMethod,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
        isRecurring: Boolean(formData.isRecurring),
        recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined,
        recurringInterval: formData.isRecurring ? Number(formData.recurringInterval || 1) : undefined,
        recurringEndDate: formData.isRecurring && formData.recurringEndDate ? formData.recurringEndDate : undefined,
      };

      if (formData.attachmentFile) {
        const multipartPayload = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            multipartPayload.append(key, String(value));
          }
        });

        multipartPayload.append("receipt", formData.attachmentFile);
        await expenseService.createExpense(multipartPayload);
      } else {
        await expenseService.createExpense(payload);
      }

      showSuccess("Expense created successfully");
      navigate("/dashboard/expenses");
    } catch (error) {
      console.error("Failed to create expense", error);
      showError(error?.message || "Failed to create expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-8 animate-fade-in">
      <ExpenseForm
        onSubmit={handleCreate}
        title="Add Expense"
        subTitle="Record a new operational cost"
        isSubmitting={submitting}
      />
    </div>
  );
}
