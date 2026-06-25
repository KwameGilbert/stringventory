import { getPlanColor } from '../../constants/plans';

export default function PlanBadge({ plan, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const planColor = typeof plan === 'string' ? getPlanColor(plan) : plan.color || 'gray';
  const planName = typeof plan === 'string' ? plan : plan.name || plan;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses[size]} ${colorClasses[planColor]}`}
    >
      {planName}
    </span>
  );
}
