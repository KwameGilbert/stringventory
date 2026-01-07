import { useEffect, useState } from "react";
import axios from "axios";

const PaymentDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/payment-method.json");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching payment data", err);
      }
    };
    fetchData();
  }, []);

  // Calculate SVG paths for donut chart
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  const { segments } = data.reduce(
    (acc, item) => {
      const sliceAngle = (item.value / totalValue) * 360;
      const strokeDasharray = `${(sliceAngle / 360) * circumference} ${circumference}`;
      const strokeDashoffset = -1 * (acc.currentAngle / 360) * circumference;

      acc.segments.push({
        ...item,
        strokeDasharray,
        strokeDashoffset,
      });
      acc.currentAngle += sliceAngle;
      return acc;
    },
    { currentAngle: 0, segments: [] }
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Payment</h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {segments.map((item) => (
              <circle
                key={item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={item.strokeDasharray}
                strokeDashoffset={item.strokeDashoffset}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              />
            ))}
          </svg>
          
          {/* Inner Circle (Hole) */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none">
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-8">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-sm font-medium text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentDistribution;
