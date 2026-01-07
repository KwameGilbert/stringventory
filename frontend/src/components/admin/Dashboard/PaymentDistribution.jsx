import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const PaymentDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulating fetching "Unit Solds" data or keeping existing payment data but displaying as a pie/donut
    // The request was to make it look like the UI, which shows "Unit Solds".
    // We'll mock some "Unit Solds" data for now or adapt the existing payment method structure.
    // Let's create a mock dataset that looks like the "Unit Solds" chart.


    const fetchData = async () => {
      try {
        // We will fetch payment data but map it to a format suitable for the donut
        // Or strictly strictly mock "Unit Solds" as requested.
        // Let's use a static mock to match the visual perfectly for now, or fetch if available.
        // Since we don't have a "unit-solds" endpoint, we'll retain the "Payment Method" structure
        // but style it as a Donut chart to match the visual style of "Unit Solds".
        const response = await axios.get("/data/payment-method.json");
        // We can map payment methods to colors
        const colors = ["#22d3ee", "#7c3aed", "#f472b6", "#fbbf24"];
        const enhancedData = response.data.map((item, index) => ({
            ...item,
            color: colors[index % colors.length]
        }));
        setData(enhancedData);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Unit Solds</h3>

      <div className="flex-1 relative w-full min-h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm font-medium">Total</span>
            <span className="text-3xl font-bold text-gray-900">{totalValue.toLocaleString()}</span>
        </div>
      </div>

       {/* Legend */}
       <div className="flex items-center justify-center gap-6 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
                <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-600">
                    {entry.name}
                </span>
            </div>
          ))}
       </div>
    </div>
  );
};

export default PaymentDistribution;
