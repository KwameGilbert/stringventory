import React, { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const Login = lazy(() => import("../pages/login/Login"));
const ForcePasswordChange = lazy(() => import("../pages/login/ForcePasswordChange"));
const SuperadminLogin = lazy(() => import("../pages/superadmin/login/SuperadminLogin"));

const authRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/superadmin/login" element={<SuperadminLogin />} />
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
