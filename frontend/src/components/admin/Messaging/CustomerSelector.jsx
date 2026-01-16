import { Search, Users, CheckSquare, Square } from "lucide-react";

export default function CustomerSelector({ customers, selectedIds, onSelect, onSelectAll }) {
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Select Recipients</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg flex items-center gap-1.5 font-medium">
              <Users size={14} /> Individual
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 flex items-center gap-1.5 font-medium">
              <Users size={14} /> Bulk
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <button 
          onClick={onSelectAll}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
            isAllSelected 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {isAllSelected 
            ? <CheckSquare className="text-emerald-600" size={20} /> 
            : <Square className="text-gray-400" size={20} />
          }
          <span className="font-medium text-sm">Select All ({customers.length} customers)</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {customers.map((customer) => {
          const isSelected = selectedIds.includes(customer.id);
          return (
            <div 
              key={customer.id}
              onClick={() => onSelect(customer.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className={`flex-shrink-0 transition-colors ${isSelected ? "text-emerald-600" : "text-gray-300"}`}>
                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>
              
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {(customer.customerName || "Unknown").split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                    {customer.customerName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {customer.email || "No email"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
