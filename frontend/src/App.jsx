import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Providers from "./providers/Providers";
import PageLoader from "./components/ui/PageLoader";

// Route modules
import publicRoutes from "./router/publicRoutes";
import authRoutes from "./router/authRoutes";
import dashboardRoutes from "./router/dashboardRoutes";
import superadminRoutes from "./router/superadminRoutes";

export default function App() {
  return (
    <Providers>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website */}
            {publicRoutes}

            {/* Authentication */}
            {authRoutes}

            {/* Superadmin Portal */}
            {superadminRoutes}
            <Route path="/super-admin" element={<Navigate to="/superadmin" replace />} />
            <Route path="/super-admin/*" element={<Navigate to="/superadmin" replace />} />

            {/* Business Dashboard */}
            {dashboardRoutes}
          </Routes>
        </Suspense>
      </Router>
    </Providers>
  );
}
