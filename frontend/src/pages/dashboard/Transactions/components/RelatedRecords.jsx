import { Link } from "react-router-dom";
import { titleize, formatDate, personName } from "./format";

// Panels for the records a ledger entry points at: order, refund, purchase, expense and stock
// adjustment, plus the other ledger entries tied to the same record. `formatPrice` is passed in
// so the panels stay pure.

const customerName = (customer) => personName(customer) || customer?.businessName?.trim() || null;

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

export const Badge = ({ status, children }) => (
  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
    {children || titleize(status)}
  </span>
);

const Field = ({ label, children }) => (
  <div>
    <dt className="text-xs text-gray-500">{label}</dt>
    <dd className="mt-0.5 text-sm text-gray-900 wrap-break-word">{children ?? "—"}</dd>
  </div>
);

const Fields = ({ children }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
);

const RecordCard = ({ title, to, linkLabel, badges = [], date, children }) => (
  <section className="bg-white rounded-xl border border-gray-100">
    <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {to ? (
          <Link to={to} className="text-sm text-blue-600 hover:underline">{linkLabel}</Link>
        ) : (
          linkLabel && <span className="text-sm text-gray-700">{linkLabel}</span>
        )}
        {badges.map((badge) => badge && <Badge key={badge} status={badge} />)}
      </div>
      {date && <span className="text-xs text-gray-500">{date}</span>}
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </section>
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
        <tr className="border-b border-gray-100 text-xs text-gray-500">
          {columns.map((column) => (
            <th key={column.key} className={`py-2 font-medium ${column.align === "right" ? "text-right" : "text-left"}`}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className={`py-2.5 ${column.align === "right" ? "text-right" : "text-left"} text-gray-700`}>
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

// ---------- records ----------

export const OrderRecord = ({ order, formatPrice, heading = "Order", refundedTotal = 0 }) => {
  const currency = order.currency;
  const items = order.items || [];
  const anyRefunded = items.some((item) => Number(item.refundedQuantity) > 0);
  const subtotal = Number(order.discountedPrice ?? items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0));
  const discount = Number(order.discountAmount || 0);
  const total = Number(order.discountedTotalPrice ?? subtotal - discount);
  const name = customerName(order.customer);

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
    <RecordCard
      title={heading}
      to={`/dashboard/orders/${order.id}`}
      linkLabel={order.orderNumber}
      badges={[order.status]}
      date={formatDate(order.createdAt, true)}
    >
      <Fields>
        <Field label="Customer">
          {order.customerId && name ? (
            <Link to={`/dashboard/customers/${order.customerId}`} className="text-blue-600 hover:underline">{name}</Link>
          ) : (
            name || "Walk-in customer"
          )}
        </Field>
        <Field label="Customer phone">{order.customer?.phone}</Field>
        <Field label="Created by">{personName(order.creator)}</Field>
        <Field label="Notes">{order.notes}</Field>
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
    </RecordCard>
  );
};

export const RefundRecord = ({ refund, refundItems = [], formatPrice }) => {
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
    <RecordCard
      title="Refund"
      to={`/dashboard/refunds/${refund.id}`}
      linkLabel={`#${refund.id}`}
      badges={[refund.refundStatus]}
      date={formatDate(refund.createdAt, true)}
    >
      <Fields>
        <Field label="Original order">
          {refund.order ? (
            <Link to={`/dashboard/orders/${refund.order.id}`} className="text-blue-600 hover:underline">{refund.order.orderNumber}</Link>
          ) : null}
        </Field>
        <Field label="Refund type">{titleize(refund.refundType)}</Field>
        <Field label="Amount refunded">{formatPrice(refund.refundAmount, currency)}</Field>
        <Field label="Reason">{refund.refundReason ? titleize(refund.refundReason) : "No reason given"}</Field>
        <Field label="Requested by">{personName(refund.creator)}</Field>
        <Field label="Notes">{refund.notes}</Field>
      </Fields>

      {refundItems.length > 0 && <ItemsTable columns={columns} rows={rows} />}
    </RecordCard>
  );
};

export const PurchaseRecord = ({ purchase, formatPrice }) => {
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
    <RecordCard
      title="Purchase"
      to={`/dashboard/purchases/${purchase.id}`}
      linkLabel={purchase.purchaseNumber}
      badges={[purchase.status, purchase.paymentStatus]}
      date={formatDate(purchase.purchaseDate || purchase.createdAt)}
    >
      <Fields>
        <Field label="Supplier">
          {purchase.supplier ? (
            <Link to={`/dashboard/suppliers/${purchase.supplierId}`} className="text-blue-600 hover:underline">{purchase.supplier.name}</Link>
          ) : null}
        </Field>
        <Field label="Batch number">{purchase.batchNumber}</Field>
        <Field label="Waybill number">{purchase.waybillNumber}</Field>
        <Field label="Payment method">{titleize(purchase.paymentMethod)}</Field>
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
    </RecordCard>
  );
};

export const ExpenseRecord = ({ expense, formatPrice }) => {
  const evidence = expense.evidence;
  const evidenceIsLink = typeof evidence === "string" && /^(https?:)?\//.test(evidence);

  return (
    <RecordCard
      title="Expense"
      to={`/dashboard/expenses/${expense.id}`}
      linkLabel={`#${expense.id}`}
      badges={[expense.status]}
      date={formatDate(expense.transactionDate)}
    >
      <Fields>
        <Field label="Category">{expense.category?.name}</Field>
        <Field label="Amount">{formatPrice(expense.amount, expense.currency)}</Field>
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
    </RecordCard>
  );
};

export const AdjustmentRecord = ({ adjustment }) => (
  <RecordCard title="Stock adjustment" date={formatDate(adjustment.lastUpdated, true)}>
    <Fields>
      <Field label="Product">
        {adjustment.product ? <ProductLink id={adjustment.productId} name={adjustment.product.name} /> : null}
      </Field>
      <Field label="SKU">{adjustment.product?.sku}</Field>
      <Field label="Stock on hand now">{adjustment.quantity} units</Field>
      <Field label="Stock status">{titleize(adjustment.status)}</Field>
    </Fields>
    <p className="text-xs text-gray-500">
      A manual adjustment has no cash value, and the size of the change is not stored on the ledger entry.
    </p>
  </RecordCard>
);

// ---------- other ledger entries for the same record ----------

export const RelatedTransactions = ({ transactions = [], typeLabels = {}, formatPrice }) => {
  if (transactions.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Related ledger entries</h3>
      </div>
      <ul className="divide-y divide-gray-50">
        {transactions.map((txn) => (
          <li key={txn.id}>
            <Link
              to={`/dashboard/transactions/${txn.id}`}
              className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm text-gray-900">
                  TX-{txn.id} <span className="text-gray-500">· {typeLabels[txn.transactionType] || titleize(txn.transactionType)}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(txn.createdAt, true)}</p>
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
    </section>
  );
};
