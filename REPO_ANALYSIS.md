# StringVentory - Repository Analysis

## 📋 Project Overview

**StringVentory** is a comprehensive **multi-tenant inventory and business management system** built as a SaaS platform. It's designed to help small to enterprise-level businesses manage their operations across multiple modules with role-based access control and flexible pricing tiers.

**Project Type:** Full-Stack React + (Backend implied)
**Current Focus:** Frontend (React + Vite)
**Status:** Active Development

---

## 🏗️ Architecture Overview

### Stack
- **Frontend:** React 19.2.0 + Vite 7.2.40
- **Styling:** Tailwind CSS 4.1.18 + Tailwind CSS Vite
- **Routing:** React Router 7.11.0
- **HTTP Client:** Axios
- **UI Components:** Lucide React (icons), SweetAlert2 (modals)
- **Charts:** Recharts
- **Build Tool:** Vite with HMR

### Frontend Structure
```
frontend/
├── src/
│   ├── App.jsx                 # Main router configuration
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   ├── components/
│   │   ├── admin/             # Admin dashboard components
│   │   │   ├── Categories/
│   │   │   ├── Customers/
│   │   │   ├── Dashboard/
│   │   │   ├── Expenses/
│   │   │   ├── Inventory/
│   │   │   ├── Messaging/
│   │   │   ├── Orders/
│   │   │   ├── Products/
│   │   │   ├── Purchases/
│   │   │   ├── Sales/
│   │   │   ├── Settings/
│   │   │   ├── Users/
│   │   │   └── layout/        # Header, Sidebar, Footer, DashboardLayout
│   │   ├── auth/              # Auth components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SuperadminRoute.jsx
│   │   │   ├── ForgotPasswordModal.jsx
│   │   │   └── SuccessAlert.jsx
│   │   ├── shared/            # Shared components
│   │   │   ├── PlanBadge.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── UpgradePrompt.jsx
│   │   │   └── UsageProgressBar.jsx
│   │   └── superadmin/        # Super admin dashboard
│   │       ├── Dashboard/
│   │       ├── Businesses/
│   │       └── layout/
│   ├── pages/
│   │   ├── login/             # Login page
│   │   ├── dashboards/        # User dashboard pages
│   │   │   ├── Categories/
│   │   │   ├── Customers/
│   │   │   ├── Dashboard/
│   │   │   ├── Expenses/
│   │   │   ├── Inventory/
│   │   │   ├── Messaging/
│   │   │   ├── Notifications/
│   │   │   ├── Orders/
│   │   │   ├── products/
│   │   │   ├── Profile/
│   │   │   ├── Purchases/
│   │   │   ├── Reports/
│   │   │   ├── Sales/
│   │   │   ├── Settings/
│   │   │   ├── Suppliers/
│   │   │   └── Users/
│   │   └── superadmin/        # Super admin pages
│   │       ├── Analytics/
│   │       ├── Businesses/
│   │       ├── Dashboard/
│   │       ├── Messaging/
│   │       ├── Notifications/
│   │       ├── PricingPlans/
│   │       ├── Profile/
│   │       └── Settings/
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.js
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── SubscriptionProvider.jsx
│   │   ├── TenantContext.js
│   │   ├── TenantProvider.jsx
│   │   ├── ThemeContext.jsx   # Theme management
│   │   ├── useSubscription.js
│   │   └── useTenant.js
│   ├── constants/
│   │   ├── features.js        # Feature flags and role definitions
│   │   ├── permissions.js     # Permission constants
│   │   └── plans.js           # Pricing plans configuration
│   ├── utils/
│   │   ├── alerts.js          # Alert utilities
│   │   └── featureGating.js   # Feature gating logic
│   └── lib/
│       └── constant.js
├── public/
│   ├── data/                  # Mock data JSON files
│   │   ├── activity-logs.json
│   │   ├── analytics-data.json
│   │   ├── auth-sessions.json
│   │   ├── businesses.json
│   │   ├── customers.json
│   │   ├── inventory.json
│   │   ├── orders.json
│   │   ├── products.json
│   │   ├── sales.json
│   │   ├── suppliers.json
│   │   └── [40+ more mock data files]
│   └── assets/
├── vite.config.js
├── eslint.config.js
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── README.md
├── API_DOCS.md
└── Api_payload.md
```

---

## 🎯 Core Features & Modules

### 1. **User Management**
   - Role-based access control (RBAC)
   - Multi-tier roles: Admin, Warehouse Manager, Accountant, Sales Staff, etc.
   - Permission-based feature access
   - User creation, editing, and deletion
   - Activity logging and audit trails

### 2. **Inventory Management**
   - Product catalog with categories
   - Stock tracking and low stock alerts
   - Inventory adjustments and transfers
   - Supplier management
   - Purchase orders and order fulfillment

### 3. **Sales & Orders**
   - Customer management
   - Order creation and tracking
   - Sales tracking and reporting
   - Refund processing
   - Payment method management

### 4. **Purchasing**
   - Supplier management
   - Purchase orders
   - Purchase tracking
   - Expense categorization

### 5. **Expenses**
   - Expense tracking
   - Expense category management
   - Financial overview and reporting

### 6. **Messaging**
   - Customer messaging
   - Bulk messaging support
   - Message history and tracking

### 7. **Reports & Analytics**
   - Dashboard analytics
   - Revenue and sales charts
   - Inventory reports
   - Operational overview
   - Advanced analytics (Professional+ plans)

### 8. **Multi-Tenancy**
   - Business/tenant isolation
   - Subscription-based access
   - Feature gating per plan
   - Tenant-specific settings

### 9. **Theme Customization**
   - Multiple color themes (Red, Orange, Green, Emerald, Blue, etc.)
   - Dynamic theme switching
   - Color class generation

### 10. **Subscription Management**
   - Tiered pricing plans (Free Trial, Starter, Professional, Enterprise)
   - Feature limits per plan
   - Usage tracking and quotas
   - Plan upgrades/downgrades
   - Billing history

---

## 💰 Pricing Tiers

### Plans Configuration (from `constants/plans.js`)

1. **Free Trial**
   - 0 cost (limited time)
   - Up to 100 products, 1 user, 1 location
   - Features: Dashboard, Products, Orders, Customers, Inventory, Basic Reports

2. **Starter** ($49/month)
   - Up to 500 products, 5 users, 1 location
   - 5GB storage
   - Features: All Free + Suppliers, Purchases, Expenses, Standard Reports

3. **Professional** ($149/month) - Popular
   - Up to 5,000 products, 15 users, 5 locations
   - 50GB storage
   - API access, Bulk operations, Advanced analytics
   - Multi-location support

4. **Enterprise** ($499/month)
   - Unlimited products, users, locations
   - 500GB storage
   - Custom branding, Custom reports, Webhooks, Audit logs

---

## 🔐 Authentication & Authorization

### Context Providers
- **AuthContext/AuthProvider:** User authentication state (login/logout)
- **TenantContext/TenantProvider:** Current business/tenant context
- **SubscriptionProvider:** Subscription and plan information
- **ThemeContext:** Theme selection state

### Route Protection
- **ProtectedRoute:** Requires authentication
- **SuperadminRoute:** Requires superadmin role

### Features
- Login/logout with JWT tokens
- Password reset (ForgotPasswordModal)
- Email verification
- Session management

---

## 🎨 Theme System

### Available Themes (ThemeContext.jsx)
- **Red, Orange, Emerald, Green, Blue, Purple, Pink, Slate, Cyan, Rose, Amber**

### Theme Properties
- Sidebar background
- Logo gradient
- Active menu styles
- Button styling
- Text colors
- Decorative elements
- Focus ring colors

---

## 📊 Component Organization

### Shared Components
- **PlanBadge:** Displays subscription plan information
- **StatusBadge:** Status indicators
- **UpgradePrompt:** Plan upgrade suggestions
- **UsageProgressBar:** Display usage against plan limits

### Layout Components
- **Header:** Top navigation
- **Sidebar:** Main navigation menu
- **Footer:** Footer content
- **DashboardLayout:** Combined layout wrapper
- **SuperadminLayout:** Superadmin-specific layout

### Admin Components
- Form components for CRUD operations
- Data tables and lists
- Modal dialogs
- Filter and search components

---

## 🔄 Feature Gating System

### Features (`constants/features.js`)
- Feature flags for each plan
- Role-based feature access
- Permission definitions
- Default roles with permissions

### Usage
- Check if feature is available: `canAccessFeature(featureId)`
- Display usage progress: `UsageProgressBar` component
- Feature limitation alerts: `UpgradePrompt` component

---

## 🗂️ Data Management

### Mock Data Files (public/data/)
- 45+ JSON files for demo/development
- Coverage: Users, Products, Orders, Customers, Analytics, etc.
- Used for testing before backend integration

### API Integration
- Axios configured for HTTP requests
- API endpoint documentation in `API_DOCS.md`
- Payload examples in `Api_payload.md`

---

## ⚙️ Configuration Files

### Key Files
- **vite.config.js:** Vite build and dev server configuration
- **eslint.config.js:** ESLint rules
- **package.json:** Dependencies and scripts
- **pnpm-workspace.yaml:** Workspace configuration

### Scripts
```json
{
  "dev": "vite",           // Start dev server
  "build": "vite build",   // Production build
  "lint": "eslint .",      // Run linter
  "preview": "vite preview" // Preview build
}
```

---

## 🐛 Current Issues & Fixes

### Fixed Issues
- Duplicate "emerald" theme key in ThemeContext.jsx
- Duplicate "emerald" object entries in multiple components
- Trailing spaces in object keys causing build warnings

### Build Status
- Vite development server running successfully
- No critical errors (duplicate key warnings resolved)

---

## 📈 Statistics

- **Total Pages:** 30+ (admin + superadmin)
- **Total Components:** 50+ (admin + shared + auth + superadmin)
- **Context Providers:** 5
- **Feature Flags:** 20+
- **Pricing Plans:** 4
- **Roles:** 6 default roles
- **Permissions:** 25+
- **Themes:** 11 color themes

---

## 🚀 Development Workflow

### Setup
```bash
cd frontend
npm install  # or pnpm install
npm run dev  # Start development server
```

### Building
```bash
npm run build  # Production build
npm run preview # Preview build
```

### Linting
```bash
npm run lint  # Check code style
```

---

## 📝 Documentation Files
- **API_DOCS.md:** API endpoint documentation
- **Api_payload.md:** Request/response payload examples
- **README.md:** Project readme

---

## 🔗 Integration Points

### Expected Backend
- Authentication endpoints
- CRUD operations for all modules
- Multi-tenant data isolation
- Subscription/usage tracking
- File upload handling

### Missing Components
- Backend implementation (assumed to exist separately)
- API endpoints integration
- Database models and migrations
- Server deployment configuration

---

## 💡 Key Insights

1. **Multi-tenant Architecture:** Fully designed for SaaS with tenant isolation
2. **Feature-based Access:** Sophisticated feature gating based on subscription plans
3. **Enterprise Ready:** Support for unlimited scaling (Enterprise plan)
4. **Theme Flexibility:** Dynamic theming system for white-labeling
5. **Comprehensive Admin:** Complete business management dashboard
6. **Superadmin Panel:** Separate interface for platform management and pricing

---

## 🎯 Next Steps / Recommendations

1. **Backend Integration:** Connect frontend to backend APIs
2. **Environment Variables:** Create `.env` file with API endpoints
3. **Authentication Flow:** Implement JWT token management
4. **Error Handling:** Enhanced error boundaries and logging
5. **Testing:** Add unit and integration tests
6. **Performance:** Implement code splitting and lazy loading
7. **Security:** Add CSRF protection and input validation
8. **Deployment:** Set up CI/CD pipeline and hosting

---

## 📦 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.2.4 | Build tool |
| Tailwind CSS | 4.1.18 | Styling |
| React Router | 7.11.0 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| Lucide React | 0.562.0 | Icon library |
| Recharts | 3.6.0 | Charts library |
| SweetAlert2 | 11.26.17 | Modals & alerts |
| ESLint | 9.39.1 | Code linting |

---

**Last Updated:** February 5, 2026
**Analysis Version:** 1.0
