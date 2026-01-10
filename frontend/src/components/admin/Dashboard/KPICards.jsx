import { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";

const KPICards = ({ dateRange }) => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await axios.get("/data/dashboard-stats.json");
        // Get the key KPIs: Sales, Expenses, Net Revenue, Orders, Low Stock
        const keyKPIs = response.data.filter((stat) =>
          ["Gross Revenue", "Total Expenses", "Net Revenue", "Total Orders", "Low Stock Alert"].includes(stat.title)
        );
        setKpis(keyKPIs);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, [dateRange]);

  const getIcon = (iconName) => {
    const icons = {
      DollarSign,
      ShoppingCart,
      TrendingUp,
      AlertTriangle,
      Activity: DollarSign,
    };
    return icons[iconName] || DollarSign;
  };

  const getGradient = (color) => {
    const gradients = {
      emerald: "from-emerald-500 to-teal-600",
      orange: "from-orange-500 to-red-600",
      red: "from-red-500 to-rose-600",
      blue: "from-blue-500 to-indigo-600",
      slate: "from-slate-500 to-gray-600",
    };
    return gradients[color] || gradients.emerald;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        Key Performance Indicators
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = getIcon(kpi.icon);
          const isAlert = kpi.trend === "alert";
          const isUp = kpi.trend === "up";
          const isDown = kpi.trend === "down";

          return (
            <div
              key={kpi.id}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(kpi.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="relative mb-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${getGradient(kpi.color)} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Value */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{kpi.title}</p>

                {/* Trend Badge */}
                {kpi.change && (
                  <div className="flex items-center gap-1">
                    {isUp && (
                      <>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">
                          {kpi.change}
                        </span>
                      </>
                    )}
                    {isDown && (
                      <>
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-medium text-rose-600">
                          {kpi.change}
                        </span>
                      </>
                    )}
                    {isAlert && (
                      <span className="text-xs font-medium text-red-600 animate-pulse">
                        {kpi.change}
                      </span>
                    )}
                    {!isUp && !isDown && !isAlert && (
                      <span className="text-xs font-medium text-gray-500">
                        {kpi.change}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPICards;
