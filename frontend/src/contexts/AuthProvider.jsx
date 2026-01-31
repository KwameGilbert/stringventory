import { useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { PERMISSIONS } from "../constants/permissions";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // DEFAULT LOGIN FOR DEVELOPMENT - Auto-login as superadmin
    const defaultUser = {
      id: "superadmin-001",
      email: "superadmin@stringventory.com",
      name: "Super Administrator",
      role: "Superadmin",
      avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=8b5cf6&color=fff",
      isSuperAdmin: true,
      businessId: null,
      permissions: ['*']
    };
    
    localStorage.setItem("user", JSON.stringify(defaultUser));
    return defaultUser;
  });
  const [loading] = useState(false);

  // login function
  const login = async (email) => {
    // MOCK AUTHENTICATION LOGIC
    // In a real app, this would verify credentials with the backend
    
    let mockUser = {
      id: "mock-user-id",
      email,
      avatar: `https://ui-avatars.com/api/?name=${email}&background=random&color=fff`,
      permissions: [],
      businessId: null,
      isSuperAdmin: false
    };

    // Check for superadmin
    if (email.includes("superadmin")) {
        mockUser.id = "superadmin-001";
        mockUser.name = "Super Administrator";
        mockUser.role = "Superadmin";
        mockUser.isSuperAdmin = true;
        mockUser.businessId = null; // No business association
        mockUser.permissions = ['*']; // All permissions including platform management
    } else if (email.includes("admin")) {
        mockUser.name = "Admin User";
        mockUser.role = "Administrator";
        mockUser.businessId = "business-001"; // Assign to a business
        // Admin gets ALL business permissions
        mockUser.permissions = Object.values(PERMISSIONS);
    } else if (email.includes("sales")) {
        mockUser.name = "Sales Person";
        mockUser.role = "Sales";
        mockUser.businessId = "business-001";
        mockUser.permissions = [
            PERMISSIONS.VIEW_DASHBOARD,
            PERMISSIONS.VIEW_PRODUCTS,
            PERMISSIONS.VIEW_ORDERS,
            PERMISSIONS.MANAGE_ORDERS,
            PERMISSIONS.VIEW_CUSTOMERS,
            PERMISSIONS.MANAGE_CUSTOMERS,
            PERMISSIONS.VIEW_MESSAGING
        ];
    } else if (email.includes("warehouse")) {
        mockUser.name = "Warehouse Manager";
        mockUser.role = "Warehouse";
        mockUser.businessId = "business-001";
        mockUser.permissions = [
            PERMISSIONS.VIEW_DASHBOARD,
            PERMISSIONS.VIEW_CATEGORIES, 
            PERMISSIONS.VIEW_PRODUCTS,
            PERMISSIONS.MANAGE_PRODUCTS,
            PERMISSIONS.VIEW_INVENTORY,
            PERMISSIONS.MANAGE_INVENTORY,
            PERMISSIONS.VIEW_PURCHASES,
            PERMISSIONS.MANAGE_PURCHASES,
            PERMISSIONS.VIEW_REPORTS
        ];
    } else {
        // Default to Administrator for Development/Demo
        mockUser.name = "System Administrator";
        mockUser.role = "Administrator";
        mockUser.businessId = "business-001";
        mockUser.permissions = Object.values(PERMISSIONS);
    }

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.isSuperAdmin) return true; // Superadmin has all permissions
    if (user.role === 'Administrator') return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissionsArray) => {
      if (!user) return false;
      if (user.isSuperAdmin) return true; // Superadmin has all permissions
      if (user.role === 'Administrator') return true;
      return permissionsArray.some(p => user.permissions.includes(p));
  };
  
  const isSuperAdmin = () => {
    return user?.isSuperAdmin === true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, hasAnyPermission, isSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
