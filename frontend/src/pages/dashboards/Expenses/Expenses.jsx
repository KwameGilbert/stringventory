import { useState, useEffect } from "react";
import ExpensesHeader from "../../../components/admin/Expenses/ExpensesHeader";
import ExpensesTable from "../../../components/admin/Expenses/ExpensesTable";
import expenseService from "../../../services/expenseService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { useCurrency } from "../../../utils/currencyUtils";

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
  name: expense?.name || expense?.description || expense?.category?.name || "Expense",
  category: expense?.category?.name || expense?.category || "Uncategorized",
  categoryName: expense?.category?.name || expense?.category || "Uncategorized",
  amount: Number(expense?.amount ?? 0),
  date: expense?.transactionDate || expense?.date || expense?.createdAt,
  paymentMethod: expense?.paymentMethod || "",
  notes: expense?.notes || expense?.description || "",
  isRecurring: Boolean(expense?.isRecurring || expense?.expenseScheduleId),
  hasAttachment: Boolean(expense?.hasAttachment || expense?.receipt || expense?.evidence),
  status: expense?.status || "pending",
  createdBy: expense?.creator 
    ? `${expense.creator.firstName || ""} ${expense.creator.lastName || ""}`.trim() 
    : "System",
});

export default function Expenses() {
  const { formatPrice } = useCurrency();
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
      String(expense.createdBy || "").toLowerCase().includes(searchLower) ||
      (expense.notes && expense.notes.toLowerCase().includes(searchLower))
    );
  });

  const handleExportExcel = () => {
    if (filteredExpenses.length === 0) return;

    const dataToExport = filteredExpenses.map((e) => ({
      Date: e.date ? new Date(e.date).toLocaleDateString("en-GB") : "—",
      Name: e.name || "—",
      Category: e.categoryName || "Uncategorized",
      Amount: Number(e.amount || 0).toFixed(2),
      Currency: e.currency || "GHS",
      Method: e.paymentMethod || "—",
      "Created By": e.createdBy || "System",
      Notes: e.notes || "—",
    }));

    exportToExcel(dataToExport, "stringventory_expenses", "Expenses");
  };

  const handleExportPDF = async () => {
    if (filteredExpenses.length === 0) return;

    const tableData = {
      headers: ["Date", "Expense", "Category", "Amount", "Method"],
      rows: filteredExpenses.map((e) => [
        e.date ? new Date(e.date).toLocaleDateString("en-GB") : "—",
        e.name || "—",
        e.categoryName || "—",
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
          { label: "Total Expenditure", value: formatPrice(totalExpenses), bold: true },
          { label: "Recurring Total", value: formatPrice(recurringExpenses), color: 'emerald' },
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
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6 ">
      <ExpensesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalExpenses={totalExpenses}
        recurringExpenses={recurringExpenses}
        oneTimeExpenses={oneTimeExpenses}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      <ExpensesTable 
        expenses={filteredExpenses} 
        onDelete={handleDelete}
      />
    </div>
  );
}
