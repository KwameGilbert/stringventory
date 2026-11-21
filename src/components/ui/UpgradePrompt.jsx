import { AlertCircle, ArrowUpRight } from 'lucide-react';
import { getRequiredPlanForFeature, getUpgradeMessage } from '../../utils/featureGating';
import { PRICING_PLANS } from '../../constants/plans';

export default function UpgradePrompt({ 
  feature, 
  currentPlan,
  onUpgrade,
  variant = 'banner' // 'banner' or 'modal'
}) {
  const upgradeInfo = getUpgradeMessage(feature);
  const requiredPlanId = getRequiredPlanForFeature(feature);
  const requiredPlan = PRICING_PLANS.find(p => p.id === requiredPlanId);

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">
              Upgrade Required
            </h3>
            <p className="text-sm text-emerald-800 mb-3">
              {upgradeInfo.message}
            </p>
            {requiredPlan && (
              <div className="flex items-center gap-3">
                <button
                  onClick={onUpgrade}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Upgrade to {requiredPlan.name}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-emerald-700">
                  Starting at ${requiredPlan.priceMonthly}/month
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Modal variant (can be used in a modal/dialog)
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        This Feature is Locked
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {upgradeInfo.message}
      </p>
      {requiredPlan && (
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Upgrade to {requiredPlan.name}
            <ArrowUpRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-gray-500">
            Starting at ${requiredPlan.priceMonthly}/month
          </p>
        </div>
      )}
    </div>
  );
}
