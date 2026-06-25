# Activity Logs Implementation Guide

## Overview
This document describes the complete implementation of the Activity Logs feature in the Stringventory admin dashboard, including API integration, services, and UI components.

## Files Updated/Created

### 1. API Endpoints (`src/services/api.endpoints.js`)
**Added:**
```javascript
ANALYTICS: {
  // ... existing endpoints
  ACTIVITY_LOGS: '/v1/analytics/activity-logs',
}
```

**Endpoint Details:**
- **Method:** GET
- **URL:** `/v1/analytics/activity-logs`
- **Auth:** Required (Bearer Token)
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `module` (optional) - Filter by module (Inventory, Sales, Expenses, etc.)
  - `severity` (optional) - Filter by severity (info, warning, critical)
  - `userId` (optional) - Filter by user ID
  - `startDate` (optional) - Filter from start date
  - `endDate` (optional) - Filter to end date

### 2. Analytics Service (`src/services/analyticsService.js`)
**Added Method:**
```javascript
getActivityLogs: async (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 10,
    ...params,
  };
  return await apiClient.get(API_ENDPOINTS.ANALYTICS.ACTIVITY_LOGS, { 
    params: defaultParams 
  });
}
```

**Parameters Supported:**
- `page` - Page number for pagination
- `limit` - Items per page (default: 10)
- `module` - Filter by module
- `severity` - Filter by severity level
- `userId` - Filter by specific user
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

### 3. Activity Logs Dashboard Component (`src/components/admin/Dashboard/ActivityLogsDashboard.jsx`)

**Features Implemented:**

#### Real-Time Summary Stats
- **Active Users Count** - Number of users currently active
- **Total Actions Count** - Total actions performed in the system
- **Most Active User** - Shows name, action count, and primary module

#### Search & Filtering
- **Global Search** - Search through logs by keyword
- **Module Filter** - Filter by specific module:
  - Inventory
  - Sales
  - Expenses
  - Procurement
  - Security
  - Settings
  - System

- **Severity Filter** - Filter by impact level:
  - Info (blue)
  - Warning (yellow)
  - Critical (red)

- **Date Range Filter** - Filter by start and end dates
- **Reset Filters** - Quick reset to default state

#### Activity Logs Table
Displays the following columns:
- **Time** - When the action occurred (formatted: MMM DD, HH:MM)
- **User** - User who performed the action with their role
- **Module** - The module affected with color-coded icon
- **Action** - Description of the action performed
- **Details** - Additional context about the action (truncated)
- **Severity** - Visual severity badge (Info/Warning/Critical)

#### Pagination
- Previous/Next navigation
- Shows current page and total pages
- Disables buttons at boundaries

#### Loading & Error States
- Loading spinner during data fetch
- Error message display with details
- Empty state when no logs found

#### Color Coding by Module
| Module | Color |
|--------|-------|
| Inventory | Emerald |
| Sales | Emerald |
| Expenses | Red |
| Security | Red |
| Procurement | Blue |
| Settings | Blue |
| System | Gray |

## API Response Format

```json
{
  "status": "success",
  "data": {
    "summary": {
      "activeUsers": 4,
      "totalActions": 1256,
      "mostActiveUser": {
        "name": "Anthony Afriyie",
        "actionCount": 84,
        "primaryModule": "Inventory"
      }
    },
    "logs": [
      {
        "id": "log_00001A",
        "time": "2026-04-27T13:22:00Z",
        "user": {
          "id": "usr_1",
          "name": "Anthony Afriyie",
          "role": "Admin"
        },
        "module": "Inventory",
        "action": "Stock Adjusted",
        "details": "Premium Basmati Rice adjusted by +50 units",
        "severity": "info",
        "metadata": {
          "reason": "Manual adjustment",
          "previousValue": 120,
          "newValue": 170
        }
      }
    ],
    "pagination": {
      "total": 1256,
      "page": 1,
      "limit": 10
    }
  }
}
```

## Usage

### Import the Component
```javascript
import ActivityLogsDashboard from '@/components/admin/Dashboard/ActivityLogsDashboard';
```

### Use in a Page/Route
```javascript
export default function ActivityLogsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Activity Logs</h1>
      <ActivityLogsDashboard />
    </div>
  );
}
```

### Using the Service Directly
```javascript
import analyticsService from '@/services/analyticsService';

// Fetch activity logs with pagination
const response = await analyticsService.getActivityLogs({
  page: 1,
  limit: 10,
  module: 'Inventory',
  severity: 'warning',
  startDate: '2026-04-01',
  endDate: '2026-04-30'
});

console.log(response.data.data.logs);
console.log(response.data.data.summary);
```

## Feature Gating

Activity logs are an **Enterprise-tier feature**:
- Defined in: `src/constants/features.js`
- Feature flag: `AUDIT_LOGS`
- Required plan: `enterprise`

To restrict access:
```javascript
import { useSubscription } from '@/contexts/SubscriptionProvider';

function ActivityLogsPage() {
  const { hasFeature } = useSubscription();

  if (!hasFeature('AUDIT_LOGS')) {
    return <UpgradePrompt feature="Activity Logs" requiredPlan="Enterprise" />;
  }

  return <ActivityLogsDashboard />;
}
```

## Styling

### Dependencies
- **Lucide React** - Icons (Activity, Settings, Package, ShoppingCart, etc.)
- **Tailwind CSS** - Styling

### Theme
- Primary color: Emerald (emerald-600)
- Secondary colors: Blue, Red, Yellow, Gray
- Dark mode compatible with Tailwind's dark mode utilities

## Performance Considerations

1. **Pagination** - Server-side pagination to handle large datasets
2. **Filtering** - Performed on backend to reduce data transfer
3. **Memoization** - Component uses React hooks for efficient state management
4. **Debouncing** - Consider debouncing the search input for production

## Future Enhancements

1. **Export Functionality**
   - Export logs to CSV/PDF
   - Schedule automated exports

2. **Real-time Updates**
   - WebSocket integration for live log updates
   - Auto-refresh capability

3. **Advanced Analytics**
   - Activity trends chart
   - User activity heatmap
   - Module usage statistics

4. **Audit Trail**
   - Detailed metadata view for each log
   - Change history tracking
   - Compliance reporting

5. **Alerts & Notifications**
   - Alert on critical activities
   - Custom alert rules
   - Email notifications

6. **Data Retention**
   - Configurable retention policies
   - Archival of old logs
   - Compliance with data protection regulations

## Testing

### Component Testing
```javascript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityLogsDashboard from '@/components/admin/Dashboard/ActivityLogsDashboard';

describe('ActivityLogsDashboard', () => {
  it('should render the component', () => {
    render(<ActivityLogsDashboard />);
    expect(screen.getByText(/Activity Logs/i)).toBeInTheDocument();
  });

  it('should fetch and display logs', async () => {
    render(<ActivityLogsDashboard />);
    await screen.findByText('Inventory');
    expect(screen.getByText('Premium Basmati Rice adjusted by +50 units')).toBeInTheDocument();
  });
});
```

### API Testing
```javascript
// Test the service
import analyticsService from '@/services/analyticsService';

test('getActivityLogs returns formatted response', async () => {
  const response = await analyticsService.getActivityLogs({ page: 1, limit: 10 });
  expect(response.data.status).toBe('success');
  expect(response.data.data.logs).toBeInstanceOf(Array);
  expect(response.data.data.summary).toBeDefined();
});
```

## Troubleshooting

### Logs not loading
- Check API endpoint URL in API_ENDPOINTS
- Verify authentication token is valid
- Check browser console for errors

### Pagination not working
- Ensure `page` and `limit` parameters are being sent
- Verify backend is calculating pagination correctly
- Check pagination data in response

### Filters not applying
- Verify filter values match backend expectations
- Check that filters are being passed as query parameters
- Ensure backend is filtering correctly

## Support & Documentation

For more information:
- Backend API documentation: `/docs/API_INTEGRATION_GUIDE.md`
- Feature gating: `src/constants/features.js`
- Analytics service: `src/services/analyticsService.js`
