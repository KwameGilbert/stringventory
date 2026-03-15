import { useState, useRef, useEffect } from "react";
import { Search, Plus, User, Building2, Phone, Mail, ChevronDown, Check } from "lucide-react";

export default function CustomerSelect({ 
    customers, 
    selectedCustomer, 
    onSelect, 
    onOpenAddModal, 
    loading = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(customer => {
      const searchStr = searchQuery.toLowerCase();
      const name = String(
          customer.displayName || 
          (customer.user?.firstName ? `${customer.user.firstName} ${customer.user.lastName || ""}` : "") || 
          (customer.firstName ? `${customer.firstName} ${customer.lastName || ""}` : "") || 
          customer.name || ""
      ).toLowerCase();
      const business = (customer.businessName || "").toLowerCase();
      const phone = (customer.phone || "").toLowerCase();
      
      return name.includes(searchStr) || business.includes(searchStr) || phone.includes(searchStr);
  });

  const getCustomerName = (c) => {
      if (!c) return "Select Customer";
      return c.displayName || 
             (c.user?.firstName ? `${c.user.firstName} ${c.user.lastName || ""}`.trim() : null) || 
             (c.firstName ? `${c.firstName} ${c.lastName || ""}`.trim() : null) || 
             c.name || 
             "Unknown";
  };

  return (
    <div className="space-y-3 relative" ref={dropdownRef}>
        <div className="flex items-center justify-between">
           <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
             <User className="w-4 h-4 text-gray-500" />
             Customer Details
           </label>
           
           <button
             type="button"
             onClick={onOpenAddModal}
             className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
           >
              <Plus size={12} />
              Add New
           </button>
        </div>

        {/* Dropdown Toggle */}
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all text-left"
        >
            <div className="flex flex-col truncate min-w-0">
                <span className={`text-sm font-medium ${selectedCustomer ? 'text-gray-900' : 'text-gray-500'}`}>
                    {getCustomerName(selectedCustomer)}
                </span>
                {selectedCustomer && (
                     <span className="text-xs text-gray-500 truncate mt-0.5">
                         {selectedCustomer.businessName || "No Business Name"}
                     </span>
                )}
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
            <div className="absolute top-16 left-0 right-0 z-50 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 flex flex-col">
                <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search by name, business, or phone..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Prevent close
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-1 flex-1">
                    {loading ? (
                         <div className="p-4 text-center text-xs text-gray-500">Loading customers...</div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">
                             No customers found. <br />
                             <button onClick={() => { setIsOpen(false); onOpenAddModal(); }} className="text-blue-600 hover:underline mt-1">Add a new one</button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredCustomers.map(customer => {
                                const isSelected = selectedCustomer?.id === customer.id;
                                return (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            onSelect(customer);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                                            isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-900'
                                        }`}
                                    >
                                        <div className="flex flex-col truncate min-w-0 mr-3">
                                             <span className="font-medium truncate">{getCustomerName(customer)}</span>
                                             <span className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                                                 <Building2 size={10} /> {customer.businessName || "N/A"}
                                             </span>
                                        </div>
                                        {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Selected Customer Details Preview */}
        {selectedCustomer && (
             <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2 mt-2">
                 <div className="flex items-center gap-2 text-xs text-gray-600">
                     <Mail className="w-3.5 h-3.5 text-gray-400" />
                     <span className="truncate">{selectedCustomer.user?.email || selectedCustomer.email || "No Email Provided"}</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-600">
                     <Phone className="w-3.5 h-3.5 text-gray-400" />
                     <span>{selectedCustomer.phone || "No Phone Provided"}</span>
                 </div>
             </div>
        )}
    </div>
  );
}
