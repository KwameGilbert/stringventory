import { useState, useEffect, useMemo } from "react";
import ExpensesHeader from "../../../components/admin/Expenses/ExpensesHeader";
import ExpensesTable from "../../../components/admin/Expenses/ExpensesTable";
import expenseService from "../../../services/expenseService";
import { showError, showSuccess, confirmDelete } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { useCurrency } from "../../../utils/currencyUtils";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses();
      const data = response.data || response;
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    const result = await confirmDelete("this expense record");
    if (result.isConfirmed) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(expenses.filter((expense) => expense.id !== id));
        showSuccess("Expense deleted successfully");
      } catch (error) {
        console.error("Error deleting expense:", error);
        showError("Failed to delete expense");
      }
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const category = typeof expense.category === 'object' ? expense.category?.name : expense.category;
      const searchTarget = `${category} ${expense.reference} ${expense.notes}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  }, [expenses, searchQuery]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    const recurring = filteredExpenses
      .filter(exp => exp.isRecurring)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
    const oneTime = total - recurring;

    return { total, recurring, oneTime };
  }, [filteredExpenses]);

  const handleExportExcel = () => {
    if (filteredExpenses.length === 0) return;

    try {
      const dataToExport = filteredExpenses.map((e) => ({
        Date: e.date ? new Date(e.date).toLocaleDateString("en-GB") : "—",
        Name: e.name || "—",
        Category: typeof e.category === 'object' ? e.category?.name : e.category || "—",
        Amount: Number(e.amount || 0).toFixed(2),
        Currency: e.currency || "GHS",
        Method: e.paymentMethod || "—",
        Reference: e.reference || "—",
        "Created By": e.createdBy || "System",
        Notes: e.notes || "—",
      }));

      exportToExcel(dataToExport, "stringventory_expenses", "Expenses");
    } catch (error) {
      console.error("Excel Export Error:", error);
      showError("Failed to generate Excel report");
    }
  };

  const handleExportPDF = async () => {
    if (filteredExpenses.length === 0) return;

    const tableData = {
      headers: ["Date", "Category", "Reference", "Amount", "Method"],
      rows: filteredExpenses.map((e) => [
        e.date ? new Date(e.date).toLocaleDateString("en-GB") : "—",
        typeof e.category === 'object' ? e.category?.name : e.category || "—",
        e.reference || "—",
        `${e.currency || "GHS"} ${Number(e.amount || 0).toFixed(2)}`,
        e.paymentMethod || "—",
      ]),
    };

    try {
      await exportToPDF({
        title: "Company Expense Report",
        subtitle: `Generated on ${new Date().toLocaleDateString("en-GB")} for ${filteredExpenses.length} expense(s)`,
        fileName: "stringventory_expenses",
        table: tableData,
        totals: [
          { label: "Total Expenditure", value: formatPrice(stats.total), bold: true },
          { label: "Recurring Total", value: formatPrice(stats.recurring), color: 'emerald' },
        ],
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="px-1 sm:px-4 md:px-0 pb-8 animate-fade-in space-y-6">
      <ExpensesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalExpenses={stats.total}
        recurringExpenses={stats.recurring}
        oneTimeExpenses={stats.oneTime}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
      
      <ExpensesTable 
        expenses={filteredExpenses} 
        onDelete={handleDeleteExpense} 
      />
    </div>
  );
};

export default Expenses;
