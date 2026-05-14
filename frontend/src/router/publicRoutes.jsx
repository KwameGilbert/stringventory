import React, { lazy } from "react";
import { Route } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const ContactPage = lazy(() => import("../pages/public/ContactPage"));
const CheckoutPage = lazy(() => import("../pages/public/CheckoutPage"));

const publicRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/signup" element={<CheckoutPage />} />
  </>
);

export default publicRoutes;
