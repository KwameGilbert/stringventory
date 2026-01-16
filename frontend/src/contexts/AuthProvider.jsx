import { useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { PERMISSIONS } from "../constants/permissions";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
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
      permissions: []
    };

    if (email.includes("admin")) {
        mockUser.name = "Admin User";
        mockUser.role = "Administrator";
        // Admin gets ALL permissions
        mockUser.permissions = Object.values(PERMISSIONS);
    } else if (email.includes("sales")) {
        mockUser.name = "Sales Person";
        mockUser.role = "Sales";
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
    if (user.role === 'Administrator') return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissionsArray) => {
      if (!user) return false;
      if (user.role === 'Administrator') return true;
      return permissionsArray.some(p => user.permissions.includes(p));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, hasAnyPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
