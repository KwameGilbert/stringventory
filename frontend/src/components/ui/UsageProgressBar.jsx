import { getUsageStatusColor, formatUsageDisplay } from '../../utils/featureGating';

export default function UsageProgressBar({ 
  label, 
  current, 
  limit, 
  percentage,
  showPercentage = true,
  size = 'md'
}) {
  const calculatedPercentage = percentage !== undefined ? percentage : limit === -1 ? 0 : (current / limit) * 100;
  const color = getUsageStatusColor(calculatedPercentage);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">
            {formatUsageDisplay(current, limit)}
            {showPercentage && limit !== -1 && (
              <span className="ml-2 text-gray-500">({Math.round(calculatedPercentage)}%)</span>
            )}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(calculatedPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
