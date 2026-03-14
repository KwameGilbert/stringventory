import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import authService from "../services/authService";
import { getAccessToken, clearTokens } from "../services/api.client";
import { ROLES, normalizeRole } from "../utils/accessControl";

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
      const payload = response?.data || response || {};
      const authUser = payload?.user || payload || {};
      const role = authUser?.role || "";
      const normalizedRole = normalizeRole(role);
      const firstName = authUser?.firstName || "";
      const lastName = authUser?.lastName || "";

      const userData = {
        id: authUser?.id,
        email: authUser?.email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        role: normalizedRole,
        rawRole: role,
        normalizedRole,
        roleId: authUser?.roleId,
        status: authUser?.status,
        businessId: authUser?.businessId,
        subscriptionPlan: authUser?.subscriptionPlan,
        subscriptionStatus: authUser?.subscriptionStatus,
        isSuperAdmin: normalizedRole === ROLES.CEO,
        avatar: `https://ui-avatars.com/api/?name=${firstName || "User"}+${lastName || ""}&background=random&color=fff`,
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

  const isSuperAdmin = () => {
    return user?.isSuperAdmin === true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
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
