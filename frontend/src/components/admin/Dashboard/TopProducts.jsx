import { useEffect, useState } from "react";
import axios from "axios";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/top-products.json");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products by Revenue</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sold} units sold</p>
              </div>
            </div>
            <span className="text-sm font-bold text-sky-600">{product.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
