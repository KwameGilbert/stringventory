import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Low Stock Alert</h3>
        <Link to="/dashboard/inventory" className="text-xs font-medium text-red-100 bg-red-500 px-2 py-1 rounded-full hover:bg-red-600 transition-colors">
          {items.length} items
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">Threshold: {item.threshold}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-red-600 text-sm">{item.current} left</p>
              <p className="text-[10px] text-gray-400 uppercase font-medium">{item.unit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockList;
