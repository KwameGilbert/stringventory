import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Providers from "./contexts/Providers";
import PageLoader from "./components/shared/PageLoader";

// Route modules
import publicRoutes from "./routes/publicRoutes";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import superadminRoutes from "./routes/superadminRoutes";

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

            {/* Business Dashboard */}
            {dashboardRoutes}
          </Routes>
        </Suspense>
      </Router>
    </Providers>
  );
}
