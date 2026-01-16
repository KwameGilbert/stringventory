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
        const response = await axios.get("/data/expenses.json");
        setExpenses(response.data);
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
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.name.toLowerCase().includes(searchLower) ||
      expense.categoryName.toLowerCase().includes(searchLower) ||
      expense.paymentMethod.toLowerCase().includes(searchLower) ||
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
        paidExpenses={paidExpenses}
        pendingExpenses={pendingExpenses}
      />

      <ExpensesTable 
        expenses={filteredExpenses} 
        onDelete={handleDelete}
      />
    </div>
  );
}
