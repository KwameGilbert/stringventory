# Activity Logs Mock Data & Backend Implementation

## Current Status

The Activity Logs feature is **fully integrated on the frontend** with:
- ✅ Mock data for development/testing
- ✅ Component displays sample data
- ✅ All filtering and pagination UI working
- ✅ Ready for backend API integration

## Frontend Mock Data

The component includes sample data for testing:

```javascript
{
  summary: {
    activeUsers: 4,
    totalActions: 1256,
    mostActiveUser: {
      name: 'Anthony Afriyie',
      actionCount: 84,
      primaryModule: 'Inventory',
    },
  },
  logs: [
    // Sample log entries with different modules and severities
  ]
}
```

## Backend API Implementation

### Endpoint Specification

**URL**: `GET /v1/analytics/activity-logs`

**Authentication**: Bearer Token (required)

**Query Parameters**:
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Items per page
- `module` (optional) - Filter by module (Inventory, Sales, Expenses, Procurement, Security, Settings, System)
- `severity` (optional) - Filter by severity (info, warning, critical)
- `userId` (optional) - Filter by user ID
- `startDate` (optional) - Filter from ISO date string
- `endDate` (optional) - Filter to ISO date string

### Response Format

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
      },
      // ... more logs
    ],
    "pagination": {
      "total": 1256,
      "page": 1,
      "limit": 10
    }
  }
}
```

### Field Requirements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique log identifier (e.g., `log_00001A`) |
| time | ISO 8601 | Yes | Timestamp of the activity |
| user.id | string | Yes | ID of the user who performed action |
| user.name | string | Yes | Full name of the user |
| user.role | string | Yes | User's role (Admin, Manager, etc.) |
| module | string | Yes | Module affected (Inventory, Sales, etc.) |
| action | string | Yes | Action title/name |
| details | string | Yes | Human-readable description |
| severity | string | Yes | Level: `info`, `warning`, or `critical` |
| metadata | object | No | Additional context data |

### Supported Modules

- `Inventory` - Stock adjustments, transfers, etc.
- `Sales` - Orders, refunds, etc.
- `Expenses` - Expense creation, updates
- `Procurement` - Purchases, supplier management
- `Security` - Login attempts, access violations
- `Settings` - Configuration changes
- `System` - System-level operations

### Severity Levels

- `info` (blue) - Normal operations
- `warning` (yellow) - Notable changes or potential issues
- `critical` (red) - Security events or critical failures

## Implementation Steps

1. **Create Activity Log Table/Collection**
   - Store log entries with all required fields
   - Add indexes on: userId, module, severity, createdAt for fast filtering

2. **Track Activities in CRUD Operations**
   - Log when products are created/updated/deleted
   - Log when inventory is adjusted
   - Log when orders are created
   - Log when users log in/out
   - Log security events (failed logins, permission violations)
   - Log settings changes

3. **Implement GET Endpoint**
   - Apply filters based on query parameters
   - Implement pagination
   - Calculate summary statistics (activeUsers count, totalActions, mostActiveUser)
   - Return formatted response as specified above

4. **Add Middleware for Activity Logging**
   - Create middleware to automatically log API calls
   - Include user info, module, action, and timestamp
   - Store metadata relevant to the action

## Testing the Integration

### Before Backend is Ready
- The frontend shows **mock data** automatically
- Dev banner displays: "Currently displaying mock data"
- All UI components are fully functional

### After Backend Implementation
1. The API endpoint becomes active
2. Frontend automatically fetches real data
3. Dev banner disappears
4. Filtering and pagination work with real data

### Test Queries

```javascript
// Get page 1 with default limit
GET /v1/analytics/activity-logs?page=1&limit=10

// Filter by module
GET /v1/analytics/activity-logs?page=1&limit=10&module=Inventory

// Filter by severity
GET /v1/analytics/activity-logs?page=1&limit=10&severity=critical

// Filter by date range
GET /v1/analytics/activity-logs?page=1&limit=10&startDate=2026-04-01&endDate=2026-04-30

// Combine filters
GET /v1/analytics/activity-logs?page=1&limit=10&module=Inventory&severity=warning&startDate=2026-04-20
```

## Integration with Other Modules

When implementing activity logging across your system:

```javascript
// Example: Log a product update
async function updateProduct(id, data) {
  const product = await Product.update(id, data);
  
  // Log the activity
  await ActivityLog.create({
    id: generateLogId(),
    time: new Date().toISOString(),
    user: { id: req.user.id, name: req.user.name, role: req.user.role },
    module: 'Inventory',
    action: 'Product Updated',
    details: `Product "${product.name}" has been updated`,
    severity: 'info',
    metadata: {
      productId: id,
      changedFields: Object.keys(data)
    }
  });
  
  return product;
}
```

## Frontend Error Handling

Currently, if the API fails:
1. Console displays warning messages
2. Mock data is shown to users
3. Dev banner indicates development mode
4. "Try Again" button available in error state

Once backend is ready, this automatically switches to real data with no code changes needed.

## Performance Optimization

Consider implementing:
- **Database indexes** on frequently filtered columns
- **Caching** of summary statistics (recalculated hourly)
- **Archival** of old logs (keep last 90 days active)
- **Log rotation** to prevent unlimited growth
- **Aggregation queries** for summary stats

## Security Considerations

- ✅ Authentication required (Bearer token)
- ✅ Logs only contain non-sensitive metadata
- ✅ User can only see logs from their tenant
- ✅ Sensitive actions should still log but not store full data
- ✅ Log access should be audit-trailed

## Next Steps

1. Implement the API endpoint as specified
2. Add activity logging to business logic
3. Deploy and test with real data
4. Monitor performance and adjust caching/archival as needed
5. Consider adding export functionality for compliance

For questions or clarifications, see `docs/ACTIVITY_LOGS_GUIDE.md` in the frontend.
