import { useEffect, useState } from "react";
import axios from "axios";
import {
  DollarSign,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";

const iconMap = {
  DollarSign,
  Activity,
  ArrowLeftRight,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
};

const DashboardStat = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/data/dashboard-stats.json");
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">Loading stats...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || Activity;
        
        // Determine color classes based on stat.color or defaulting to theme
        let borderColor = "";
        let iconBg = "";
        let iconColor = "";

        // Map data colors to Tailwind classes or use Theme Context
        switch (stat.color) {
          case "emerald":
            borderColor = "border-l-sky-500";
            iconBg = "bg-sky-50";
            iconColor = "text-sky-600";
            break;
          case "orange":
            borderColor = "border-l-rose-500";
            iconBg = "bg-rose-50";
            iconColor = "text-rose-600";
            break;
          case "red":
            borderColor = "border-l-red-500";
            iconBg = "bg-red-50";
            iconColor = "text-red-600";
            break;
          case "blue":
            borderColor = "border-l-indigo-500";
            iconBg = "bg-indigo-50";
            iconColor = "text-indigo-600";
            break;
          case "slate":
          default:
            borderColor = "border-l-slate-500";
            iconBg = "bg-slate-50";
            iconColor = "text-slate-600";
            break;
        }

        // Determine trend color
        const trendColor = 
          stat.trend === "up" ? "text-emerald-600" : 
          stat.trend === "down" ? "text-red-600" : 
          stat.trend === "alert" ? "text-red-600 font-bold" :
          "text-gray-500";

        return (
          <div
            key={stat.id || index} // Use ID if available
            className={`bg-white rounded-xl shadow-sm border-l-4 ${borderColor} p-4 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-lg font-bold text-gray-900">
                  {stat.value}
                </h3>
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className={`w-3 h-3 ${stat.trend === "down" ? "rotate-90" : ""}`} />
                    <span className={trendColor}>{stat.change}</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${iconBg}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStat;
