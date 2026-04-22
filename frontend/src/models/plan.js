/**
 * Shared pricing plan data extraction and normalization utilities.
 */

/**
 * Extracts the plans array from any API response shape.
 */
export const extractPlans = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.plans)) return payload.plans;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.plans)) return payload.data.plans;

  return [];
};

/**
 * Normalizes a single plan object into a consistent shape.
 */
export const normalizePlan = (plan) => ({
  ...plan,
  id: plan?.id,
  name: plan?.name || 'Unnamed',
  description: plan?.description || '',
  priceMonthly: Number(plan?.priceMonthly) || Number(plan?.monthlyPrice) || Number(plan?.price) || 0,
  features: Array.isArray(plan?.features) ? plan.features : [],
  limits: {
    maxUsers: Number(plan?.limits?.maxUsers) || Number(plan?.maxUsers) || 0,
    maxProducts: Number(plan?.limits?.maxProducts) || Number(plan?.maxProducts) || 0,
    maxStorageMB: Number(plan?.limits?.maxStorageMB) || Number(plan?.maxStorageMB) || 0,
  },
  color: plan?.color || '#10b981',
  subscribers: Number(plan?.subscribers) || 0,
});
