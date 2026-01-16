import { useState, useEffect } from "react";
import axios from "axios";
import { TrendingUp, Image } from "lucide-react";

const TopProducts = ({ dateRange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/top-products.json");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    return activeTab === "revenue" ? b.revenue - a.revenue : b.volume - a.volume;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Top Products</h3>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "revenue"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("volume")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "volume"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-gray-50">
          {sortedProducts.map((product, index) => (
            <div key={product.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
              {/* Rank */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? "bg-amber-100 text-amber-700" :
                index === 1 ? "bg-gray-200 text-gray-600" :
                index === 2 ? "bg-orange-100 text-orange-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {index + 1}
              </div>

              {/* Product Image */}
              <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-400">{product.category}</p>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {activeTab === "revenue" ? formatCurrency(product.revenue) : product.volume}
                </p>
                <p className="text-xs text-gray-400">
                  {activeTab === "revenue" ? "revenue" : "units sold"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
