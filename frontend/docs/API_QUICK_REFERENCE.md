# StringVentory API Documentation - Quick Reference

## 📄 Document Overview

Comprehensive API endpoint documentation for the StringVentory SaaS platform covering all modules, request/response formats, and implementation details.

**Document:** [API_ENDPOINTS.md](API_ENDPOINTS.md)

---

## 🗂️ Module Coverage

| Module | Endpoints | Key Features |
|--------|-----------|--------------|
| **Authentication** | 7 | Login, Register, Refresh Token, Reset Password, Email Verification |
| **User Management** | 7 | CRUD operations, Permissions, Role Assignment, User Activity |
| **Products** | 11 | CRUD, Categories, Low Stock Alerts, Expiring Products |
| **Inventory** | 5 | Stock Tracking, Adjustments, Transfers, Batch Management |
| **Customers** | 6 | CRUD, Order History, Credit Limits, Loyalty Points |
| **Orders** | 6 | CRUD, Order Items, Refunds, Payment Status Tracking |
| **Suppliers** | 5 | CRUD, Contact Management, Payment Terms, Rating |
| **Purchases** | 9 | Purchase Orders, Item Tracking, Delivery Status, Payments |
| **Expenses** | 7 | CRUD, Categories, Budget Tracking, Financial Reports |
| **Sales** | 5 | CRUD, Payment Methods, Sales Tracking |
| **Reports & Analytics** | 7 | Dashboard, Sales, Inventory, Financial, Customer, Expense Reports |
| **Messaging** | 6 | Messages, Bulk Messaging, Templates, Message History |
| **Settings** | 8 | Business, Notifications, Payments, API Settings |
| **Superadmin - Businesses** | 7 | Business CRUD, Subscription Management, Suspension |
| **Superadmin - Pricing Plans** | 5 | Plan CRUD, Feature Management, MRR Tracking |
| **Superadmin - Analytics** | 1 | Platform-wide metrics and insights |
| **Roles & Permissions** | 3 | Role management, Permission definitions |

**Total Endpoints: 110+**

---

## 🔑 Key Endpoint Patterns

### Authentication Flow
```
POST /auth/register → Email Verification → POST /auth/verify-email → POST /auth/login → JWT Token
```

### CRUD Operations
- `GET /resource` - List with pagination
- `GET /resource/:id` - Get single item
- `POST /resource` - Create
- `PUT /resource/:id` - Update
- `DELETE /resource/:id` - Delete

### Query Parameters (Standard)
```
?page=1&limit=20&search=query&status=active&sortBy=name&sortOrder=asc
```

---

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* field-level errors */ }
}
```

---

## 🔐 Authentication

### Headers Required
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Token Response
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

## 📈 Data Model Relationships

```
Business (Tenant)
├── Users (with Roles & Permissions)
├── Products (with Categories)
├── Inventory (Stock tracking)
├── Customers
│   ├── Orders
│   ├── Sales
│   └── Messages
├── Suppliers
│   └── Purchases
├── Expenses (with Categories)
└── Settings

SuperAdmin
├── Businesses (Multi-tenant management)
├── Pricing Plans
├── Analytics
└── Roles (System-wide)
```

---

## 💾 Key Features by Endpoint

### Feature Gating
- Plan-based access control
- Usage limits per tier
- Feature flags for capability toggling

### Multi-Tenancy
- Business/tenant isolation
- Subscription status tracking
- Data segregation

### Audit & Compliance
- Timestamp tracking (createdAt, updatedAt)
- User action logging
- Soft deletes support

### Financial Management
- Multi-currency support
- Tax calculation
- Payment tracking
- Refund processing

### Notifications
- Email alerts
- SMS notifications
- Push notifications
- Custom templates

### Analytics
- Real-time metrics
- Historical trends
- Custom reports
- Export functionality

---

## 🎯 Implementation Priorities

### Phase 1 (Core)
1. Authentication endpoints
2. User management
3. Products & Categories
4. Customers
5. Orders

### Phase 2 (Inventory)
1. Inventory management
2. Stock tracking
3. Suppliers
4. Purchases

### Phase 3 (Financial)
1. Expenses
2. Sales
3. Financial reports
4. Payment processing

### Phase 4 (Advanced)
1. Messaging
2. Advanced analytics
3. Multi-location support
4. API integrations

### Phase 5 (Superadmin)
1. Business management
2. Pricing plans
3. Platform analytics

---

## 📱 Pagination Details

All list endpoints support pagination:

```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

**Default:** page=1, limit=20
**Max limit:** 100

---

## 🔒 Permission Matrix

### Admin Permissions
- VIEW_DASHBOARD
- MANAGE_PRODUCTS
- MANAGE_INVENTORY
- MANAGE_ORDERS
- MANAGE_CUSTOMERS
- MANAGE_USERS
- MANAGE_SETTINGS

### Manager Permissions
- VIEW_DASHBOARD
- VIEW_PRODUCTS, MANAGE_PRODUCTS
- VIEW_ORDERS, MANAGE_ORDERS
- VIEW_CUSTOMERS
- VIEW_INVENTORY

### Staff Permissions
- VIEW_DASHBOARD
- VIEW_PRODUCTS
- VIEW_ORDERS
- VIEW_CUSTOMERS
- VIEW_INVENTORY

---

## 📊 Report Endpoints

| Report Type | Endpoint | Data Include |
|-------------|----------|--------------|
| Dashboard | `GET /analytics/dashboard` | KPIs, Charts, Trends |
| Sales | `GET /analytics/sales-report` | Sales by date/product/customer |
| Inventory | `GET /analytics/inventory-report` | Stock levels, Low stock, Value |
| Financial | `GET /analytics/financial-report` | Income, Expenses, Profit |
| Customer | `GET /analytics/customer-report` | Top customers, Retention |
| Expense | `GET /analytics/expense-report` | Expenses by category, Budget |
| Platform | `GET /superadmin/analytics/platform` | Business metrics, MRR |
| Export | `GET /analytics/export/:type` | PDF/CSV export |

---

## 🎁 Subscription Plans

### Plan Tiers
1. **Free Trial** - $0 (14 days)
2. **Starter** - $49/month
3. **Professional** - $149/month (Popular)
4. **Enterprise** - $499/month

### Plan Features
Each plan includes feature flags, usage limits, and specific capabilities mapped in the limits object.

---

## ⚙️ Settings Endpoints

### Business Settings
- Company details
- Address information
- Currency & timezone
- Logo & branding

### Notification Settings
- Email preferences
- SMS alerts
- Push notifications
- Quiet hours

### Payment Settings
- Payment methods
- Default payment option
- Auto-reconciliation
- Receipt emails

### API Settings
- API key management
- Webhook configuration
- Rate limiting
- IP whitelist

---

## 🚀 Implementation Checklist

- [ ] Set up Base URL routing
- [ ] Implement authentication middleware
- [ ] Create request validation schemas (Zod)
- [ ] Implement response wrappers
- [ ] Set up error handling
- [ ] Configure CORS
- [ ] Implement rate limiting
- [ ] Set up request logging
- [ ] Create database models
- [ ] Implement authentication endpoints
- [ ] Implement user management
- [ ] Implement product management
- [ ] Implement order processing
- [ ] Implement payment processing
- [ ] Implement analytics
- [ ] Set up webhooks
- [ ] Create API documentation (Swagger)
- [ ] Implement caching strategy
- [ ] Set up monitoring & alerts
- [ ] Implement audit logs

---

## 📞 Contact & Support

For API implementation questions or issues, refer to:
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Full endpoint documentation
- Backend team lead for architecture decisions
- Database architect for schema design

---

**Document Version:** 1.0
**Created:** February 5, 2026
**Status:** Complete & Ready for Implementation
