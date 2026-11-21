import { PRICING_PLANS } from '../constants/plans';
import { FEATURE_PLAN_MAPPING } from '../constants/features';

const PLAN_HIERARCHY = {
  'free_trial': 0,
  'starter': 1,
  'professional': 2,
  'enterprise': 3
};

/**
 * Check if a feature is available in the current subscription plan
 */
export const hasFeatureAccess = (currentPlan, featureName) => {
  const plan = PRICING_PLANS.find(p => p.id === currentPlan);
  
  if (!plan) return false;
  
  return plan.featureFlags.includes(featureName);
};

/**
 * Check if usage limit is exceeded
 */
export const isWithinUsageLimit = (currentPlan, limitType, currentValue) => {
  const plan = PRICING_PLANS.find(p => p.id === currentPlan);
  
  if (!plan) return false;
  
  const limit = plan.limits[limitType];
  
  // -1 means unlimited
  if (limit === -1) return true;
  
  return currentValue < limit;
};

/**
 * Get the minimum plan required for a feature
 */
export const getRequiredPlanForFeature = (featureName) => {
  return FEATURE_PLAN_MAPPING[featureName] || 'enterprise';
};

/**
 * Check if current plan can be upgraded to target plan
 */
export const canUpgradeTo = (currentPlan, targetPlan) => {
  const currentLevel = PLAN_HIERARCHY[currentPlan] || 0;
  const targetLevel = PLAN_HIERARCHY[targetPlan] || 0;
  return targetLevel > currentLevel;
};

/**
 * Check if current plan can be downgraded to target plan
 */
export const canDowngradeTo = (currentPlan, targetPlan) => {
  const currentLevel = PLAN_HIERARCHY[currentPlan] || 0;
  const targetLevel = PLAN_HIERARCHY[targetPlan] || 0;
  return targetLevel < currentLevel;
};

/**
 * Get upgrade message for locked feature
 */
export const getUpgradeMessage = (featureName) => {
  const requiredPlan = getRequiredPlanForFeature(featureName);
  const plan = PRICING_PLANS.find(p => p.id === requiredPlan);
  
  return {
    featureName,
    requiredPlan: plan?.name || 'Unknown',
    message: `This feature requires ${plan?.name || 'a higher'} plan. Upgrade now to unlock it!`
  };
};

/**
 * Calculate percentage of usage limit
 */
export const getUsagePercentage = (currentPlan, limitType, currentValue) => {
  const plan = PRICING_PLANS.find(p => p.id === currentPlan);
  
  if (!plan) return 0;
  
  const limit = plan.limits[limitType];
  
  if (limit === -1) return 0; // Unlimited
  
  return Math.min((currentValue / limit) * 100, 100);
};

/**
 * Get remaining usage
 */
export const getRemainingUsage = (currentPlan, limitType, currentValue) => {
  const plan = PRICING_PLANS.find(p => p.id === currentPlan);
  
  if (!plan) return 0;
  
  const limit = plan.limits[limitType];
  
  if (limit === -1) return Infinity;
  
  return Math.max(limit - currentValue, 0);
};

/**
 * Format usage display
 */
export const formatUsageDisplay = (current, limit) => {
  if (limit === -1) return `${current.toLocaleString()} / Unlimited`;
  return `${current.toLocaleString()} / ${limit.toLocaleString()}`;
};

/**
 * Get usage status color
 */
export const getUsageStatusColor = (percentage) => {
  if (percentage >= 90) return 'red';
  if (percentage >= 75) return 'amber';
  if (percentage >= 50) return 'yellow';
  return 'emerald';
};
