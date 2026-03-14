import { useState, useEffect, useMemo } from "react";
import { Save, ArrowLeft, Plus, Trash2, Package, User, DollarSign, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { productService } from "../../../services/productService";
import customerService from "../../../services/customerService";
import orderService from "../../../services/orderService";
import { showError, showSuccess } from "../../../utils/alerts";
import CustomerSelect from "./components/CustomerSelect";
import AddCustomerModal from "./components/AddCustomerModal";

const extractList = (response, key) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload[key])) return payload[key];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.[key])) return payload.data[key];

  return [];
};

const mapCustomer = (customer = {}) => {
  const customerName = customer?.name || `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();
  return {
    ...customer,
    displayName: customerName || "Unknown Customer",
  };
};

const extractCustomer = (response) => {
  const payload = response?.data || response || {};
  return payload?.customer || payload?.data?.customer || payload?.data || payload;
};

const splitName = (fullName = "") => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
};

export default function CreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    items: [],
    discount: 0,
    taxRate: 10,
    paymentMethod: "Cash",
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          productService.getProducts(),
          customerService.getCustomers(),
        ]);

        const mappedProducts = extractList(productsRes, "products").map((product) => ({
          ...product,
          name: product?.name || "Unnamed Product",
          unitPrice: Number(product?.sellingPrice ?? product?.price ?? 0),
        }));

        const mappedCustomers = extractList(customersRes, "customers").map((customer) => {
          return mapCustomer(customer);
        });

        setProducts(mappedProducts);
        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Error loading products", error);
        showError(error?.message || "Failed to load order setup data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) => {
      const name = String(customer.displayName || "").toLowerCase();
      const phone = String(customer.phone || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      return name.includes(query) || phone.includes(query) || email.includes(query);
    });
  }, [customers, customerQuery]);

  const selectCustomer = async (selectedId) => {
    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        customerId: "",
        customer: { ...prev.customer, name: "", email: "", phone: "" },
      }));
      setSelectedCustomer(null);
      return;
    }

    const selectedCust = customers.find((c) => String(c.id) === String(selectedId));
    setSelectedCustomer(selectedCust || null);

    try {
      const response = await customerService.getCustomerById(selectedId);
      const fetchedCustomer = mapCustomer(extractCustomer(response));

      setFormData((prev) => ({
        ...prev,
        customerId: String(selectedId),
        customer: {
          name: fetchedCustomer?.displayName || selectedCust?.displayName || "",
          email: fetchedCustomer?.email || "",
          phone: fetchedCustomer?.phone || "",
        },
      }));
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        customerId: String(selectedId),
        customer: {
          name: selectedCust?.displayName || "",
          email: selectedCust?.email || "",
          phone: selectedCust?.phone || "",
        },
      }));
    }
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [name]: value },
    }));
  };

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find((p) => String(p.id) === String(selectedProduct));
    if (!product) return;

    // Check if product already in items
    const existingIndex = formData.items.findIndex((item) => item.productId === product.id);
    if (existingIndex >= 0) {
      // Update quantity
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += selectedQuantity;
      setFormData((prev) => ({ ...prev, items: newItems }));
    } else {
      // Add new item
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product.id,
            productName: product.name,
            quantity: selectedQuantity,
            unitPrice: Number(product.unitPrice ?? 0),
          },
        ],
      }));
    }
    setSelectedProduct("");
    setSelectedQuantity(1);
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItemQuantity = (index, quantity) => {
    const newItems = [...formData.items];
    newItems[index].quantity = Math.max(1, quantity);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const subtotal = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [formData.items]);

  const tax = useMemo(() => {
    return ((subtotal - formData.discount) * formData.taxRate) / 100;
  }, [subtotal, formData.discount, formData.taxRate]);

  const total = useMemo(() => {
    return subtotal - formData.discount + tax;
  }, [subtotal, formData.discount, tax]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      showError("Please select a customer or add a new one");
      return;
    }

    try {
      setSubmitting(true);
      await orderService.createOrder({
        customerId: formData.customerId,
        customerName: formData.customer.name || undefined,
        customerEmail: formData.customer.email || undefined,
        customerPhone: formData.customer.phone || undefined,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: 0,
        })),
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(formData.discount || 0),
        taxAmount: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        paymentMethod: formData.paymentMethod.toLowerCase().replace(' ', '_'),
        notes: `Payment method: ${formData.paymentMethod}`,
      });

      showSuccess("Sale created successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Error creating order", error);
      showError(error?.message || "Failed to create sale");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6 w-48"></div>
        <div className="bg-white rounded-xl p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 mt-20">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/orders")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Sales</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
        <p className="text-gray-500 text-sm">Fill in the details to create a new sale</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
                <p className="text-xs text-gray-500">Enter customer details</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <CustomerSelect 
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelect={(c) => selectCustomer(c.id)}
                  onOpenAddModal={() => setIsAddCustomerModalOpen(true)}
                  loading={loading}
               />
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Edit Details for this Sale</p>
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.customer.email}
                    onChange={handleCustomerChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm bg-gray-50 hover:bg-white"
                    placeholder="john@email.com"
                />
                </div>
                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Phone <span className="text-rose-500">*</span>
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.customer.phone}
                    onChange={handleCustomerChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm bg-gray-50 hover:bg-white"
                    placeholder="+233 24 123 4567"
                    required
                />
                </div>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-emerald-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sale Items</h3>
                <p className="text-xs text-gray-500">Add products to the sale</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Add Item Row */}
            <div className="flex gap-3">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-sm bg-white"
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.unitPrice || 0)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-24 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-sm text-center"
                placeholder="Qty"
              />
              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProduct}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* Items List */}
            {formData.items.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center w-32">Quantity</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Package size={14} className="text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-center text-sm mx-auto block"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Payment & Summary</h3>
                <p className="text-xs text-gray-500">Payment details and order totals</p>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Payment Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-sm bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Discount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 self-start">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(formData.discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax ({formData.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || formData.items.length === 0 || !formData.customerId}
            className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-900/20"
          >
            <Save size={18} />
            {submitting ? "Saving..." : "Complete Sale"}
          </button>
        </div>
      </form>

      <AddCustomerModal 
        isOpen={isAddCustomerModalOpen} 
        onClose={() => setIsAddCustomerModalOpen(false)} 
        onCustomerAdded={(newCustomer) => {
           const mappedNewCustomer = mapCustomer(newCustomer);
           setCustomers(prev => [...prev, mappedNewCustomer]);
           selectCustomer(mappedNewCustomer.id);
        }}
      />
    </div>
  );
}
