import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, DollarSign, Package, CheckCircle } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  
  // Checkout State
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/products.json");
        setProducts(response.data);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Assuming product data might not have category names directly in this mock, 
    // but in a real app we'd filter by ID or populated category name. 
    // For now, simple search is efficient.
    return matchesSearch;
  });

  // Cart Logic
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Totals Calculation
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price || 5) * item.quantity, 0), [cart]);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = Math.max(0, subtotal - discount + taxAmount);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    Swal.fire({
      title: 'Confirm Payment',
      text: `Total Amount: ${formatCurrency(total)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Process Payment'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Payment Successful!',
          'Sale has been recorded.',
          'success'
        );
        clearCart();
        setDiscount(0);
      }
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-[calc(100vh-6rem)] -m-6 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Product Grid */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-gray-50/50">
        {/* Search Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
             <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left flex flex-col h-full group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Package size={20} />
                  </div>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.sku || "SKU-???"}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-gray-900">{formatCurrency(product.price || 5)}</span>
                    <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Plus size={14} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Cart */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white h-[400px] lg:h-auto border-t lg:border-t-0 shadow-xl lg:shadow-none z-10">
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-1">
             <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
               <ShoppingCart className="w-5 h-5" />
               Current Sale
             </h2>
             <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{cart.length} items</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/30">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">{formatCurrency(item.price || 5)} per unit</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="font-semibold text-gray-900">{formatCurrency((item.price || 5) * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-rose-500 text-xs hover:underline mt-1">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals Section */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
           {/* Controls */}
           <div className="grid grid-cols-2 gap-3 mb-2">
             <div>
                <label className="text-xs text-gray-500 block mb-1">Discount</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input 
                    type="number" 
                    value={discount} 
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
             </div>
             <div>
                <label className="text-xs text-gray-500 block mb-1">Tax (%)</label>
                <input 
                    type="number" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                  />
             </div>
           </div>
           
           <div className="space-y-1 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900 font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-emerald-600">{formatCurrency(total)}</span>
              </div>
           </div>

           <button
             onClick={handleCheckout}
             disabled={cart.length === 0}
             className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
           >
             <CreditCard size={18} />
             Pay {formatCurrency(total)}
           </button>
        </div>
      </div>
    </div>
  );
}
