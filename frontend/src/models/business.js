/**
 * Shared business data extraction and normalization utilities.
 * Single source of truth — replaces duplicated logic across
 * SuperadminDashboard, Businesses, and RecentBusinessesTable.
 */

/**
 * Extracts the businesses array from any API response shape.
 */
export const extractBusinesses = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.businesses)) return payload.businesses;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.businesses)) return payload.data.businesses;

  return [];
};

/**
 * Normalizes a single business object into a consistent shape
 * regardless of the API's field naming convention.
 */
export const normalizeBusiness = (business) => ({
  ...business,
  id: business?.id,
  name: business?.name || business?.businessName || 'Unnamed Business',
  email: business?.email || business?.ownerEmail || '',
  subscription_plan: business?.subscription_plan || business?.subscriptionPlan || business?.plan || 'starter',
  status: String(business?.status || 'active').toLowerCase(),
  current_usage: {
    total_users:
      Number(business?.current_usage?.total_users) ||
      Number(business?.currentUsage?.totalUsers) ||
      Number(business?.totalUsers) ||
      0,
    total_products:
      Number(business?.current_usage?.total_products) ||
      Number(business?.currentUsage?.totalProducts) ||
      Number(business?.totalProducts) ||
      0,
  },
  usage_limits: {
    maxUsers:
      Number(business?.usage_limits?.maxUsers) ||
      Number(business?.usageLimits?.maxUsers) ||
      Number(business?.planLimits?.maxUsers) ||
      0,
    maxProducts:
      Number(business?.usage_limits?.maxProducts) ||
      Number(business?.usageLimits?.maxProducts) ||
      Number(business?.planLimits?.maxProducts) ||
      0,
  },
  mrr:
    Number(business?.mrr) ||
    Number(business?.monthlyRecurringRevenue) ||
    Number(business?.revenue?.mrr) ||
    0,
  created_at: business?.created_at || business?.createdAt || new Date().toISOString(),
  logo_url: business?.logo_url || business?.logoUrl || null,
});
