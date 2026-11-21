import { Link } from "react-router-dom";
import { titleize, formatDate, personName } from "../../../../utils/displayFormat";

// The extra detail shown inside each block of the transaction page: fields, item tables and
// totals for the linked order, purchase, refund, expense or stock record, plus the other ledger
// entries for the same record. `formatPrice` is passed in so these stay pure.

const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-50 text-emerald-700",
  received: "bg-emerald-50 text-emerald-700",
  fulfilled: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  partial: "bg-amber-50 text-amber-700",
  partially_fulfilled: "bg-amber-50 text-amber-700",
  ordered: "bg-blue-50 text-blue-700",
  unpaid: "bg-rose-50 text-rose-700",
  failed: "bg-rose-50 text-rose-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const Badge = ({ status, children }) => (
  <span className={`inline-block px-2 py-0.5 rounded-md text-xs ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
    {children || titleize(status)}
  </span>
);

const Fields = ({ children }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
);

const Field = ({ label, children }) => (
  <div>
    <dt className="text-xs text-gray-400 tracking-wide">{label}</dt>
    <dd className="mt-0.5 text-sm text-gray-900 wrap-break-word">{children ?? "—"}</dd>
  </div>
);

const ProductLink = ({ id, name }) =>
  id ? (
    <Link to={`/dashboard/products/${id}`} className="text-gray-900 hover:text-blue-600 hover:underline">{name}</Link>
  ) : (
    <span className="text-gray-500">{name}</span>
  );

const ItemsTable = ({ columns, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-xs text-gray-400">
          {columns.map((column) => (
            <th key={column.key} className={`py-2 font-normal ${column.align === "right" ? "text-right" : "text-left"}`}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className={`py-2.5 text-gray-700 ${column.align === "right" ? "text-right" : "text-left"}`}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TotalsRow = ({ label, value, strong = false, negative = false }) => (
  <div className={`flex justify-between text-sm ${strong ? "pt-2 border-t border-gray-100 font-semibold text-gray-900" : "text-gray-600"}`}>
    <span>{label}</span>
    <span className={negative ? "text-rose-600" : undefined}>{value}</span>
  </div>
);

// ---------- one per kind of linked record ----------

export const OrderDetails = ({ order, formatPrice, refundedTotal = 0 }) => {
  const currency = order.currency;
  const items = order.items || [];
  const anyRefunded = items.some((item) => Number(item.refundedQuantity) > 0);
  const subtotal = Number(order.discountedPrice ?? items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0));
  const discount = Number(order.discountAmount || 0);
  const total = Number(order.discountedTotalPrice ?? subtotal - discount);

  const columns = [
    { key: "product", label: "Product" },
    { key: "quantity", label: "Qty", align: "right" },
    { key: "unitPrice", label: "Unit price", align: "right" },
    ...(anyRefunded ? [{ key: "refunded", label: "Refunded", align: "right" }] : []),
    { key: "amount", label: "Amount", align: "right" },
  ];
  const rows = items.map((item) => ({
    product: <ProductLink id={item.productId} name={item.product?.name || "Deleted product"} />,
    quantity: item.quantity,
    unitPrice: formatPrice(item.sellingPrice, currency),
    refunded: Number(item.refundedQuantity) > 0 ? item.refundedQuantity : "—",
    amount: formatPrice(item.totalPrice, currency),
  }));

  return (
    <>
      <Fields>
        <Field label="Customer phone">{order.customer?.phone}</Field>
        <Field label="Created by">{personName(order.creator)}</Field>
        <Field label="Ordered on">{formatDate(order.createdAt, true)}</Field>
      </Fields>

      {items.length > 0 && <ItemsTable columns={columns} rows={rows} />}

      <div className="space-y-2 max-w-sm ml-auto">
        <TotalsRow label="Subtotal" value={formatPrice(subtotal, currency)} />
        {discount > 0 && <TotalsRow label="Discount" value={`-${formatPrice(discount, currency)}`} />}
        <TotalsRow label="Order total" value={formatPrice(total, currency)} strong />
        {refundedTotal > 0 && (
          <>
            <TotalsRow label="Refunded" value={`-${formatPrice(refundedTotal, currency)}`} negative />
            <TotalsRow label="Net of refunds" value={formatPrice(total - refundedTotal, currency)} strong />
          </>
        )}
      </div>
    </>
  );
};

export const RefundDetails = ({ refund, refundItems = [], formatPrice }) => {
  const currency = refund.currency;
  const columns = [
    { key: "product", label: "Product" },
    { key: "quantity", label: "Qty", align: "right" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "stock", label: "Stock", align: "right" },
  ];
  const rows = refundItems.map((item) => ({
    product: <ProductLink id={item.productId} name={item.productName} />,
    quantity: item.quantity,
    amount: formatPrice(item.amount, currency),
    stock: item.restocked ? <Badge status="completed">Restocked</Badge> : <Badge status="failed">Lost</Badge>,
  }));

  return (
    <>
      <Fields>
        <Field label="Status"><Badge status={refund.refundStatus} /></Field>
        <Field label="Refund type">{titleize(refund.refundType)}</Field>
        <Field label="Amount refunded">{formatPrice(refund.refundAmount, currency)}</Field>
        <Field label="Requested by">{personName(refund.creator)}</Field>
        <Field label="Notes">{refund.notes}</Field>
      </Fields>

      {refundItems.length > 0 && <ItemsTable columns={columns} rows={rows} />}
    </>
  );
};

export const PurchaseDetails = ({ purchase, formatPrice }) => {
  const currency = purchase.currency;
  const items = purchase.items || [];
  const columns = [
    { key: "product", label: "Product" },
    { key: "quantity", label: "Qty", align: "right" },
    { key: "costPrice", label: "Cost price", align: "right" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "expiry", label: "Expires", align: "right" },
  ];
  const rows = items.map((item) => ({
    product: <ProductLink id={item.productId} name={item.product?.name || "Deleted product"} />,
    quantity: item.quantity,
    costPrice: formatPrice(item.costPrice, currency),
    amount: formatPrice(item.totalPrice, currency),
    expiry: formatDate(item.expiryDate),
  }));

  return (
    <>
      <Fields>
        <Field label="Payment status"><Badge status={purchase.paymentStatus} /></Field>
        <Field label="Payment method">{purchase.paymentMethod ? titleize(purchase.paymentMethod) : null}</Field>
        <Field label="Waybill number">{purchase.waybillNumber}</Field>
        <Field label="Purchase date">{formatDate(purchase.purchaseDate || purchase.createdAt)}</Field>
        <Field label="Received">{formatDate(purchase.receivedDate)}</Field>
        <Field label="Payment due">{formatDate(purchase.dueDate)}</Field>
        <Field label="Created by">{personName(purchase.creator)}</Field>
        <Field label="Notes">{purchase.notes}</Field>
      </Fields>

      {items.length > 0 && <ItemsTable columns={columns} rows={rows} />}

      <div className="space-y-2 max-w-sm ml-auto">
        <TotalsRow label="Subtotal" value={formatPrice(purchase.subtotal ?? 0, currency)} />
        {Number(purchase.tax) > 0 && <TotalsRow label="Tax" value={formatPrice(purchase.tax, currency)} />}
        {Number(purchase.shippingCost) > 0 && <TotalsRow label="Shipping" value={formatPrice(purchase.shippingCost, currency)} />}
        <TotalsRow label="Purchase total" value={formatPrice(purchase.totalAmount, currency)} strong />
      </div>
    </>
  );
};

export const ExpenseDetails = ({ expense }) => {
  const evidence = expense.evidence;
  const evidenceIsLink = typeof evidence === "string" && /^(https?:)?\//.test(evidence);

  return (
    <Fields>
      <Field label="Status"><Badge status={expense.status} /></Field>
      <Field label="Expense date">{formatDate(expense.transactionDate)}</Field>
      <Field label="Reference">{expense.reference}</Field>
      <Field label="Recorded by">{personName(expense.creator)}</Field>
      <Field label="Notes">{expense.notes}</Field>
      <Field label="Evidence">
        {evidenceIsLink ? (
          <a href={evidence} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View evidence</a>
        ) : (
          evidence || null
        )}
      </Field>
    </Fields>
  );
};

export const AdjustmentDetails = ({ adjustment }) => (
  <>
    <Fields>
      <Field label="SKU">{adjustment.product?.sku}</Field>
      <Field label="Stock status">{titleize(adjustment.status)}</Field>
      <Field label="Last updated">{formatDate(adjustment.lastUpdated, true)}</Field>
    </Fields>
    <p className="text-xs text-gray-400">
      A manual adjustment has no cash value, and the size of the change is not stored on the ledger entry.
    </p>
  </>
);

// ---------- other ledger entries for the same record ----------

export const RelatedTransactions = ({ transactions = [], typeLabels = {}, formatPrice }) => {
  if (transactions.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-gray-400 tracking-wide mb-2">Related Ledger Entries</p>
      <ul className="divide-y divide-gray-50 border-t border-b border-gray-50">
        {transactions.map((txn) => (
          <li key={txn.id}>
            <Link
              to={`/dashboard/transactions/${txn.id}`}
              className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm text-gray-900">
                  TX-{txn.id} <span className="text-gray-500">· {typeLabels[txn.transactionType] || titleize(txn.transactionType)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(txn.createdAt, true)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge status={txn.status} />
                <span className={`text-sm ${Number(txn.amount) < 0 ? "text-rose-600" : "text-gray-900"}`}>
                  {Number(txn.amount) < 0 ? "-" : ""}{formatPrice(Math.abs(Number(txn.amount) || 0), txn.currency)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
