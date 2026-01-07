import { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

const ExpiringProducts = () => {
  const [data, setData] = useState({ summary: {}, items: [] });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/expiring-products.json");
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Expiring Soon</h3>
        <Clock className="w-5 h-5 text-rose-400" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
          <p className="text-2xl font-bold text-red-600">{data.summary?.days30 || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">30 days</p>
        </div>
        <div className="bg-rose-50 p-3 rounded-lg text-center border border-rose-100">
          <p className="text-2xl font-bold text-rose-500">{data.summary?.days60 || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">60 days</p>
        </div>
        <div className="bg-indigo-50 p-3 rounded-lg text-center border border-indigo-100">
          <p className="text-2xl font-bold text-indigo-500">{data.summary?.days90 || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">90 days</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-3">
        {data.items?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-rose-50/50 border border-rose-100">
            <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
            <span className="text-xs font-bold text-rose-500 bg-rose-100 px-2 py-1 rounded">
              {item.expiryDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiringProducts;
