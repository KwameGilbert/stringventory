import { useEffect, useState } from "react";
import { Clock, Calendar, AlertCircle } from "lucide-react";
import { productService } from "../../../services/productService";

const ExpiringProducts = () => {
  const [data, setData] = useState({ summary: {}, items: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getExpiringProducts({ limit: 50 });
        const payload = response?.data || response || {};
        const products = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.products)
            ? payload.products
            : Array.isArray(payload.data)
              ? payload.data
              : [];

        const normalizedItems = products.map((product) => {
          const expiryDate = product?.expiryDate || product?.expirationDate || null;
          let daysUntilExpiry = Number(product?.daysUntilExpiry ?? NaN);
          if (!Number.isFinite(daysUntilExpiry) && expiryDate) {
            daysUntilExpiry = Math.max(0, Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));
          }

          return {
            name: product?.productName || product?.name || "Product",
            expiryDate: expiryDate || "N/A",
            daysUntilExpiry: Number.isFinite(daysUntilExpiry) ? daysUntilExpiry : 0,
          };
        });

        const summary = {
          days30: normalizedItems.filter((item) => item.daysUntilExpiry <= 30).length,
          days60: normalizedItems.filter((item) => item.daysUntilExpiry <= 60).length,
          days90: normalizedItems.filter((item) => item.daysUntilExpiry <= 90).length,
        };

        setData({ summary, items: normalizedItems.slice(0, 10) });
      } catch (err) {
        console.error(err);
        setData({ summary: {}, items: [] });
      }
    };
    fetchData();
  }, []);

  const summaryCards = [
    { 
      label: "30 days", 
      value: data.summary?.days30 || 0, 
      gradient: "from-red-500 to-rose-600",
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-600"
    },
    { 
      label: "60 days", 
      value: data.summary?.days60 || 0, 
      gradient: "from-orange-400 to-amber-500",
      bg: "from-orange-50 to-amber-50",
      border: "border-orange-200",
      text: "text-orange-600"
    },
    { 
      label: "90 days", 
      value: data.summary?.days90 || 0, 
      gradient: "from-indigo-400 to-emerald-500",
      bg: "from-indigo-50 to-emerald-50",
      border: "border-indigo-200",
      text: "text-indigo-600"
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col hover-lift">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-200">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Expiring Soon</h3>
        </div>
        <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {summaryCards.map((card, idx) => (
          <div 
            key={idx} 
            className={`
              bg-linear-to-br ${card.bg} p-3 rounded-xl text-center 
              border ${card.border} hover:shadow-md transition-all cursor-pointer
              group
            `}
          >
            <p className={`text-2xl font-bold ${card.text} group-hover:scale-110 transition-transform`}>
              {card.value}
            </p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-50 custom-scrollbar">
        {data.items?.map((item, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-rose-50/50 to-pink-50/30 border border-rose-100 hover:from-rose-50 hover:to-pink-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-gray-800 text-sm group-hover:text-rose-600 transition-colors">
                {item.name}
              </span>
            </div>
            <span className="text-xs font-bold text-white bg-linear-to-r from-rose-500 to-pink-500 px-3 py-1 rounded-full shadow-sm">
              {item.expiryDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiringProducts;

