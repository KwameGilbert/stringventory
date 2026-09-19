import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, ShoppingBag, RotateCcw, CreditCard, FileText, AlertTriangle, Package, Info } from "lucide-react";
import {
  Badge,
  OrderRecord,
  RefundRecord,
  PurchaseRecord,
  ExpenseRecord,
  AdjustmentRecord,
  RelatedTransactions,
} from "./RelatedRecords";
import { formatDate, titleize } from "./format";

const transactionTypeConfig = {
  order: {
    label: "Order",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Revenue from a sale"
  },
  sale: {
    label: "Sale",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    description: "Revenue from an order"
  },
  refunds: {
    label: "Refund",
    icon: RotateCcw,
    color: "text-rose-600",
    bg: "bg-rose-50",
    description: "Amount paid back to a customer"
  },
  expense: {
    label: "Expense",
    icon: CreditCard,
    color: "text-amber-600",
    bg: "bg-amber-50",
    description: "Business expense"
  },
  purchase: {
    label: "Purchase",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    description: "Stock bought from a supplier"
  },
  stock_loss: {
    label: "Stock loss",
    icon: AlertTriangle,
    color: "text-gray-600",
    bg: "bg-gray-100",
    description: "Cost of refunded stock that was not restocked"
  },
  adjustment: {
    label: "Stock adjustment",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    description: "Manual change to stock on hand"
  }
};

const typeLabels = Object.fromEntries(Object.entries(transactionTypeConfig).map(([key, config]) => [key, config.label]));

const DetailRow = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-3 text-sm">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-gray-900 text-right wrap-break-word min-w-0">{children}</span>
  </div>
);

export default function TransactionDetails({ transaction, formatPrice }) {
  const type = transactionTypeConfig[transaction.transactionType] || { label: titleize(transaction.transactionType), icon: Info, color: "text-gray-500", bg: "bg-gray-50" };
  const TypeIcon = type.icon;

  const amount = Number(transaction.amount) || 0;
  const isStockLoss = transaction.transactionType === "stock_loss";
  const direction = isStockLoss ? "Stock written off (no cash moved)" : amount > 0 ? "Money in" : amount < 0 ? "Money out" : "No cash movement";
  const amountColor = isStockLoss ? "text-gray-700" : amount < 0 ? "text-rose-600" : amount > 0 ? "text-emerald-600" : "text-gray-700";

  const related = transaction.relatedTransactions || [];
  const { order, refund, purchase, expense, adjustment } = transaction;
  const hasRecord = Boolean(order || refund || purchase || expense || adjustment);

  // Refunds already paid out on the linked order, this entry included
  const refundedOnOrder = [transaction, ...related]
    .filter((entry) => entry.transactionType === "refunds" && entry.status === "completed" && order && entry.orderId === order.id)
    .reduce((sum, entry) => sum + Math.abs(Number(entry.amount) || 0), 0);

  const links = [
    order && { label: "Order", text: order.orderNumber, to: `/dashboard/orders/${order.id}` },
    refund && { label: "Refund", text: `#${refund.id}`, to: `/dashboard/refunds/${refund.id}` },
    purchase && { label: "Purchase", text: purchase.purchaseNumber, to: `/dashboard/purchases/${purchase.id}` },
    expense && { label: "Expense", text: `#${expense.id}`, to: `/dashboard/expenses/${expense.id}` },
    adjustment?.product && { label: "Product", text: adjustment.product.name, to: `/dashboard/products/${adjustment.productId}` },
  ].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Back link */}
      <Link
        to="/dashboard/transactions"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group px-1"
      >
        <span className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </span>
        <span className="text-sm font-medium">Back to ledger</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${type.bg} ${type.color}`}>
              <TypeIcon size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">TX-{transaction.id}</h1>
                <Badge status={transaction.status || "pending"} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {type.label}{type.description ? ` · ${type.description}` : ""}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} className="text-gray-400" /> {formatDate(transaction.createdAt, true)}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500">{direction}</p>
            <p className={`text-4xl font-semibold ${amountColor}`}>
              {formatPrice(Math.abs(amount), transaction.currency)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Related records */}
        <div className="lg:col-span-2 space-y-6">
          {refund && <RefundRecord refund={refund} refundItems={transaction.refundItems} formatPrice={formatPrice} />}
          {order && (
            <OrderRecord
              order={order}
              formatPrice={formatPrice}
              heading={refund ? "Original order" : "Order"}
              refundedTotal={refundedOnOrder}
            />
          )}
          {purchase && <PurchaseRecord purchase={purchase} formatPrice={formatPrice} />}
          {expense && <ExpenseRecord expense={expense} formatPrice={formatPrice} />}
          {adjustment && <AdjustmentRecord adjustment={adjustment} />}

          {!hasRecord && (
            <section className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500">
                This ledger entry is not linked to an order, purchase, expense, refund or stock record.
              </p>
            </section>
          )}

          <RelatedTransactions transactions={related} typeLabels={typeLabels} formatPrice={formatPrice} />
        </div>

        {/* Details */}
        <section className="bg-white rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Details</h3>
          </div>
          <div className="px-6 divide-y divide-gray-50">
            <DetailRow label="Reference">
              <span className="font-mono">TX_REC_{String(transaction.id).padStart(6, "0")}</span>
            </DetailRow>
            <DetailRow label="Type">{type.label}</DetailRow>
            <DetailRow label="Status">{titleize(transaction.status)}</DetailRow>
            <DetailRow label="Payment method">{transaction.paymentMethod ? titleize(transaction.paymentMethod) : "Not specified"}</DetailRow>
            <DetailRow label="Currency">{transaction.currency || "—"}</DetailRow>
            <DetailRow label="Recorded">{formatDate(transaction.createdAt, true)}</DetailRow>
          </div>

          {links.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Linked records</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={`${link.label}-${link.to}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">{link.label}</span>
                    <Link to={link.to} className="text-blue-600 hover:underline text-right wrap-break-word min-w-0">{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
