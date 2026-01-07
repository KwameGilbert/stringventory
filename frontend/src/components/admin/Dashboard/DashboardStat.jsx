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
        
        // Define color schemes based on stat name or color prop for Propay look
        // We will stick to a clean white card with specific icon backgrounds
        
        let iconBg = "bg-gray-100";
        let iconColor = "text-gray-600";


        // Custom styling logic can go here based on stat.color
        if (stat.color === 'emerald') {
             iconBg = "bg-purple-100";
             iconColor = "text-purple-600";
        } else if (stat.color === 'orange') {
             iconBg = "bg-orange-100";
             iconColor = "text-orange-600";
        } else if (stat.color === 'blue') {
             iconBg = "bg-blue-100";
             iconColor = "text-blue-600";
        } else if (stat.color === 'red') {
             iconBg = "bg-red-100";
             iconColor = "text-red-600";
        }

        const isTrendUp = stat.trend === "up";
        const trendTextColor = isTrendUp ? "text-emerald-500" : "text-rose-500";

        return (
          <div
            key={stat.id || index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col h-full justify-between gap-4">
               {/* Header: Icon + Title */}
               <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconBg} bg-opacity-50`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-500">{stat.title}</span>
               </div>
               
               {/* Main Value */}
               <div>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
               </div>

               {/* Footer: Trend */}
               {stat.change && (
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className={`flex items-center gap-1 ${trendTextColor}`}>
                        <TrendingUp className={`w-3 h-3 ${!isTrendUp ? 'rotate-180' : ''}`} />
                        {stat.change}
                    </span>
                    <span className="text-gray-400">today</span>
                  </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStat;
