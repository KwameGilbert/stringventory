import { 
  Activity, 
  Settings, 
  Package, 
  ShoppingCart, 
  User, 
  LogIn 
} from "lucide-react";

export default function ActivityLogs({ logs }) {
  const getModuleIcon = (entityType) => {
    switch (entityType?.toLowerCase()) {
      case "systemsettings": return <Settings size={16} className="text-blue-600" />;
      case "inventory": return <Package size={16} className="text-emerald-600" />;
      case "products": return <Package size={16} className="text-emerald-600" />;
      case "sales": return <ShoppingCart size={16} className="text-purple-600" />;
      case "orders": return <ShoppingCart size={16} className="text-purple-600" />;
      case "users": return <User size={16} className="text-amber-600" />;
      case "auth": return <LogIn size={16} className="text-gray-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getModuleColor = (entityType) => {
    switch (entityType?.toLowerCase()) {
      case "systemsettings": return "bg-blue-50 border-blue-100";
      case "inventory": return "bg-emerald-50 border-emerald-100";
      case "products": return "bg-emerald-50 border-emerald-100";
      case "sales": return "bg-purple-50 border-purple-100";
      case "orders": return "bg-purple-50 border-purple-100";
      case "users": return "bg-amber-50 border-amber-100";
      case "auth": return "bg-gray-50 border-gray-100";
      default: return "bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Activity size={18} className="text-emerald-600" />
          Recent Activity
        </h3>
        <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View All</button>
      </div>
      
      <div className="overflow-y-auto max-h-[600px] p-4 space-y-4 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getModuleColor(log.entityType)}`}>
              {getModuleIcon(log.entityType)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {log.userName || "Unknown User"}
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-0.5">{log.action}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{log.metadata?.details}</p>
            </div>
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No activity logs found.
          </div>
        )}
      </div>
    </div>
  );
}
