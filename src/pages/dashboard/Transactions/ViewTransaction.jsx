import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import transactionService from "../../../services/business/transactionService";
import { showError } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";
import TransactionDetails from "./components/TransactionDetails";

export default function ViewTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactionById(id);
      setTransaction(response.data || response);
    } catch (error) {
      console.error("Error fetching transaction", error);
      showError(error?.message || "Failed to load transaction details");
      navigate("/dashboard/transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-fade-in text-gray-400">
        <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4" />
        <p>Loading transaction history...</p>
      </div>
    );
  }

  if (!transaction) return null;

  return <TransactionDetails transaction={transaction} formatPrice={formatPrice} />;
}
