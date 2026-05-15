import { Calendar, ChevronDown } from "lucide-react";
import { useAuth } from "../../../providers/AuthContext";

const dateOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "This Year", value: "year" },
  { label: "Custom Range", value: "custom" },
];

const DashboardHeader = ({ dateRange, setDateRange }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
          Welcome, {user?.firstName || "Admin"}
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of your business performance
        </p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-500 transition-colors cursor-pointer group">
            <Calendar size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <select
              value={dateRange}
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  setDateRange(e.target.value);
                }
              }}
              className="bg-transparent border-none focus:outline-none text-sm font-semibold text-slate-700 cursor-pointer pr-8 appearance-none"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-4 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
