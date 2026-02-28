import { useState, useEffect } from "react";
import ExpensesHeader from "../../../components/admin/Expenses/ExpensesHeader";
import ExpensesTable from "../../../components/admin/Expenses/ExpensesTable";
import expenseService from "../../../services/expenseService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";

const extractExpenses = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.expenses)) return payload.expenses;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.expenses)) return payload.data.expenses;

  return [];
};

const normalizeExpense = (expense) => ({
  ...expense,
  name: expense?.name || expense?.description || "Expense",
  category: expense?.category || expense?.categoryName || "Uncategorized",
  categoryName: expense?.categoryName || expense?.category || "Uncategorized",
  amount: Number(expense?.amount ?? 0),
  date: expense?.date || expense?.createdAt,
  supplier: expense?.supplier || expense?.vendor || "",
  paymentMethod: expense?.paymentMethod || "",
  notes: expense?.notes || expense?.description || "",
  isRecurring: Boolean(expense?.isRecurring),
  hasAttachment: Boolean(expense?.hasAttachment || expense?.receipt),
  status: expense?.status || "pending",
});

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await expenseService.getExpenses();
        setExpenses(extractExpenses(response).map(normalizeExpense));
      } catch (error) {
        console.error("Error loading expenses", error);
        showError(error?.message || "Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await confirmDelete("this expense");
    if (result.isConfirmed) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses((prev) => prev.filter((expense) => String(expense.id) !== String(id)));
        showSuccess("Expense deleted successfully");
      } catch (error) {
        console.error("Failed to delete expense", error);
        showError(error?.message || "Failed to delete expense");
      }
    }
  };

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringExpenses = expenses.filter(e => e.isRecurring).reduce((sum, e) => sum + e.amount, 0);
  const oneTimeExpenses = expenses.filter(e => !e.isRecurring).reduce((sum, e) => sum + e.amount, 0);

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.name.toLowerCase().includes(searchLower) ||
      expense.categoryName.toLowerCase().includes(searchLower) ||
      String(expense.paymentMethod || "").toLowerCase().includes(searchLower) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <ExpensesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalExpenses={totalExpenses}
        recurringExpenses={recurringExpenses}
        oneTimeExpenses={oneTimeExpenses}
      />

      <ExpensesTable 
        expenses={filteredExpenses} 
        onDelete={handleDelete}
      />
    </div>
  );
}
