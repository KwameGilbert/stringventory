import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthProvider";
import { TenantProvider } from "./TenantProvider";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { SettingsProvider } from "./SettingsContext";
import { NotificationProvider } from "./NotificationContext";
import InstallPrompt from "../components/ui/InstallPrompt";

/**
 * Composes all application-level context providers into a single wrapper.
 * This eliminates deep nesting in App.jsx.
 */
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <SubscriptionProvider>
            <SettingsProvider>
              <NotificationProvider>
                <InstallPrompt />
                {children}
              </NotificationProvider>
            </SettingsProvider>
          </SubscriptionProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
