import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

const LowStockList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/low-stock.json");
        setItems(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getStockLevel = (current, threshold) => {
    const ratio = current / threshold;
    if (ratio <= 0.3) return { color: "from-red-500 to-rose-600", urgency: "Critical" };
    if (ratio <= 0.6) return { color: "from-orange-400 to-amber-500", urgency: "Low" };
    return { color: "from-yellow-400 to-amber-400", urgency: "Warning" };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col hover-lift">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Low Stock Alert</h3>
        </div>
        <Link 
          to="/dashboard/inventory" 
          className="flex items-center gap-1 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1.5 rounded-full hover:shadow-lg hover:shadow-red-200 transition-all group"
        >
          {items.length} items
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {items.map((item, index) => {
          const stock = getStockLevel(item.current, item.threshold);
          const percentage = (item.current / item.threshold) * 100;
          
          return (
            <div 
              key={index} 
              className="group p-4 rounded-xl border border-red-100 bg-gradient-to-r from-red-50/50 to-rose-50/30 hover:from-red-50 hover:to-rose-50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">Threshold: {item.threshold} {item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 text-sm">{item.current} left</p>
                  <span className={`
                    text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                    ${stock.urgency === 'Critical' ? 'bg-red-100 text-red-600' : ''}
                    ${stock.urgency === 'Low' ? 'bg-orange-100 text-orange-600' : ''}
                    ${stock.urgency === 'Warning' ? 'bg-yellow-100 text-yellow-600' : ''}
                  `}>
                    {stock.urgency}
                  </span>
                </div>
              </div>
              
              {/* Stock level bar */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stock.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowStockList;

