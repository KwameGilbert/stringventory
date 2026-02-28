export const getDashboardDateParams = (dateRange) => {
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

export default getDashboardDateParams;
