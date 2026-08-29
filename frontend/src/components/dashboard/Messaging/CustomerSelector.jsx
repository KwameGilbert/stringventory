import { useState } from "react";
import { Search, Users, CheckSquare, Square, User } from "lucide-react";

export default function CustomerSelector({ customers, selectedIds, onSelect, onSelectAll }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState("individual"); // individual | bulk
  
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;
  
  const filteredCustomers = customers.filter(customer => 
    (customer.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100 space-y-6 bg-white sticky top-0 z-10">
        <div className="flex flex-col gap-3">
          <h2 className="font-medium text-gray-900 text-lg">Select Recipients</h2>
          <div className="flex p-1 bg-gray-100 rounded-xl w-full">
            <button 
              onClick={() => setSelectionMode("individual")}
              className={`flex-1 py-2 px-2 text-[10px] rounded-lg flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider transition-all ${
                selectionMode === "individual" 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User size={14} /> Individual
            </button>
            <button 
              onClick={() => setSelectionMode("bulk")}
              className={`flex-1 py-2 px-2 text-[10px] rounded-lg flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider transition-all ${
                selectionMode === "bulk" 
                  ? "bg-emerald-600 text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users size={14} /> Bulk
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
          />
        </div>

        {selectionMode === "bulk" && (
          <button 
            onClick={onSelectAll}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
              isAllSelected 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/20"
            }`}
          >
            {isAllSelected 
              ? <CheckSquare className="text-emerald-600" size={24} /> 
              : <Users className="text-white/80" size={24} />
            }
            <span className="font-medium text-sm uppercase tracking-wider">
              {isAllSelected ? "Deselect All" : `Select All (${customers.length} customers)`}
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar min-h-0">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => {
            const isSelected = selectedIds.includes(customer.id);
            return (
              <div 
                key={customer.id}
                onClick={() => onSelect(customer.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/5"
                    : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className={`shrink-0 transition-colors ${isSelected ? "text-emerald-600" : "text-gray-300"}`}>
                  {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isSelected ? "bg-emerald-100 text-emerald-700 shadow-inner" : "bg-gray-100 text-gray-500"
                  }`}>
                    {(customer.customerName || "Unknown").split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                      {customer.customerName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-tight">
                      {customer.email || "No email address"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center flex flex-col items-center gap-3 bg-gray-50 rounded-xl border border-dashed border-gray-100">
            <Search size={24} className="text-gray-300" />
            <p className="text-xs text-gray-400 font-medium">No customers match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
