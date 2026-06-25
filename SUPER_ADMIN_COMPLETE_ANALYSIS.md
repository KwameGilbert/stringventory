# Super Admin Dashboard - Complete Feature & API Payload Analysis

**Base URL:** `https://stringventory-sass-api.onrender.com/`

**Authentication:** All endpoints require Bearer Token in Authorization header
```
Authorization: Bearer <access_token>
```

---

## 📋 Table of Contents

1. [Dashboard Features](#dashboard-features)
2. [Businesses Management](#businesses-management)
3. [Pricing Plans](#pricing-plans)
4. [Analytics](#analytics)
5. [Messaging](#messaging)
6. [Notifications](#notifications)
7. [Profile Management](#profile-management)
8. [Settings](#settings)
9. [Roles & Permissions](#roles--permissions)

---

## 🎯 Dashboard Features

### Feature 1: Platform Dashboard (Overview)

**Page:** `SuperadminDashboard.jsx`
**Route:** `/superadmin/dashboard`
**Features:**
- KPI Cards (Total Businesses, Active Subscriptions, MRR, Total Users)
- Revenue trend chart
- Plan distribution pie chart
- Recent activity feed
- Recent businesses table

#### API Call 1.1: Get Platform Analytics
```bash
GET /superadmin/analytics/platform
Authorization: Bearer <token>

Query Parameters:
- timeRange (optional): '7days', '30days', '90days' (default: '30days')

Response:
{
  "success": true,
  "data": {
    "totalBusinesses": 285,
    "activeSubscriptions": 247,
    "monthlyRecurringRevenue": 42850.50,
    "totalUsers": 1847,
    "businessesChange": 12.3,
    "subscriptionsChange": 8.5,
    "mrrChange": 15.4,
    "usersChange": 23.5,
    "currency": "USD",
    "revenueTrends": [
      {
        "month": "January",
        "revenue": 28000,
        "mrr": 27500,
        "subscriptions": 190
      },
      {
        "month": "February",
        "revenue": 31200,
        "mrr": 30800,
        "subscriptions": 210
      }
    ],
    "planDistribution": [
      {
        "plan": "Starter",
        "count": 120,
        "percentage": 48.6,
        "revenue": 4455
      },
      {
        "plan": "Professional",
        "count": 85,
        "percentage": 34.4,
        "revenue": 21500
      },
      {
        "plan": "Enterprise",
        "count": 42,
        "percentage": 17.0,
        "revenue": 16895
      }
    ],
    "recentActivity": [
      {
        "id": 1,
        "type": "upgrade",
        "business": "TechStart Inc",
        "plan": "Professional",
        "amount": 299,
        "timestamp": "2026-05-25T14:30:00Z"
      },
      {
        "id": 2,
        "type": "payment",
        "business": "Global Tech Solutions",
        "plan": "Enterprise",
        "amount": 2500,
        "timestamp": "2026-05-25T12:15:00Z"
      }
    ]
  }
}
```

#### API Call 1.2: Get All Businesses (for dashboard)
```bash
GET /v1/businesses
Authorization: Bearer <token>

Query Parameters:
- limit (optional): number (default: 5 for dashboard)
- offset (optional): number

Response:
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "bus-123",
        "name": "Acme Corporation",
        "email": "admin@acme.com",
        "domain": "acme.stringventory.com",
        "status": "active",
        "subscription_plan": "professional",
        "mrr": 299,
        "current_usage": {
          "total_users": 12,
          "total_products": 345,
          "storage_used": 42
        },
        "usage_limits": {
          "maxUsers": 50,
          "maxProducts": 5000,
          "maxStorage": 100
        },
        "created_at": "2026-03-15T10:30:00Z"
      }
    ],
    "total": 285,
    "hasMore": true
  }
}
```

---

## 📊 Businesses Management

### Feature 2: List All Businesses

**Page:** `Businesses.jsx`
**Route:** `/superadmin/businesses`
**Features:**
- Table view of all businesses
- Search by name or email
- Filter by status (active, trial, suspended, cancelled)
- Filter by subscription plan
- View, Edit, Delete actions
- Statistics cards

#### API Call 2.1: Get All Businesses (Paginated)
```bash
GET /v1/businesses
Authorization: Bearer <token>

Query Parameters:
- page (optional): number (default: 1)
- limit (optional): number (default: 20)
- search (optional): string
- status (optional): 'active' | 'trial' | 'suspended' | 'cancelled'
- plan (optional): 'starter' | 'professional' | 'enterprise'

Response:
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "bus-456",
        "name": "TechStart Inc",
        "email": "admin@techstart.com",
        "owner_name": "John Doe",
        "phone": "+1234567890",
        "industry": "Technology",
        "country": "United States",
        "city": "New York",
        "address": "123 Tech Street",
        "domain": "techstart.stringventory.com",
        "status": "active",
        "subscription_plan": "professional",
        "mrr": 299,
        "current_usage": {
          "total_users": 25,
          "total_products": 1200,
          "storage_used": 75,
          "api_calls": 45000
        },
        "usage_limits": {
          "maxUsers": 100,
          "maxProducts": 10000,
          "maxStorage": 500,
          "maxApiCalls": 100000
        },
        "billing_cycle": "monthly",
        "next_billing_date": "2026-06-25T00:00:00Z",
        "subscription_status": "active",
        "created_at": "2026-01-15T08:20:00Z",
        "users": [
          {
            "id": "user-1",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@techstart.com",
            "role": "owner",
            "status": "active",
            "lastLogin": "2026-05-25T09:30:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "total": 285,
      "page": 1,
      "limit": 20,
      "pages": 15
    }
  }
}
```

### Feature 3: View Business Details

**Page:** `BusinessDetails.jsx`
**Route:** `/superadmin/businesses/:id`
**Tabs:**
- Overview (Business info, resource usage, subscription)
- Users (Business team members)
- Activity (Activity logs)
- Subscription (Billing info, renewal dates)
- Settings (Business configuration)

#### API Call 3.1: Get Business Details
```bash
GET /v1/businesses/{businessId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "business": {
      "id": "bus-456",
      "name": "TechStart Inc",
      "email": "admin@techstart.com",
      "owner_name": "John Doe",
      "phone": "+1234567890",
      "industry": "Technology",
      "country": "United States",
      "city": "New York",
      "address": "123 Tech Street",
      "domain": "techstart.stringventory.com",
      "logo_url": "https://cdn.stringventory.com/logos/techstart.png",
      "status": "active",
      "subscription_plan": "professional",
      "mrr": 299,
      "total_revenue": 8970,
      "current_usage": {
        "total_users": 25,
        "total_products": 1200,
        "storage_used": 75,
        "api_calls": 45000
      },
      "usage_limits": {
        "maxUsers": 100,
        "maxProducts": 10000,
        "maxStorage": 500,
        "maxApiCalls": 100000
      },
      "billing_cycle": "monthly",
      "next_billing_date": "2026-06-25T00:00:00Z",
      "subscription_status": "active",
      "created_at": "2026-01-15T08:20:00Z",
      "users": [
        {
          "id": "user-1",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@techstart.com",
          "role": "owner",
          "status": "active",
          "phone": "+1234567890",
          "emailVerified": true,
          "lastLogin": "2026-05-25T09:30:00Z"
        },
        {
          "id": "user-2",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@techstart.com",
          "role": "manager",
          "status": "active",
          "phone": "+1234567891",
          "emailVerified": true,
          "lastLogin": "2026-05-24T14:20:00Z"
        }
      ],
      "activityLogs": [
        {
          "id": "log-1",
          "action": "Users Added",
          "description": "Jane Smith added to business",
          "user": "John Doe",
          "timestamp": "2026-05-20T10:15:00Z",
          "ipAddress": "192.168.1.100"
        },
        {
          "id": "log-2",
          "action": "Plan Upgraded",
          "description": "Upgraded from Starter to Professional",
          "user": "John Doe",
          "timestamp": "2026-05-15T14:30:00Z",
          "ipAddress": "192.168.1.100"
        }
      ],
      "subscription": {
        "id": "sub-456",
        "status": "active",
        "plan": "professional",
        "currentPeriodStart": "2026-05-25T00:00:00Z",
        "currentPeriodEnd": "2026-06-25T00:00:00Z",
        "cancelledAt": null,
        "trialEndsAt": null,
        "billingCycle": "monthly",
        "payments": [
          {
            "id": "pay-1",
            "amount": 299,
            "currency": "USD",
            "status": "paid",
            "date": "2026-05-25T00:00:00Z",
            "invoiceId": "INV-2026-05-001"
          },
          {
            "id": "pay-2",
            "amount": 299,
            "currency": "USD",
            "status": "paid",
            "date": "2026-04-25T00:00:00Z",
            "invoiceId": "INV-2026-04-001"
          }
        ]
      }
    }
  }
}
```

### Feature 4: Create Business

**Page:** `AddBusiness.jsx` or Modal `AddBusinessModal.jsx`
**Route:** `/superadmin/businesses/new`
**Features:**
- Form with business details
- Plan selection
- Initial status selection

#### API Call 4.1: Create New Business
```bash
POST /v1/businesses
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "name": "New Tech Ventures",
  "email": "admin@newtech.com",
  "owner_name": "Alice Johnson",
  "phone": "+1987654321",
  "industry": "Technology",
  "country": "United States",
  "city": "San Francisco",
  "address": "456 Innovation Blvd",
  "subscription_plan": "starter",
  "status": "trial",
  "notes": "Early adopter, high growth potential"
}

Response:
{
  "success": true,
  "data": {
    "id": "bus-789",
    "name": "New Tech Ventures",
    "email": "admin@newtech.com",
    "owner_name": "Alice Johnson",
    "phone": "+1987654321",
    "industry": "Technology",
    "country": "United States",
    "city": "San Francisco",
    "address": "456 Innovation Blvd",
    "status": "trial",
    "subscription_plan": "starter",
    "mrr": 0,
    "current_usage": {
      "total_users": 0,
      "total_products": 0,
      "storage_used": 0,
      "api_calls": 0
    },
    "usage_limits": {
      "maxUsers": 5,
      "maxProducts": 500,
      "maxStorage": 10,
      "maxApiCalls": 10000
    },
    "trial_ends_at": "2026-06-08T00:00:00Z",
    "created_at": "2026-05-25T15:30:00Z"
  }
}
```

### Feature 5: Edit Business

**Page:** `EditBusiness.jsx`
**Route:** `/superadmin/businesses/edit/:id`

#### API Call 5.1: Update Business
```bash
PUT /v1/businesses/{businessId}
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "name": "New Tech Ventures Updated",
  "email": "admin@newtech.com",
  "phone": "+1987654321",
  "industry": "Technology",
  "country": "United States",
  "city": "San Francisco",
  "address": "456 Innovation Blvd",
  "subscription_plan": "professional",
  "status": "active"
}

Response:
{
  "success": true,
  "data": {
    "id": "bus-789",
    "name": "New Tech Ventures Updated",
    "subscription_plan": "professional",
    "status": "active",
    "mrr": 299,
    ...
  }
}
```

### Feature 6: Delete Business

#### API Call 6.1: Delete Business
```bash
DELETE /v1/businesses/{businessId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Business deleted successfully"
}
```

### Feature 7: Suspend Business

#### API Call 7.1: Suspend Business
```bash
POST /v1/businesses/{businessId}/suspend
Authorization: Bearer <token>

Request Payload (optional):
{
  "reason": "Payment failed",
  "notifyBusiness": true
}

Response:
{
  "success": true,
  "data": {
    "id": "bus-456",
    "status": "suspended",
    "suspendedAt": "2026-05-25T15:45:00Z"
  }
}
```

### Feature 8: Reactivate Business

#### API Call 8.1: Reactivate Business
```bash
POST /v1/businesses/{businessId}/reactivate
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "bus-456",
    "status": "active",
    "reactivatedAt": "2026-05-25T16:00:00Z"
  }
}
```

---

## 💰 Pricing Plans

### Feature 9: List Pricing Plans

**Page:** `PricingPlans.jsx`
**Route:** `/superadmin/pricing-plans`
**Features:**
- Plans overview cards
- Subscriber count per plan
- Revenue metrics
- Plan comparison table
- Create new plan button

#### API Call 9.1: Get All Pricing Plans
```bash
GET /v1/plans
Authorization: Bearer <token>

Query Parameters:
- status (optional): 'active' | 'inactive' | 'archived'

Response:
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan-starter",
        "name": "Starter",
        "description": "Perfect for new businesses",
        "priceMonthly": 49,
        "priceYearly": 490,
        "trialDays": 14,
        "isPopular": false,
        "status": "active",
        "color": "#10b981",
        "features": [
          "Up to 5 users",
          "Up to 500 products",
          "10 GB storage",
          "Email support"
        ],
        "featureFlags": [
          "inventory_management",
          "basic_reporting"
        ],
        "limits": {
          "maxUsers": 5,
          "maxProducts": 500,
          "maxStorageMB": 10240,
          "maxOrdersPerMonth": 100,
          "maxCategories": 50,
          "maxSuppliers": 20,
          "maxCustomers": 200,
          "maxLocations": 1
        },
        "subscribers": 120,
        "monthlyRecurringRevenue": 5880,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2026-05-20T10:30:00Z"
      },
      {
        "id": "plan-professional",
        "name": "Professional",
        "description": "For growing businesses",
        "priceMonthly": 299,
        "priceYearly": 2990,
        "trialDays": 14,
        "isPopular": true,
        "status": "active",
        "color": "#3b82f6",
        "features": [
          "Up to 100 users",
          "Up to 10,000 products",
          "500 GB storage",
          "Priority support",
          "Advanced analytics"
        ],
        "featureFlags": [
          "inventory_management",
          "advanced_reporting",
          "team_collaboration",
          "api_access"
        ],
        "limits": {
          "maxUsers": 100,
          "maxProducts": 10000,
          "maxStorageMB": 512000,
          "maxOrdersPerMonth": 5000,
          "maxCategories": 500,
          "maxSuppliers": 200,
          "maxCustomers": 10000,
          "maxLocations": 5
        },
        "subscribers": 85,
        "monthlyRecurringRevenue": 25415,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2026-05-20T10:30:00Z"
      },
      {
        "id": "plan-enterprise",
        "name": "Enterprise",
        "description": "For large enterprises",
        "priceMonthly": 999,
        "priceYearly": 9990,
        "trialDays": 30,
        "isPopular": false,
        "status": "active",
        "color": "#f59e0b",
        "features": [
          "Unlimited users",
          "Unlimited products",
          "Unlimited storage",
          "24/7 phone support",
          "Custom integrations",
          "Dedicated account manager"
        ],
        "featureFlags": [
          "inventory_management",
          "advanced_reporting",
          "team_collaboration",
          "api_access",
          "webhooks",
          "custom_branding",
          "sso"
        ],
        "limits": {
          "maxUsers": -1,
          "maxProducts": -1,
          "maxStorageMB": -1,
          "maxOrdersPerMonth": -1,
          "maxCategories": -1,
          "maxSuppliers": -1,
          "maxCustomers": -1,
          "maxLocations": -1
        },
        "subscribers": 42,
        "monthlyRecurringRevenue": 41958,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2026-05-20T10:30:00Z"
      }
    ],
    "total": 3
  }
}
```

### Feature 10: View Plan Details

**Page:** `ViewPricingPlan.jsx`
**Route:** `/superadmin/pricing-plans/:id`

#### API Call 10.1: Get Single Plan
```bash
GET /v1/plans/{planId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "plan": {
      "id": "plan-professional",
      "name": "Professional",
      "description": "For growing businesses",
      "priceMonthly": 299,
      "priceYearly": 2990,
      "trialDays": 14,
      "isPopular": true,
      "status": "active",
      "color": "#3b82f6",
      ...
    }
  }
}
```

### Feature 11: Create Pricing Plan

**Page:** `CreatePricingPlan.jsx`
**Route:** `/superadmin/pricing-plans/new`

#### API Call 11.1: Create Plan
```bash
POST /v1/plans
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "name": "Growth",
  "description": "For scaling businesses",
  "priceMonthly": 599,
  "priceYearly": 5990,
  "trialDays": 14,
  "isPopular": false,
  "status": "active",
  "color": "#8b5cf6",
  "features": [
    "Up to 250 users",
    "Up to 50,000 products",
    "1 TB storage",
    "Priority support",
    "Advanced analytics",
    "Custom reports"
  ],
  "featureFlags": [
    "inventory_management",
    "advanced_reporting",
    "team_collaboration",
    "api_access",
    "webhooks"
  ],
  "limits": {
    "maxUsers": 250,
    "maxProducts": 50000,
    "maxStorageMB": 1048576,
    "maxOrdersPerMonth": 25000,
    "maxCategories": 2000,
    "maxSuppliers": 1000,
    "maxCustomers": 100000,
    "maxLocations": 20
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "plan-growth",
    "name": "Growth",
    ...
  }
}
```

### Feature 12: Update Pricing Plan

#### API Call 12.1: Update Plan
```bash
PUT /v1/plans/{planId}
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "name": "Growth Updated",
  "priceMonthly": 649,
  "priceYearly": 6490,
  "isPopular": true,
  "features": [
    "Up to 250 users",
    "Up to 50,000 products",
    "1 TB storage",
    "24/7 support",
    "Advanced analytics",
    "Custom reports"
  ]
}

Response:
{
  "success": true,
  "data": {
    "id": "plan-growth",
    "name": "Growth Updated",
    ...
  }
}
```

### Feature 13: Delete Pricing Plan

#### API Call 13.1: Delete Plan
```bash
DELETE /v1/plans/{planId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Plan deleted successfully"
}
```

### Feature 14: Compare Plans

#### API Call 14.1: Get Plan Comparison
```bash
GET /v1/plans/comparison
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "features": [
      {
        "category": "Users",
        "items": [
          {
            "feature": "Max Users",
            "starter": "5",
            "professional": "100",
            "enterprise": "Unlimited"
          }
        ]
      },
      {
        "category": "Storage",
        "items": [
          {
            "feature": "Max Storage",
            "starter": "10 GB",
            "professional": "500 GB",
            "enterprise": "Unlimited"
          }
        ]
      },
      {
        "category": "Support",
        "items": [
          {
            "feature": "Support Level",
            "starter": "Email",
            "professional": "Priority Email",
            "enterprise": "24/7 Phone"
          }
        ]
      }
    ],
    "planStats": {
      "plan-starter": {
        "subscribers": 120,
        "mrr": 5880
      },
      "plan-professional": {
        "subscribers": 85,
        "mrr": 25415
      },
      "plan-enterprise": {
        "subscribers": 42,
        "mrr": 41958
      }
    }
  }
}
```

---

## 📈 Analytics

### Feature 15: Analytics Dashboard

**Page:** `Analytics.jsx`
**Route:** `/superadmin/analytics`
**Tabs:**
- Overview (KPIs, trends)
- Revenue (Revenue trends, top businesses)
- Users (User growth, geographic distribution)
- System (Performance, API usage)

#### API Call 15.1: Get Platform Analytics
```bash
GET /superadmin/analytics/platform
Authorization: Bearer <token>

Query Parameters:
- timeRange (optional): '7days' | '30days' | '90days' | '1year' (default: '30days')

Response:
{
  "success": true,
  "data": {
    "currency": "USD",
    "kpi": {
      "revenue": {
        "current": 42850.50,
        "change": 15.4,
        "trend": "up"
      },
      "users": {
        "current": 1847,
        "change": 23.5,
        "trend": "up"
      },
      "activeBusinesses": {
        "current": 185,
        "change": 12.3,
        "trend": "up"
      },
      "churnRate": {
        "current": 2.4,
        "change": -0.5,
        "trend": "down"
      }
    },
    "revenueTrends": [
      {
        "date": "2026-05-01",
        "revenue": 28000,
        "mrr": 27500,
        "subscriptions": 180
      },
      {
        "date": "2026-05-15",
        "revenue": 35800,
        "mrr": 35200,
        "subscriptions": 195
      },
      {
        "date": "2026-05-25",
        "revenue": 42850,
        "mrr": 42200,
        "subscriptions": 210
      }
    ],
    "topBusinesses": [
      {
        "id": "bus-1",
        "name": "Global Tech Solutions",
        "revenue": 2500,
        "growth": 18,
        "plan": "enterprise"
      },
      {
        "id": "bus-2",
        "name": "Riverside Retail Group",
        "revenue": 2100,
        "growth": 12,
        "plan": "enterprise"
      }
    ],
    "revenueByPlan": [
      {
        "plan": "Starter",
        "revenue": 4455,
        "percentage": 10.4,
        "count": 120
      },
      {
        "plan": "Professional",
        "revenue": 21500,
        "percentage": 50.2,
        "count": 85
      },
      {
        "plan": "Enterprise",
        "revenue": 16895,
        "percentage": 39.4,
        "count": 42
      }
    ],
    "userGrowth": [
      {
        "date": "Week 1",
        "new": 120,
        "active": 890
      },
      {
        "date": "Week 2",
        "new": 145,
        "active": 920
      },
      {
        "date": "Week 3",
        "new": 178,
        "active": 980
      },
      {
        "date": "Week 4",
        "new": 154,
        "active": 1015
      }
    ],
    "geographicDistribution": [
      {
        "country": "United States",
        "users": 756,
        "percentage": 41,
        "businesses": 95
      },
      {
        "country": "Canada",
        "users": 387,
        "percentage": 21,
        "businesses": 42
      },
      {
        "country": "Ghana",
        "users": 294,
        "percentage": 16,
        "businesses": 38
      },
      {
        "country": "Nigeria",
        "users": 184,
        "percentage": 10,
        "businesses": 22
      }
    ]
  }
}
```

---

## 💬 Messaging

### Feature 16: Business Support Messaging

**Page:** `Messaging.jsx`
**Route:** `/superadmin/messaging`
**Features:**
- Contact list with businesses
- Chat interface with message history
- Send/receive messages
- Message status (sent, delivered, read)

#### API Call 16.1: Get Message Contacts (Mock)
*Note: This feature currently uses mock data locally stored in component state*

```javascript
// Mock data used - no backend API call yet
[
  { 
    id: 1, 
    name: 'TechStart Inc.', 
    adminName: 'John Doe',
    status: 'online', 
    lastMessage: 'Thanks for the update!', 
    unread: 0
  }
]
```

#### API Call 16.2: Send Message (When implemented)
```bash
POST /v1/messaging/messages
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "businessId": "bus-456",
  "message": "Your inventory export is ready for download",
  "type": "support"
}

Response:
{
  "success": true,
  "data": {
    "id": "msg-789",
    "businessId": "bus-456",
    "message": "Your inventory export is ready for download",
    "sender": "superadmin",
    "timestamp": "2026-05-25T15:30:00Z",
    "status": "sent"
  }
}
```

#### API Call 16.3: Get Message History (When implemented)
```bash
GET /v1/messaging/messages
Authorization: Bearer <token>

Query Parameters:
- businessId: string
- limit (optional): number (default: 20)
- offset (optional): number

Response:
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-1",
        "sender": "business",
        "text": "Hi, we are having trouble with inventory export",
        "time": "10:00 AM",
        "status": "read"
      },
      {
        "id": "msg-2",
        "sender": "admin",
        "text": "Hello! I can help with that",
        "time": "10:05 AM",
        "status": "delivered"
      }
    ],
    "total": 15
  }
}
```

---

## 🔔 Notifications

### Feature 17: Platform Notifications

**Page:** `Notifications.jsx`
**Route:** `/superadmin/notifications`
**Features:**
- Notification list with tabs (All, Unread, Signups, Payments, System)
- Notification types with icons
- Mark as read
- Delete notifications

#### API Call 17.1: Get Notifications Summary
```bash
GET /v1/notifications
Authorization: Bearer <token>

Query Parameters:
- type (optional): 'all' | 'unread' | 'signup' | 'payment' | 'system'
- limit (optional): number (default: 20)
- offset (optional): number

Response:
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-1",
        "type": "signup",
        "title": "New Business Signup",
        "message": "TechStart Inc has signed up for Starter plan",
        "businessId": "bus-789",
        "businessName": "TechStart Inc",
        "isRead": false,
        "createdAt": "2026-05-25T15:30:00Z"
      },
      {
        "id": "notif-2",
        "type": "payment",
        "title": "Payment Received",
        "message": "Payment of $299 received from Acme Corporation",
        "businessId": "bus-456",
        "businessName": "Acme Corporation",
        "amount": 299,
        "isRead": false,
        "createdAt": "2026-05-25T14:15:00Z"
      },
      {
        "id": "notif-3",
        "type": "upgrade",
        "title": "Plan Upgrade",
        "message": "Global Tech Solutions upgraded to Enterprise plan",
        "businessId": "bus-123",
        "businessName": "Global Tech Solutions",
        "plan": "Enterprise",
        "isRead": true,
        "createdAt": "2026-05-25T12:00:00Z"
      },
      {
        "id": "notif-4",
        "type": "system",
        "title": "System Maintenance",
        "message": "Platform maintenance scheduled for 2026-05-26 02:00 UTC",
        "isRead": true,
        "createdAt": "2026-05-24T10:00:00Z"
      },
      {
        "id": "notif-5",
        "type": "alert",
        "title": "High API Usage",
        "message": "TechStart Inc API usage at 89% of monthly limit",
        "businessId": "bus-789",
        "businessName": "TechStart Inc",
        "isRead": false,
        "createdAt": "2026-05-25T13:45:00Z"
      }
    ],
    "unreadCount": 3,
    "total": 247
  }
}
```

#### API Call 17.2: Mark Notification as Read
```bash
POST /v1/notifications/{notificationId}/read
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "notif-1",
    "isRead": true
  }
}
```

#### API Call 17.3: Mark All as Read
```bash
POST /v1/notifications/read-all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### API Call 17.4: Delete Notification
```bash
DELETE /v1/notifications/{notificationId}
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Notification deleted"
}
```

#### API Call 17.5: Delete All Notifications
```bash
DELETE /v1/notifications/delete-all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "All notifications deleted"
}
```

---

## 👤 Profile Management

### Feature 18: Admin Profile

**Page:** `Profile.jsx`
**Route:** `/superadmin/profile`
**Features:**
- View/Edit profile information
- Change password
- Upload avatar
- View activity log
- Logout

#### API Call 18.1: Get Admin Profile
```bash
GET /v1/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "admin-1",
      "name": "Platform Administrator",
      "email": "admin@stringventory.com",
      "phone": "+1234567890",
      "timezone": "Africa/Accra",
      "role": "superadmin",
      "avatar": "https://cdn.stringventory.com/avatars/admin-1.jpg",
      "createdAt": "2025-12-01T08:00:00Z",
      "lastLogin": "2026-05-25T09:30:00Z"
    }
  }
}
```

#### API Call 18.2: Update Profile
```bash
PUT /v1/auth/me
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "name": "Platform Administrator",
  "email": "admin@stringventory.com",
  "phone": "+1234567890",
  "timezone": "Africa/Accra"
}

Response:
{
  "success": true,
  "data": {
    "id": "admin-1",
    "name": "Platform Administrator",
    "email": "admin@stringventory.com",
    "phone": "+1234567890",
    "timezone": "Africa/Accra"
  }
}
```

#### API Call 18.3: Change Password
```bash
POST /v1/auth/password/change
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword123!",
  "confirmPassword": "NewSecurePassword123!"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### API Call 18.4: Upload Avatar
```bash
POST /v1/auth/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

Request:
- File: avatar.jpg (image file)

Response:
{
  "success": true,
  "data": {
    "avatar": "https://cdn.stringventory.com/avatars/admin-1-new.jpg"
  }
}
```

#### API Call 18.5: Get Activity Log
```bash
GET /v1/auth/activity-logs
Authorization: Bearer <token>

Query Parameters:
- limit (optional): number (default: 20)
- offset (optional): number
- type (optional): 'login' | 'profile_update' | 'password_change' | etc.

Response:
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-1",
        "action": "Login",
        "description": "Admin logged in",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2026-05-25T09:30:00Z"
      },
      {
        "id": "log-2",
        "action": "Profile Updated",
        "description": "Updated profile information",
        "ipAddress": "192.168.1.100",
        "timestamp": "2026-05-20T14:15:00Z"
      },
      {
        "id": "log-3",
        "action": "Password Changed",
        "description": "Changed password",
        "ipAddress": "192.168.1.100",
        "timestamp": "2026-05-15T10:00:00Z"
      }
    ],
    "total": 47
  }
}
```

---

## ⚙️ Settings

### Feature 19: Platform Settings

**Page:** `Settings.jsx`
**Route:** `/superadmin/settings`
**Tabs:**
- General (Platform name, emails, maintenance mode)
- Appearance (Colors, theme)
- Notifications (Email settings, SMTP)
- Email/SMTP (Email provider configuration)
- Security (2FA, session timeout, password policy)
- Billing (Currency, tax, trial settings)
- Integrations (API keys, webhooks)
- Database (Database info)

#### API Call 19.1: Get Settings
```bash
GET /superadmin/settings
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "settings": {
      "general": {
        "platformName": "StringVentory",
        "platformEmail": "admin@stringventory.com",
        "supportEmail": "support@stringventory.com",
        "companyName": "StringTech Solutions",
        "maintenanceMode": false,
        "maintenanceMessage": "System under maintenance. Please try again later."
      },
      "appearance": {
        "primaryColor": "emerald",
        "themeMode": "light",
        "density": "comfortable",
        "logo": "https://cdn.stringventory.com/logo.png",
        "favicon": "https://cdn.stringventory.com/favicon.ico"
      },
      "notifications": {
        "emailNotifications": true,
        "newBusinessNotification": true,
        "newBusinessTemplate": "new_business_v1",
        "paymentNotification": true,
        "paymentTemplate": "payment_received_v1",
        "systemAlerts": true,
        "emailProvider": "smtp"
      },
      "smtp": {
        "host": "smtp.mailtrap.io",
        "port": 587,
        "user": "user_123",
        "password": "••••••••",
        "senderName": "StringVentory Admin",
        "senderEmail": "noreply@stringventory.com",
        "enableSSL": true,
        "enableTLS": true
      },
      "security": {
        "twoFactorAuth": true,
        "sessionTimeout": 30,
        "passwordExpiry": 90,
        "loginAttempts": 5,
        "lockoutDuration": 15,
        "requireStrongPassword": true,
        "minPasswordLength": 8,
        "ipWhitelist": [],
        "ipBlacklist": []
      },
      "billing": {
        "currency": "USD",
        "taxRate": 15.0,
        "invoicePrefix": "SV-",
        "enableTrials": true,
        "trialDays": 14,
        "autoRenew": true,
        "paymentGateway": "stripe"
      },
      "integrations": {
        "apiKeys": [
          {
            "id": "key-1",
            "name": "Frontend API",
            "key": "pk_live_51234567890abcdef",
            "status": "active",
            "createdAt": "2026-01-01T00:00:00Z",
            "lastUsed": "2026-05-25T09:30:00Z"
          }
        ],
        "webhooks": [
          {
            "id": "wh-1",
            "url": "https://hooks.slack.com/services/...",
            "event": "business.signup",
            "status": "active",
            "createdAt": "2026-01-15T00:00:00Z"
          }
        ]
      },
      "database": {
        "host": "db.stringventory.com",
        "port": 5432,
        "database": "stringventory_prod",
        "version": "14.5",
        "backupFrequency": "daily",
        "lastBackup": "2026-05-25T02:00:00Z"
      }
    }
  }
}
```

#### API Call 19.2: Update Settings
```bash
PUT /superadmin/settings
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
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
    "systemAlerts": true
  },
  "smtp": {
    "host": "smtp.mailtrap.io",
    "port": 587,
    "user": "new_user",
    "password": "new_password",
    "senderName": "StringVentory",
    "senderEmail": "noreply@stringventory.com"
  },
  "security": {
    "twoFactorAuth": true,
    "sessionTimeout": 30,
    "passwordExpiry": 90,
    "loginAttempts": 5
  },
  "billing": {
    "currency": "USD",
    "taxRate": 15.0,
    "invoicePrefix": "SV-",
    "enableTrials": true,
    "trialDays": 14
  }
}

Response:
{
  "success": true,
  "data": {
    "settings": { ...updated settings... }
  }
}
```

#### API Call 19.3: Regenerate API Key
```bash
POST /v1/settings/api/regenerate-key
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "keyId": "key-1",
  "name": "Frontend API v2"
}

Response:
{
  "success": true,
  "data": {
    "id": "key-2",
    "name": "Frontend API v2",
    "key": "pk_live_new_key_here",
    "status": "active",
    "createdAt": "2026-05-25T16:00:00Z"
  }
}
```

#### API Call 19.4: Test Email Configuration
```bash
POST /v1/settings/email/test
Authorization: Bearer <token>
Content-Type: application/json

Request Payload:
{
  "recipientEmail": "admin@stringventory.com",
  "template": "test"
}

Response:
{
  "success": true,
  "message": "Test email sent successfully to admin@stringventory.com"
}
```

---

## 🔐 Roles & Permissions

### Feature 20: Manage User Roles

**Page:** `Roles.jsx`
**Route:** `/superadmin/roles`
**Features:**
- View all system roles
- Stats: Total roles, Users with roles, System roles
- Role cards with descriptions
- Edit/Delete role buttons (non-system roles)

#### System Roles (Read-only)
```javascript
DEFAULT_ROLES = [
  {
    id: 'business_admin',
    name: 'Business Admin',
    description: 'Full control over business account',
    isSystemRole: true,
    permissions: [
      'manage_users',
      'manage_inventory',
      'manage_orders',
      'manage_settings',
      'view_reports',
      'manage_billing'
    ]
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manage operations and team',
    isSystemRole: true,
    permissions: [
      'manage_inventory',
      'manage_orders',
      'manage_users',
      'view_reports'
    ]
  },
  {
    id: 'sales',
    name: 'Sales Staff',
    description: 'Handle sales and customer interactions',
    isSystemRole: true,
    permissions: [
      'manage_orders',
      'view_inventory',
      'manage_customers',
      'view_reports'
    ]
  },
  {
    id: 'warehouse',
    name: 'Warehouse Manager',
    description: 'Manage inventory and warehouse operations',
    isSystemRole: true,
    permissions: [
      'manage_inventory',
      'view_orders',
      'manage_suppliers'
    ]
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Financial and billing operations',
    isSystemRole: true,
    permissions: [
      'view_transactions',
      'manage_expenses',
      'view_billing',
      'manage_reports'
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to business data',
    isSystemRole: true,
    permissions: [
      'view_inventory',
      'view_orders',
      'view_reports'
    ]
  }
]
```

#### API Call 20.1: Get Roles (When implemented)
```bash
GET /v1/roles
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role-1",
        "name": "Business Admin",
        "description": "Full control over business account",
        "isSystemRole": true,
        "userCount": 284,
        "permissions": [
          "manage_users",
          "manage_inventory",
          "manage_orders"
        ]
      }
    ],
    "total": 6
  }
}
```

---

## 📊 Summary of All Endpoints

| # | Feature | Method | Endpoint | Status |
|---|---------|--------|----------|--------|
| 1 | Platform Analytics | GET | `/superadmin/analytics/platform` | ✅ Implemented |
| 2 | List Businesses | GET | `/v1/businesses` | ✅ Implemented |
| 3 | Get Business Details | GET | `/v1/businesses/{id}` | ✅ Implemented |
| 4 | Create Business | POST | `/v1/businesses` | ✅ Implemented |
| 5 | Update Business | PUT | `/v1/businesses/{id}` | ✅ Implemented |
| 6 | Delete Business | DELETE | `/v1/businesses/{id}` | ✅ Implemented |
| 7 | Suspend Business | POST | `/v1/businesses/{id}/suspend` | ✅ Implemented |
| 8 | Reactivate Business | POST | `/v1/businesses/{id}/reactivate` | ✅ Implemented |
| 9 | List Pricing Plans | GET | `/v1/plans` | ✅ Implemented |
| 10 | Get Plan Details | GET | `/v1/plans/{id}` | ✅ Implemented |
| 11 | Create Pricing Plan | POST | `/v1/plans` | ✅ Implemented |
| 12 | Update Pricing Plan | PUT | `/v1/plans/{id}` | ✅ Implemented |
| 13 | Delete Pricing Plan | DELETE | `/v1/plans/{id}` | ✅ Implemented |
| 14 | Compare Plans | GET | `/v1/plans/comparison` | ✅ Implemented |
| 15 | Analytics Dashboard | GET | `/superadmin/analytics/platform` | ✅ Implemented |
| 16 | Send Message | POST | `/v1/messaging/messages` | 🔄 Mock Only |
| 17 | Get Messages History | GET | `/v1/messaging/messages` | 🔄 Mock Only |
| 18 | Get Notifications | GET | `/v1/notifications` | ✅ Partially Implemented |
| 19 | Mark Notification Read | POST | `/v1/notifications/{id}/read` | ✅ Partially Implemented |
| 20 | Delete Notification | DELETE | `/v1/notifications/{id}` | ✅ Partially Implemented |
| 21 | Get Admin Profile | GET | `/v1/auth/me` | ✅ Implemented |
| 22 | Update Profile | PUT | `/v1/auth/me` | ✅ Implemented |
| 23 | Change Password | POST | `/v1/auth/password/change` | ✅ Implemented |
| 24 | Upload Avatar | POST | `/v1/auth/avatar` | ✅ Implemented |
| 25 | Get Activity Log | GET | `/v1/auth/activity-logs` | ✅ Implemented |
| 26 | Get Settings | GET | `/superadmin/settings` | ✅ Implemented |
| 27 | Update Settings | PUT | `/superadmin/settings` | ✅ Implemented |
| 28 | Regenerate API Key | POST | `/v1/settings/api/regenerate-key` | ✅ Implemented |
| 29 | Get Roles | GET | `/v1/roles` | 🔄 Planned |

---

## 🔑 Key API Integration Patterns

### Authentication Header
```javascript
Authorization: Bearer <access_token>
```

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "message": "Detailed error description"
}
```

### Pagination Pattern (Optional)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 285,
    "pages": 15
  }
}
```

### Query Parameters
- `limit`: Results per page
- `offset` / `page`: Pagination
- `search`: Search/filter term
- `status`: Filter by status
- `timeRange`: Date range filter
- `sort`: Sort field and direction

---

## 📝 Notes

### Token Refresh
- Access tokens may expire
- Use refresh token to get new access token
- Endpoint: `POST /v1/auth/refresh`

### Error Handling
- All endpoints may return error responses
- HTTP 401: Unauthorized (token invalid/expired)
- HTTP 403: Forbidden (insufficient permissions)
- HTTP 404: Not found
- HTTP 500: Server error

### Rate Limiting
- Check response headers for rate limit info
- Follow exponential backoff strategy for retries

### CORS
- All endpoints support CORS
- Credentials must be included in requests

---

## 🔄 Related Documentation Files

- **API Documentation:** `frontend/docs/API_INTEGRATION_GUIDE.md`
- **Endpoint Reference:** `frontend/docs/API_QUICK_REFERENCE.md`
- **Business Model:** `frontend/src/models/business.js`
- **Analytics Model:** `frontend/src/models/analytics.js`
- **Plans Model:** `frontend/src/models/plan.js`
- **API Client:** `frontend/src/services/api/client.js`
- **Endpoints Config:** `frontend/src/services/api/endpoints.js`
- **Service Layer:** `frontend/src/services/platform/superadminService.js`

