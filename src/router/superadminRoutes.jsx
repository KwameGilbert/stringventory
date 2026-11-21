import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import SuperadminRoute from "../components/auth/SuperadminRoute";
import SuperadminLayout from "../components/superadmin/layout/SuperadminLayout";

// Lazy-loaded Superadmin pages
const SuperadminDashboard = lazy(() => import("../pages/superadmin/Dashboard/SuperadminDashboard"));
const Businesses = lazy(() => import("../pages/superadmin/Businesses/Businesses"));
const BusinessDetails = lazy(() => import("../pages/superadmin/Businesses/BusinessDetails"));
const EditBusiness = lazy(() => import("../pages/superadmin/Businesses/EditBusiness"));
const AddBusiness = lazy(() => import("../pages/superadmin/Businesses/AddBusiness"));
const PricingPlans = lazy(() => import("../pages/superadmin/PricingPlans/PricingPlans"));
const CreatePricingPlan = lazy(() => import("../pages/superadmin/PricingPlans/CreatePricingPlan"));
const ViewPricingPlan = lazy(() => import("../pages/superadmin/PricingPlans/ViewPricingPlan"));
const Analytics = lazy(() => import("../pages/superadmin/Analytics/Analytics"));
const SuperadminSettings = lazy(() => import("../pages/superadmin/Settings/Settings"));
const SuperadminMessaging = lazy(() => import("../pages/superadmin/Messaging/Messaging"));
const SuperadminNotifications = lazy(() => import("../pages/superadmin/Notifications/Notifications"));
const SuperadminProfile = lazy(() => import("../pages/superadmin/Profile/Profile"));

const superadminRoutes = (
  <Route
    path="/superadmin/*"
    element={
      <SuperadminRoute>
        <SuperadminLayout>
          <Routes>
            <Route path="/" element={<SuperadminDashboard />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/businesses/new" element={<AddBusiness />} />
            <Route path="/businesses/:id" element={<BusinessDetails />} />
            <Route path="/businesses/edit/:id" element={<EditBusiness />} />
            <Route path="/pricing-plans" element={<PricingPlans />} />
            <Route path="/pricing-plans/new" element={<CreatePricingPlan />} />
            <Route path="/pricing-plans/:id" element={<ViewPricingPlan />} />
            <Route path="/pricing-plans/:id/edit" element={<CreatePricingPlan />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SuperadminSettings />} />
            <Route path="/messaging" element={<SuperadminMessaging />} />
            <Route path="/notifications" element={<SuperadminNotifications />} />
            <Route path="/profile" element={<SuperadminProfile />} />
          </Routes>
        </SuperadminLayout>
      </SuperadminRoute>
    }
  />
);

export default superadminRoutes;
