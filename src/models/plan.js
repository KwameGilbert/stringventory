/**
 * Shared pricing plan data extraction and normalization utilities.
 */

/**
 * Extracts the plans array from any API response shape.
 */
export const extractPlans = (response) => {
  // Handle direct array response
  if (Array.isArray(response)) return response;
  
  const payload = response?.data || response || {};

  // Check if payload is already an array (direct data property with array)
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.plans)) return payload.plans;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.plans)) return payload.data.plans;

  console.warn('Could not extract plans from response:', response);
  return [];
};

/**
 * Normalizes a single plan object into a consistent shape.
 */
export const normalizePlan = (plan) => {
  // Extract features from marketingFeatures and systemCapabilities if available
  const features = Array.isArray(plan?.features) 
    ? plan.features 
    : [
        ...(Array.isArray(plan?.marketingFeatures) ? plan.marketingFeatures : []),
        ...(Array.isArray(plan?.systemCapabilities) ? plan.systemCapabilities : [])
      ];

  // Extract feature flags from featureFlags or apiFeatures
  const featureFlags = Array.isArray(plan?.featureFlags) 
    ? plan.featureFlags 
    : Array.isArray(plan?.apiFeatures) 
      ? plan.apiFeatures 
      : [];

  return {
    ...plan,
    id: plan?.id,
    name: plan?.name || 'Unnamed',
    description: plan?.description || '',
    priceMonthly: Number(plan?.priceMonthly) || Number(plan?.monthlyPrice) || Number(plan?.price) || 0,
    priceYearly: Number(plan?.priceYearly) || Number(plan?.yearlyPrice) || 0,
    trialDays: Number(plan?.trialDays) || 0,
    isPopular: Boolean(plan?.isPopular) || false,
    status: String(plan?.status || 'active').toLowerCase(),
    features: features || [],
    featureFlags: featureFlags || [],
    limits: {
      maxUsers: Number(plan?.limits?.maxUsers) || Number(plan?.maxUsers) || 0,
      maxProducts: Number(plan?.limits?.maxProducts) || Number(plan?.maxProducts) || 0,
      maxStorageMB: Number(plan?.limits?.maxStorageMB) || Number(plan?.maxStorageMb) || 0,
      maxOrdersPerMonth: Number(plan?.limits?.maxOrdersPerMonth) || Number(plan?.maxOrdersPerMonth) || 0,
      maxCategories: Number(plan?.limits?.maxCategories) || Number(plan?.maxCategories) || 0,
      maxSuppliers: Number(plan?.limits?.maxSuppliers) || Number(plan?.maxSuppliers) || 0,
      maxCustomers: Number(plan?.limits?.maxCustomers) || Number(plan?.maxCustomers) || 0,
      maxLocations: Number(plan?.limits?.maxLocations) || Number(plan?.maxLocations) || 0,
    },
    color: plan?.color || plan?.themeColor || '#10b981',
    subscribers: Number(plan?.subscribers) || Number(plan?.active_businesses) || 0,
    monthlyRecurringRevenue: Number(plan?.monthlyRecurringRevenue) || Number(plan?.mrr) || 0,
    createdAt: plan?.createdAt,
    updatedAt: plan?.updatedAt,
  };
};
