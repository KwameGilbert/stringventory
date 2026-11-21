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
export const normalizeBusiness = (business) => {
  const owner = business?.users?.find(u => u.role === 'owner');
  const subscription = business?.subscription || {};

  return {
    ...business,
    id: business?.id,
    name: business?.name || business?.businessName || 'Unnamed Business',
    email: business?.email || business?.ownerEmail || '',
    domain: business?.domain || 'N/A',
    phone: business?.phone || owner?.phone || business?.ownerPhone || 'N/A',
    industry: business?.industry || 'N/A',
    country: business?.country || 'N/A',
    city: business?.city || 'N/A',
    address: business?.address || 'N/A',
    owner_name: owner ? `${owner.firstName} ${owner.lastName}` : business?.owner_name || business?.ownerName || 'Owner',
    subscription_plan: String(business?.subscription_plan || business?.subscriptionPlan || business?.plan || 'starter').toLowerCase(),
    status: String(business?.status || 'active').toLowerCase(),
    current_usage: {
      total_users:
        Number(business?.users?.length) ||
        Number(business?.current_usage?.total_users) ||
        Number(business?.currentUsage?.totalUsers) ||
        Number(business?.totalUsers) ||
        0,
      total_products:
        Number(business?.current_usage?.total_products) ||
        Number(business?.currentUsage?.totalProducts) ||
        Number(business?.totalProducts) ||
        0,
      storage_used:
        Number(business?.usedStorageMb) ||
        Number(business?.current_usage?.storage_used) ||
        Number(business?.currentUsage?.storageUsed) ||
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
      maxStorage:
        Number(business?.usage_limits?.maxStorage) ||
        Number(business?.usageLimits?.maxStorage) ||
        Number(business?.planLimits?.maxStorage) ||
        0,
    },
    mrr:
      Number(subscription?.mrr) ||
      Number(business?.mrr) ||
      Number(business?.monthlyRecurringRevenue) ||
      Number(business?.revenue?.mrr) ||
      0,
    billing_cycle: subscription?.billingCycle || 'monthly',
    next_billing_date: subscription?.currentPeriodEnd || business?.next_billing_date || business?.nextBillingDate || null,
    subscription_status: subscription?.status || 'active',
    created_at: business?.createdAt || business?.created_at || new Date().toISOString(),
    logo_url: business?.logo_url || business?.logoUrl || null,
  };
};
