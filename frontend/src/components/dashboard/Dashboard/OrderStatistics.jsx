import { useState, useEffect } from "react";
import { Package, ChevronDown } from "lucide-react";

// Days of week for X-axis
const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

// Time slots for Y-axis (matching image)
const TIMES = ["12 mp", "12 pm", "02 pm", "12 am", "10 am", "8 am", "6 am", "4 am", "2 am"];

// Mock matrix data matching the visual patterns in the user's screenshot
const MOCK_HEATMAP = [
  // 12 mp
  [{ count: 24, shade: "bg-orange-200/70" }, { count: 32, shade: "bg-orange-200/70" }, { count: 45, shade: "bg-orange-200/70" }, { count: 18, shade: "bg-orange-200/70" }, { count: 12, shade: "bg-orange-200/70" }, { count: 240, shade: "bg-orange-500" }, { count: 265, shade: "bg-orange-500" }],
  // 12 pm
  [{ count: 30, shade: "bg-orange-200/70" }, { count: 40, shade: "bg-orange-200/70" }, { count: 297, shade: "bg-slate-900" }, { count: 25, shade: "bg-orange-200/70" }, { count: 275, shade: "bg-orange-500" }, { count: 45, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }],
  // 02 pm
  [{ count: 45, shade: "bg-orange-200/70" }, { count: 50, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }, { count: 20, shade: "bg-orange-200/70" }, { count: 15, shade: "bg-orange-200/70" }, { count: 20, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }],
  // 12 am
  [{ count: 15, shade: "bg-orange-200/70" }, { count: 18, shade: "bg-orange-200/70" }, { count: 25, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }, { count: 40, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }, { count: 50, shade: "bg-orange-200/70" }],
  // 10 am
  [{ count: 280, shade: "bg-orange-500" }, { count: 290, shade: "bg-orange-500" }, { count: 275, shade: "bg-orange-500" }, { count: 60, shade: "bg-orange-200/70" }, { count: 45, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }, { count: 20, shade: "bg-orange-200/70" }],
  // 8 am
  [{ count: 50, shade: "bg-orange-200/70" }, { count: 45, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }, { count: 55, shade: "bg-orange-200/70" }, { count: 280, shade: "bg-orange-500" }, { count: 295, shade: "bg-orange-500" }],
  // 6 am
  [{ count: 35, shade: "bg-orange-200/70" }, { count: 40, shade: "bg-orange-200/70" }, { count: 25, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }, { count: 20, shade: "bg-orange-200/70" }, { count: 25, shade: "bg-orange-200/70" }, { count: 30, shade: "bg-orange-200/70" }],
  // 4 am
  [{ count: 275, shade: "bg-orange-500" }, { count: 285, shade: "bg-orange-500" }, { count: 290, shade: "bg-orange-500" }, { count: 280, shade: "bg-orange-500" }, { count: 40, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }, { count: 45, shade: "bg-orange-200/70" }],
  // 2 am
  [{ count: 260, shade: "bg-orange-500" }, { count: 270, shade: "bg-orange-500" }, { count: 280, shade: "bg-orange-500" }, { count: 30, shade: "bg-orange-200/70" }, { count: 25, shade: "bg-orange-200/70" }, { count: 20, shade: "bg-orange-200/70" }, { count: 35, shade: "bg-orange-200/70" }],
];

const OrderStatistics = ({ dateRange }) => {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [activeCell, setActiveCell] = useState({ rIdx: 1, cIdx: 2, count: 297 });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shrink-0 shadow-xs">
              <Package size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Order Statistics</h3>
          </div>
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="relative pt-4 pb-2">
          {/* Active cell popup tooltip */}
          {activeCell && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-xl border border-slate-700 flex items-center gap-1.5 animate-bounce">
              <span>{activeCell.count} Orders</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
            </div>
          )}

          <div className="flex gap-3">
            {/* Y-Axis Time Labels */}
            <div className="flex flex-col justify-between py-1 text-[11px] font-bold text-slate-400 shrink-0 space-y-2.5">
              {TIMES.map((time, idx) => (
                <div key={idx} className="h-6 flex items-center justify-end pr-1">
                  {time}
                </div>
              ))}
            </div>

            {/* Matrix Boxes */}
            <div className="flex-1 grid grid-cols-7 gap-1.5">
              {DAYS.map((_, dayIdx) => (
                <div key={dayIdx} className="flex flex-col gap-1.5">
                  {TIMES.map((_, timeIdx) => {
                    const cell = MOCK_HEATMAP[timeIdx][dayIdx];
                    const isSelected = activeCell.rIdx === timeIdx && activeCell.cIdx === dayIdx;
                    return (
                      <div
                        key={timeIdx}
                        onClick={() => setActiveCell({ rIdx: timeIdx, cIdx: dayIdx, count: cell.count })}
                        onMouseEnter={() => setActiveCell({ rIdx: timeIdx, cIdx: dayIdx, count: cell.count })}
                        className={`h-6 rounded-md transition-all cursor-pointer ${cell.shade} ${
                          isSelected ? "ring-2 ring-slate-900 scale-110 shadow-md z-10" : "hover:opacity-80"
                        }`}
                        title={`${cell.count} Orders`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Day Labels */}
          <div className="flex pl-12 pt-3">
            <div className="flex-1 grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-500">
              {DAYS.map((day, idx) => (
                <div key={idx} className="truncate">{day}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;
