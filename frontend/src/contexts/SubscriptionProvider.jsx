import { SubscriptionContext } from './TenantContext';
import { useTenant } from './useTenant';
import { hasFeatureAccess, isWithinUsageLimit, getUsagePercentage } from '../utils/featureGating';

export const SubscriptionProvider = ({ children }) => {
  const { currentBusiness } = useTenant();

  const currentPlan = currentBusiness?.subscription_plan || 'free_trial';
  const subscriptionStatus = currentBusiness?.subscription_status || 'trial';

  const hasFeature = (featureName) => {
    return hasFeatureAccess(currentPlan, featureName);
  };

  const checkUsageLimit = (limitType, currentValue) => {
    return isWithinUsageLimit(currentPlan, limitType, currentValue);
  };

  const getUsageLimit = (limitType) => {
    const limits = currentBusiness?.usage_limits || {};
    return limits[limitType] || 0;
  };

  const getCurrentUsage = (usageType) => {
    const usage = currentBusiness?.current_usage || {};
    return usage[usageType] || 0;
  };

  const getUsageLimitPercentage = (limitType) => {
    const current = getCurrentUsage(limitType);
    return getUsagePercentage(currentPlan, limitType, current);
  };

  const isTrialExpired = () => {
    if (!currentBusiness?.trial_ends_at) return false;
    return new Date(currentBusiness.trial_ends_at) < new Date();
  };

  const getDaysLeftInTrial = () => {
    if (!currentBusiness?.trial_ends_at) return 0;
    const diff = new Date(currentBusiness.trial_ends_at) - new Date();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const value = {
    currentPlan,
    subscriptionStatus,
    hasFeature,
    checkUsageLimit,
    getUsageLimit,
    getCurrentUsage,
    getUsageLimitPercentage,
    isTrialExpired,
    getDaysLeftInTrial,
    planDetails: currentBusiness
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
