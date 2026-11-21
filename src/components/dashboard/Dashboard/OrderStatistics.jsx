import { useState, useEffect } from "react";
import { Package, ChevronDown } from "lucide-react";

// Days of week for X-axis
const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

// Time slots for Y-axis (matching image)
const TIMES = ["12 mp", "12 pm", "02 pm", "12 am", "10 am", "8 am", "6 am", "4 am", "2 am"];

// Empty matrix for when there is no data
const EMPTY_HEATMAP = Array.from({ length: 9 }, () =>
  Array.from({ length: 7 }, () => ({ count: 0, shade: "bg-slate-50" }))
);

const OrderStatistics = ({ dateRange }) => {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [activeCell, setActiveCell] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shrink-0 shadow-xs">
              <Package size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Order Statistics</h3>
          </div>
          <div className="relative shrink-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
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
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border border-slate-800 flex items-center gap-1.5 animate-bounce">
              <span>{activeCell.count} Orders</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
            </div>
          )}

          <div className="flex gap-3">
            {/* Y-Axis Time Labels */}
            <div className="flex flex-col justify-between py-1 text-[11px] font-medium text-slate-700 shrink-0 space-y-2.5">
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
                    const cell = EMPTY_HEATMAP[timeIdx][dayIdx];
                    const isSelected = activeCell?.rIdx === timeIdx && activeCell?.cIdx === dayIdx;
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
            <div className="flex-1 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-slate-700">
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
