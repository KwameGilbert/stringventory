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
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";

const themeHexCodes = {
  red: "#ef4444",
  orange: "#f97316",
  emerald: "#10b981",
  green: "#22c55e",
  purple: "#a855f7",
};

const CustomTooltip = ({ active, payload, label, themeColors }) => {
  if (active && payload && payload.length) {
    const { revenue } = payload[0].payload;
    return (
      <div className="bg-white text-xs border border-gray-200 shadow-xl rounded-lg p-3 min-w-[150px]">
        <p className="font-semibold text-gray-600 mb-1">{label} 2024</p>
        <p className="font-bold text-slate-800">
          Revenue:{" "}
          <span className={themeColors?.textColor || "text-emerald-600"}>
            GH₵{revenue.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const { theme, themeColors } = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/data/revenue-chart.json");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching revenue data", err);
      }
    };
    fetchData();
  }, []);

  const currentColorHex = themeHexCodes[theme] || "#10b981";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Over Time</h3>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={10} // Overlap the bars
          >
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={10}
            />
            
            <YAxis
              tickFormatter={(value) =>
                value === 0 ? "₵0k" : `₵${value / 1000}k`
              }
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16, fill: "#9ca3af" }}
            />

            <Tooltip
              content={<CustomTooltip themeColors={themeColors} />}
              cursor={{ fill: "transparent" }}
            />

            {/* Projected Bar (Background) */}
            <Bar
              dataKey="projected"
              fill="#f3f4f6"
              barSize={30}
              radius={[4, 4, 0, 0]}
            />

            {/* Revenue Bar (Foreground) */}
            <Bar
              dataKey="revenue"
              fill={currentColorHex}
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
