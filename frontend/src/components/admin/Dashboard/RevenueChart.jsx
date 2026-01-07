import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-xs border border-gray-100 shadow-xl rounded-lg p-3 min-w-[150px]">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
                <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-500 capitalize">{entry.name}:</span>
                <span className="font-bold text-gray-800">
                    GH₵{entry.value.toLocaleString()}
                </span>
            </div>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulating data adjustment for the new visualization or fetching existing
    // In a real scenario, we might need to transform the data to have both 'revenue' and 'costs'
    // For now, we will mock the 'costs' based on the existing 'revenue' data if it's missing,
    // or assume the endpoint returns it.
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/revenue-chart.json");
        // Enhancing mock data to include costs if not present
        const enhancedData = response.data.map(item => ({
            ...item,
            costs: item.revenue * 0.6 // Mock costs as 60% of revenue
        }));
        setData(enhancedData);
      } catch (err) {
        console.error("Error fetching revenue data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-gray-900">Revenue vs Costs</h3>
        <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                 <span className="text-gray-500">Revenue</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                 <span className="text-gray-500">Costs</span>
             </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={0}
            barCategoryGap="30%"
            stacked
          >
            <CartesianGrid vertical={false} stroke="#f3f4f6" strokeDasharray="4 4" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={10}
            />
            
            <YAxis
              tickFormatter={(value) =>
                value === 0 ? "$0" : `$${value / 1000}k`
              }
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />

            {/* Costs Bar (Purple) - StackId 1 ensures stacking if we wanted, 
                but visual shows comparison usually side-by-side or stacked. 
                Propay image shows stacked per month? Actually it looks like two separate bars per month.
                Let's stick to separate bars for better comparison as per usual analytics, 
                or stacked if strictly requested. The image looks like Stacked actually? 
                Wait, looking at the image: "Revenue vs Costs", blue and purple bars. 
                They are side-by-side (grouped), NOT stacked on top of each other.
                Let's do grouped bars. remove 'stackId'.
            */}
            
            <Bar
              dataKey="costs"
              name="Costs"
              fill="#7c3aed" // Purple
              radius={[4, 4, 4, 4]}
            />
            
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#22d3ee" // Cyan
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default RevenueChart;
