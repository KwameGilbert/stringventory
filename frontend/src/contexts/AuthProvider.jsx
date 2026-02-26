import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import authService from "../services/authService";
import { getAccessToken, clearTokens } from "../services/api.client";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(
      import.meta.env.VITE_AUTH_USER_KEY || "stringventory_user"
    );
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for logout events from other tabs/windows
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // login function with API integration
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);

      const userData = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        name: `${response.data.firstName} ${response.data.lastName}`,
        role: response.data.role,
        status: response.data.status,
        businessId: response.data.businessId,
        subscriptionPlan: response.data.subscriptionPlan,
        subscriptionStatus: response.data.subscriptionStatus,
        permissions: response.data.permissions || [],
        isSuperAdmin: response.data.role === "SUPERADMIN",
        avatar: `https://ui-avatars.com/api/?name=${response.data.firstName}+${response.data.lastName}&background=random&color=fff`,
      };

      setUser(userData);
      localStorage.setItem(
        import.meta.env.VITE_AUTH_USER_KEY || "stringventory_user",
        JSON.stringify(userData)
      );

      return userData;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout function with API integration
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(
        import.meta.env.VITE_AUTH_REFRESH_TOKEN_KEY || "stringventory_refresh_token"
      );
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      clearTokens();
      localStorage.removeItem(
        import.meta.env.VITE_AUTH_USER_KEY || "stringventory_user"
      );
      window.location.href = "/";
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.isSuperAdmin) return true; // Superadmin has all permissions
    if (user.role === "Administrator") return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissionsArray) => {
    if (!user) return false;
    if (user.isSuperAdmin) return true; // Superadmin has all permissions
    if (user.role === "Administrator") return true;
    return permissionsArray.some((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const isSuperAdmin = () => {
    return user?.isSuperAdmin === true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        isSuperAdmin,
        loading,
        error,
        isAuthenticated: !!user && !!getAccessToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
