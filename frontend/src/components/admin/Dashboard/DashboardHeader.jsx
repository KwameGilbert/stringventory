import { Calendar, ChevronDown } from "lucide-react";

const dateOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "This Year", value: "year" },
];

const DashboardHeader = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your business performance</p>
      </div>

      {/* Date Filter */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar size={16} className="text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 cursor-pointer pr-6 appearance-none"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="text-gray-400 absolute right-3" />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
