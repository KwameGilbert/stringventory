import { useState, useEffect } from "react";
import axios from "axios";
import ExpensesHeader from "../../../components/admin/Expenses/ExpensesHeader";
import ExpensesTable from "../../../components/admin/Expenses/ExpensesTable";
import { confirmDelete, showSuccess } from "../../../utils/alerts";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, categoriesRes, pmRes] = await Promise.all([
          axios.get("/data/expenses.json"),
          axios.get("/data/expense-categories.json"),
          axios.get("/data/payment-methods.json")
        ]);
        
        const fetchedExpenses = expensesRes.data;
        const fetchedCategories = categoriesRes.data;
        const fetchedPaymentMethods = pmRes.data;

        const mappedExpenses = fetchedExpenses.map(expense => ({
          ...expense,
          category: fetchedCategories.find(c => c.id === expense.expenseCategoryId)?.name || "Unknown",
          paymentMethod: fetchedPaymentMethods.find(p => p.id === expense.paymentMethodId)?.name || "Unknown"
        }));

        setExpenses(mappedExpenses);
      } catch (error) {
        console.error("Error loading expenses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await confirmDelete("this expense");
    if (result.isConfirmed) {
      setExpenses(expenses.filter(e => e.id !== id));
      showSuccess("Expense deleted successfully");
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
      expense.category.toLowerCase().includes(searchLower) ||
      expense.reference.toLowerCase().includes(searchLower) ||
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
