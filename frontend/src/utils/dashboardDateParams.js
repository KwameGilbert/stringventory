export const getDashboardDateParams = (dateRange) => {
  if (typeof dateRange === 'object' && dateRange !== null) {
    const params = {};
    if (dateRange.startDate) params.dateFrom = dateRange.startDate;
    if (dateRange.endDate) params.dateTo = dateRange.endDate;
    return params;
  }

  // "All time": send no date bounds
  if (dateRange === 'all') return {};

  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);

  switch (dateRange) {
    case 'today':
      break;
    case '7days':
      startDate.setDate(now.getDate() - 6);
      break;
    case '30days':
      startDate.setDate(now.getDate() - 29);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 89);
      break;
    case 'year':
      startDate.setMonth(0, 1);
      break;
    default:
      startDate.setDate(now.getDate() - 29);
      break;
  }

  const formatDate = (value) => value.toISOString().split('T')[0];

  return {
    dateFrom: formatDate(startDate),
    dateTo: formatDate(endDate),
  };
};

// Normalize a record date to the YYYY-MM-DD (UTC) keys the header filter uses;
// date-only strings are kept as-is so they don't shift across time zones.
export const toDateKey = (value) => {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
};

// True when a record date falls inside the header date filter. Open bounds
// (e.g. the "All time" preset) don't exclude anything.
export const isWithinDateFilter = (value, filter) => {
  const startDate = filter?.startDate;
  const endDate = filter?.endDate;
  if (!startDate && !endDate) return true;

  const dateKey = toDateKey(value);
  if (!dateKey) return false;
  if (startDate && dateKey < startDate) return false;
  if (endDate && dateKey > endDate) return false;
  return true;
};

// API query params ({ dateFrom, dateTo }) for the header date filter
export const getDateFilterParams = (filter) =>
  getDashboardDateParams({ startDate: filter?.startDate, endDate: filter?.endDate });

export default getDashboardDateParams;
