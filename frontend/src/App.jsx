import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Providers from "./providers/Providers";
import PageLoader from "./components/ui/PageLoader";

// Route modules
// import publicRoutes from "./router/publicRoutes"; // Public site — commented out
import authRoutes from "./router/authRoutes";
import dashboardRoutes from "./router/dashboardRoutes";
// import superadminRoutes from "./router/superadminRoutes"; // Superadmin portal — commented out

export default function App() {
  return (
    <Providers>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website — commented out */}
            {/* {publicRoutes} */}

            {/* Authentication */}
            {authRoutes}

            {/* Root → redirect to Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Superadmin Portal — commented out */}
            {/* {superadminRoutes} */}
            {/* <Route path="/super-admin" element={<Navigate to="/superadmin" replace />} /> */}
            {/* <Route path="/super-admin/*" element={<Navigate to="/superadmin" replace />} /> */}

            {/* Business Dashboard */}
            {dashboardRoutes}
          </Routes>
        </Suspense>
      </Router>
    </Providers>
  );
}
