/**
 * Shared analytics data extraction and normalization utilities.
 * Single source of truth — replaces duplicated extractAnalytics logic
 * across SuperadminDashboard, Analytics, and PricingPlans.
 */

/**
 * Extracts the analytics object from any API response shape.
 */
export const extractAnalytics = (response) => {
  const payload = response?.data || response || {};

  if (payload?.analytics) return payload.analytics;
  if (payload?.data?.analytics) return payload.data.analytics;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};
