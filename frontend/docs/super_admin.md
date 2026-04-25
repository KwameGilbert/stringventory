# Super Admin Dashboard API Payloads

This document outlines the expected JSON payloads for the Super Admin Dashboard components, based on the current frontend implementation in `SuperadminDashboard.jsx`.

## 1. Platform Analytics
**Endpoint**: `GET /api/super-admin/analytics`
**Service**: `superadminService.getPlatformAnalytics()`

```json
{
  "status": "success",
  "data": {
    "analytics": {
      "totalBusinesses": 128,
      "activeSubscriptions": 112,
      "monthlyRecurringRevenue": 15420.50,
      "totalUsers": 1240,
      "businessesChange": 12.5,
      "subscriptionsChange": 8.2,
      "mrrChange": 15.4,
      "usersChange": 5.4,
      "currency": "USD",
      "revenueTrends": [
        { "month": "Jan", "revenue": 10200, "subscriptions": 85 },
        { "month": "Feb", "revenue": 11500, "subscriptions": 92 },
        { "month": "Mar", "revenue": 13800, "subscriptions": 104 },
        { "month": "Apr", "revenue": 15420, "subscriptions": 112 }
      ],
      "planDistribution": [
        { "plan": "Basic", "count": 45, "revenue": 1305, "percentage": 40.2, "color": "bg-emerald-500" },
        { "plan": "Professional", "count": 52, "revenue": 4108, "percentage": 46.4, "color": "bg-blue-500" },
        { "plan": "Enterprise", "count": 15, "revenue": 10007, "percentage": 13.4, "color": "bg-amber-500" }
      ],
      "recentActivity": [
        {
          "id": 1,
          "type": "signup",
          "business": "Global Tech Solutions",
          "plan": "Professional",
          "time": "2 minutes ago"
        },
        {
          "id": 2,
          "type": "upgrade",
          "business": "Riverside Retail",
          "plan": "Enterprise",
          "time": "45 minutes ago"
        },
        {
          "id": 3,
          "type": "payment",
          "business": "Summit Logistics",
          "amount": 299,
          "time": "2 hours ago"
        },
        {
          "id": 4,
          "type": "cancellation",
          "business": "Old School Books",
          "time": "5 hours ago"
        }
      ]
    }
  }
}
```

---

## 2. Businesses Management
**Endpoint**: `GET /api/super-admin/businesses`
**Service**: `superadminService.getBusinesses()`

```json
{
  "status": "success",
  "data": {
    "businesses": [
      {
        "id": "biz_7721",
        "name": "Acme Corp",
        "email": "admin@acme.com",
        "status": "active",
        "subscription_plan": "professional",
        "mrr": 79.00,
        "current_usage": { "total_users": 12, "total_products": 450 },
        "usage_limits": { "maxUsers": 20, "maxProducts": 5000 },
        "created_at": "2024-03-15T10:30:00Z"
      }
    ],
    "stats": {
      "total": 128,
      "active": 112,
      "suspended": 12,
      "pending": 4
    }
  }
}
```

---

## 3. Roles & Permissions
**Endpoint**: `GET /api/super-admin/roles`
**Service**: `superadminService.getRoles()`

```json
{
  "status": "success",
  "data": [
    {
      "id": "business_admin",
      "name": "Business Admin",
      "isSystemRole": true,
      "description": "Full access to all business features",
      "permissions": ["*"],
      "userCount": 284
    },
    {
      "id": "inventory_manager",
      "name": "Inventory Manager",
      "isSystemRole": false,
      "description": "Manage products and stock levels",
      "permissions": ["view_products", "edit_products", "view_inventory"],
      "userCount": 156
    }
  ]
}
```

---

## 4. Advanced Analytics (Extended)
**Endpoint**: `GET /api/super-admin/analytics/v2`
**Service**: `superadminService.getPlatformAnalytics()`

```json
{
  "status": "success",
  "data": {
    "kpi": {
      "revenue": { "current": 42500, "change": 25 },
      "users": { "current": 1450, "change": 18 },
      "activeBusinesses": { "current": 185, "change": 12 },
      "churnRate": { "current": 2.4, "change": -0.5 }
    },
    "revenueTrends": [
      { "month": "Oct", "revenue": 28000, "mrr": 27500 },
      { "month": "Nov", "revenue": 31000, "mrr": 30500 }
    ],
    "revenueByPlan": [
      { "plan": "Starter", "revenue": 4455, "fill": "#3b82f6" },
      { "plan": "Pro", "revenue": 54000, "fill": "#10b981" }
    ],
    "topBusinesses": [
      { "id": "1", "name": "NC Avenue Wholesale", "revenue": 1500, "growth": 12 }
    ]
  }
}
```

---

## 5. Pricing Plan Comparison
**Endpoint**: `GET /api/super-admin/pricing-plans/comparison`
**Service**: `superadminService.getPlanComparison()`

```json
{
  "status": "success",
  "data": [
    {
      "category": "Stock Management",
      "features": [
        { "name": "Product Limit", "starter": "500", "pro": "5000", "enterprise": "Unlimited" },
        { "name": "Barcode Gen", "starter": false, "pro": true, "enterprise": true }
      ]
    },
    {
      "category": "Analytics",
      "features": [
        { "name": "Advanced Reports", "starter": "Basic", "pro": "Advanced", "enterprise": "Custom" }
      ]
    }
  ]
}
```

---

## 6. System Settings

### GET /settings
**Response:**
```json
{
  "data": {
    "general": {
      "platformName": "StringVentory",
      "platformEmail": "admin@stringventory.com",
      "supportEmail": "support@stringventory.com",
      "companyName": "StringTech Solutions",
      "maintenanceMode": false
    },
    "appearance": {
      "primaryColor": "emerald",
      "themeMode": "light",
      "density": "comfortable"
    },
    "notifications": {
      "emailNotifications": true,
      "newBusinessNotification": true,
      "paymentNotification": true,
      "systemAlerts": true,
      "emailProvider": "smtp",
      "smtpConfig": {
        "host": "smtp.mailtrap.io",
        "port": "587",
        "user": "user_123",
        "senderName": "StringVentory Admin",
        "senderEmail": "noreply@stringventory.com"
      }
    },
    "billing": {
      "currency": "USD",
      "taxRate": 15.0,
      "invoicePrefix": "SV-",
      "enableTrials": true,
      "trialDays": 14
    },
    "security": {
      "twoFactorAuth": true,
      "sessionTimeout": 30,
      "passwordExpiry": 90,
      "loginAttempts": 5
    },
    "integrations": {
      "apiKeys": [
        { "id": "1", "name": "Frontend API", "key": "pk_live_****************", "status": "active", "createdAt": "2026-01-01" }
      ],
      "webhooks": [
        { "id": "1", "url": "https://hooks.slack.com/services/...", "event": "business.signup", "status": "active" }
      ]
    }
  }
}
```

### PUT /settings
Update platform-wide configurations.

**Payload:** Same as GET response `data` object.

---

## 7. Messaging & Notifications
**Endpoint**: `GET /api/super-admin/notifications`
**Service**: `superadminService.getNotifications()`

```json
{
  "status": "success",
  "data": [
    {
      "id": "notif_1",
      "type": "system_alert",
      "message": "High server load detected in Region A",
      "severity": "high",
      "createdAt": "2024-04-22T20:00:00Z"
    },
    {
      "id": "notif_2",
      "type": "new_business",
      "message": "Spark Retail completed onboarding",
      "severity": "low",
      "createdAt": "2024-04-22T21:15:00Z"
    }
  ]
}
```

## Implementation Notes
- **Normalization**: The frontend uses `normalizeBusiness` and `extractAnalytics` helpers to handle variations. If the backend wraps the response in a `data` object, the frontend will automatically drill down.
- **Currency**: The `currency` field in the analytics payload dictates the symbol used across the dashboard.
- **Comparison Table**: The `Pricing Plan Comparison` payload drives the high-fidelity matrix at the bottom of the Pricing Plans page.
