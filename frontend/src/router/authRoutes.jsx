import React, { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Login = lazy(() => import("../pages/auth/Login"));
const ForcePasswordChange = lazy(() => import("../pages/auth/ForcePasswordChange"));

const authRoutes = (
  <>
    {/* Single unified login for all user types — role-based redirect after auth */}
    <Route path="/login" element={<Login />} />

    {/* Legacy superadmin login URL — redirect to unified login */}
    {/* <Route path="/superadmin/login" element={<Navigate to="/login" replace />} /> */}

    <Route
      path="/force-password-change"
      element={
        <ProtectedRoute>
          <ForcePasswordChange />
        </ProtectedRoute>
      }
    />
  </>
);

export default authRoutes;
