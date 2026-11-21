import { BUSINESS_STATUS, SUBSCRIPTION_STATUS } from '../../constants/features';

export default function StatusBadge({ status, type = 'business', size = 'md' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const getStatusColor = () => {
    // Business status colors
    if (type === 'business') {
      switch (status) {
        case BUSINESS_STATUS.ACTIVE:
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case BUSINESS_STATUS.TRIAL:
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case BUSINESS_STATUS.SUSPENDED:
          return 'bg-amber-100 text-amber-800 border-amber-200';
        case BUSINESS_STATUS.CANCELLED:
          return 'bg-red-100 text-red-800 border-red-200';
        case BUSINESS_STATUS.PENDING:
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    // Subscription status colors
    if (type === 'subscription') {
      switch (status) {
        case SUBSCRIPTION_STATUS.ACTIVE:
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case SUBSCRIPTION_STATUS.TRIAL:
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case SUBSCRIPTION_STATUS.PAST_DUE:
          return 'bg-amber-100 text-amber-800 border-amber-200';
        case SUBSCRIPTION_STATUS.CANCELLED:
        case SUBSCRIPTION_STATUS.EXPIRED:
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }

    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatStatus = (str) => {
    return str.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses[size]} ${getStatusColor()}`}
    >
      {formatStatus(status)}
    </span>
  );
}
