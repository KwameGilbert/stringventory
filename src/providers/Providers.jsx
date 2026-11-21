import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthProvider";
// import { TenantProvider } from "./TenantProvider";       // Superadmin multi-tenancy — commented out
// import { SubscriptionProvider } from "./SubscriptionProvider"; // Depends on TenantProvider — commented out
import { SettingsProvider } from "./SettingsContext";
import { NotificationProvider } from "./NotificationContext";

/**
 * Composes all application-level context providers into a single wrapper.
 * This eliminates deep nesting in App.jsx.
 *
 * NOTE: TenantProvider and SubscriptionProvider are commented out as the
 * Superadmin portal is currently disabled. Re-enable them when restoring
 * superadmin functionality.
 */
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* <TenantProvider> */}
        {/*   <SubscriptionProvider> */}
              <SettingsProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </SettingsProvider>
        {/*   </SubscriptionProvider> */}
        {/* </TenantProvider> */}
      </AuthProvider>
    </ThemeProvider>
  );
}
