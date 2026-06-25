# StringVentory — Super Admin Dashboard Documentation

> **Audience:** Developers, architects, and technical leads working on the StringVentory platform.
> **Last Updated:** June 25, 2026
> **Version:** 1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication & Access Control](#2-authentication--access-control)
3. [Portal Entry Point & Layout](#3-portal-entry-point--layout)
4. [Feature Modules](#4-feature-modules)
5. [API Layer — Superadmin Service](#5-api-layer--superadmin-service)
6. [How It Connects to the Business (Admin) Dashboard](#6-how-it-connects-to-the-business-admin-dashboard)
7. [How Plans Affect the Sales/Operations Dashboard](#7-how-plans-affect-the-salesoperations-dashboard)
8. [Data Flow Diagrams](#8-data-flow-diagrams)
9. [Cross-Portal Connection Map](#9-cross-portal-connection-map)
10. [Known Gaps & Recommendations](#10-known-gaps--recommendations)

---

## 1. Overview

The **Super Admin Dashboard** is a completely isolated control plane for managing the StringVentory SaaS platform itself. Think of it as **two distinct portals sharing one frontend codebase**:

| Portal | URL Prefix | Audience | Purpose |
|---|---|---|---|
| **Super Admin** | `/superadmin/*` | Platform operators | Manage businesses, plans, platform revenue, analytics |
| **Business Dashboard** | `/dashboard/*` | Business owners & staff | Inventory, orders, sales, customers, etc. |
| **Public Website** | `/`, `/login`, etc. | Prospects & new users | Marketing, registration, login |

The super admin never accesses `/dashboard/*` — and a business user can never reach `/superadmin/*`. Both portals share the same JWT auth infrastructure, but routing is enforced by different guards.

---

## 2. Authentication & Access Control

### Route Guard: SuperadminRoute

File: `frontend/src/components/auth/SuperadminRoute.jsx`

This component wraps all `/superadmin/*` routes. Its logic:

- User not logged in ? redirect to /login
- User logged in, not SA ? redirect to /dashboard (regular business user)
- User logged in, is SA ? render the page

The `isSuperAdmin` flag is determined at login time inside `AuthProvider.jsx`:

`js
isSuperAdmin: normalizedRole === ROLES.SUPERADMIN ||
              !!authUser?.isSuperAdmin ||
              !!payload?.isSuperAdmin
`

The backend can signal superadmin status either through a role string (e.g. "superadmin") or an explicit `isSuperAdmin: true` field.

### Shared Authentication Infrastructure

Both portals use the **same** AuthProvider, AuthContext, JWT tokens, and Axios client. There is no separate login page for super admins. The system redirects them to `/superadmin` automatically based on their role after login.

---

## 3. Portal Entry Point & Layout

### All Registered Routes

`
/superadmin/                    ? Platform Dashboard (KPIs)
/superadmin/businesses          ? Business list
/superadmin/businesses/new      ? Add business
/superadmin/businesses/:id      ? Business detail (5 tabs)
/superadmin/businesses/edit/:id ? Edit business
/superadmin/pricing-plans       ? Plans overview + comparison
/superadmin/pricing-plans/new   ? Create plan
/superadmin/pricing-plans/:id   ? View plan details
/superadmin/pricing-plans/:id/edit ? Edit plan
/superadmin/analytics           ? Platform analytics (3 tabs)
/superadmin/messaging           ? Platform-to-business messaging
/superadmin/notifications       ? Superadmin notifications
/superadmin/settings            ? Platform-level settings
/superadmin/profile             ? Superadmin profile management
`

### Sidebar Navigation

| Nav Item | Route | Icon |
|---|---|---|
| Dashboard | /superadmin | LayoutDashboard |
| Businesses | /superadmin/businesses | Building2 |
| Pricing Plans | /superadmin/pricing-plans | CreditCard |
| Analytics | /superadmin/analytics | BarChart3 |
| Messaging | /superadmin/messaging | MessageSquare |
| Settings | /superadmin/settings | Settings |
| Profile | /superadmin/profile | User |

Visual identity: dark (slate-900) sidebar with emerald accent — different from the theming-based colored sidebars in the business dashboard.

---

## 4. Feature Modules

### 4.1 Platform Dashboard

File: `frontend/src/pages/superadmin/Dashboard/SuperadminDashboard.jsx`

The command center of the platform. Fetches two endpoints in parallel:
- `getPlatformAnalytics()` — KPIs, revenue trends, plan distribution, recent activity
- `getBusinesses()` — Recent businesses table

#### KPI Cards (Top Row)

| Metric | Source | Description |
|---|---|---|
| Total Businesses | analytics.totalBusinesses or businesses.length | All registered business accounts |
| Active Subscriptions | analytics.activeSubscriptions or count of status=active | Paying/active tenants |
| Monthly Recurring Revenue | analytics.monthlyRecurringRevenue or sum(business.mrr) | Platform MRR |
| Total Users | analytics.totalUsers or sum(business.current_usage.total_users) | Users across all businesses |

#### Charts

1. **Revenue Trend** — Horizontal bar chart showing revenue by month
2. **Subscription Distribution** — Progress-bar breakdown of businesses per plan with revenue per plan

#### Bottom Row

- **Recent Activity Feed** — Timeline of: signup, upgrade, payment, cancellation events
- **Recent Businesses Table** — Last 5 businesses registered, with status badges

---

### 4.2 Businesses Management

Files:
- `Businesses.jsx` — List page
- `AddBusiness.jsx` — Create form
- `EditBusiness.jsx` — Edit form
- `BusinessDetails.jsx` — Detail view with 5 tabs

#### BusinessDetails — 5-Tab Deep Dive

**Tab 1: Overview (BusinessOverview.jsx)**
- Business info: name, email, domain, industry, country, city, address, owner, phone
- Subscription plan + status + creation date
- Usage stats vs plan limits
- Quick Actions via handleAction():
  - login_as — Impersonate business owner (UI placeholder)
  - reset_password — Trigger password reset email
  - suspend / activate — Toggle business access (real API call)
  - delete — Permanently delete business (real API call with confirmation)

**Tab 2: Subscription (BusinessSubscription.jsx)**
- Current subscription: plan, status, billing cycle, MRR
- Billing period dates + trial end date
- Payment method: card brand + last 4 digits
- Gateway info: gatewayCustomerId, gatewaySubscriptionId, timestamps
- Plan limits vs usage progress bars (users, products, storage)
- Cancellation warning banner

**Tab 3: Team Members (BusinessUsers.jsx)**
- Table: name, email, role, status, last active, phone, email verified badge

**Tab 4: Activity Logs (BusinessActivity.jsx)**
- Chronological log: action title, description, timestamp, type

**Tab 5: Superadmin Overrides (BusinessSettings.jsx)**
- General Controls: Verified Business toggle, Maintenance Mode toggle
- Feature Access: Beta Features Access toggle
- Danger Zone: Suspend/Activate + Delete Business

---

### 4.3 Pricing Plans Management

Files:
- `PricingPlans.jsx` — List + stats + comparison matrix
- `CreatePricingPlan.jsx` — Create/Edit form
- `ViewPricingPlan.jsx` — Detail view

#### Plans Overview Tab

Stats row: Total Subscribers, Monthly Revenue, Active Plans, Avg Revenue per User

Each plan card shows:
- Name + Popular badge, description, monthly price, trial days
- Subscriber count + monthly revenue for that plan
- Top 5 features list + resource limits

#### Plan Form Fields (CreatePricingPlan.jsx)

Name, description, monthly price, annual price, trial period, mark as popular,
resource limits (max users/products/storage/orders/locations), feature toggles, color theme.

**CRITICAL CONNECTION:** Plans created here become the subscription options for business users.
They also control what SubscriptionProvider exposes via `hasFeature()` and `checkUsageLimit()`
throughout the entire business dashboard.

---

### 4.4 Analytics

File: `frontend/src/pages/superadmin/Analytics/Analytics.jsx`

Time range filter: 7 days / 30 days / 3 months / 1 year (re-fetches on change)

**Tabs:**
- **Overview** (AnalyticsOverview.jsx) — KPIs (Revenue, Users, Active Businesses, Churn Rate), revenue by plan, top 5 businesses
- **Revenue** (AnalyticsRevenue.jsx) — Revenue trend over time, MRR breakdown, revenue by plan
- **Users** (AnalyticsUsers.jsx) — User growth (new vs active by week), geographic distribution
- **System** (AnalyticsSystem.jsx) — Currently commented out; would show server health metrics

**Fallback:** If the analytics API is unavailable, hardcoded MOCK_ANALYTICS_DATA is shown so the UI remains functional.

---

### 4.5 Messaging

Platform-level messaging allows the superadmin to:
- Send announcements to all businesses or targeted plan segments
- View message history

---

### 4.6 Settings

Calls `GET/PUT /superadmin/settings`. Covers platform-wide configuration: platform name, default currency, maintenance banners, global feature flags.

---

### 4.7 Profile

Personal profile management reusing shared auth endpoints:
- `GET /v1/auth/me` — Fetch profile
- `PUT /v1/auth/me` — Update profile
- `POST /v1/auth/password/change` — Change password
- `POST /v1/auth/avatar` — Upload avatar
- `GET /v1/auth/activity-logs` — Login/action history

---

## 5. API Layer — Superadmin Service

File: `frontend/src/services/platform/superadminService.js`

All calls use the shared Axios apiClient with JWT Bearer token attached automatically.

### Endpoint Reference

| Method | Service Call | Endpoint | Purpose |
|---|---|---|---|
| GET | getBusinesses(params) | GET /v1/businesses | List all tenant businesses |
| GET | getBusinessById(id) | GET /v1/businesses/:id | Single business with users/activity/subscription |
| POST | createBusiness(payload) | POST /v1/businesses | Register new business |
| PUT | updateBusiness(id, payload) | PUT /v1/businesses/:id | Update business details |
| DELETE | deleteBusiness(id) | DELETE /v1/businesses/:id | Permanently delete |
| POST | suspendBusiness(id) | POST /v1/businesses/:id/suspend | Block access, preserve data |
| POST | reactivateBusiness(id) | POST /v1/businesses/:id/reactivate | Restore access |
| GET | getPricingPlans(params) | GET /v1/plans | List all pricing plans |
| GET | getPricingPlanById(id) | GET /v1/plans/:id | Single plan details |
| POST | createPricingPlan(payload) | POST /v1/plans | Create new plan |
| PUT | updatePricingPlan(id, payload) | PUT /v1/plans/:id | Modify plan (affects all subscribers) |
| DELETE | deletePricingPlan(id) | DELETE /v1/plans/:id | Remove plan |
| GET | getPlanComparison() | GET /v1/plans/comparison | Feature comparison matrix |
| GET | getPlatformAnalytics(params) | GET /superadmin/analytics/platform | Platform-wide KPIs |
| GET | getSettings() | GET /superadmin/settings | Platform settings |
| PUT | updateSettings(payload) | PUT /superadmin/settings | Update platform settings |

---

## 6. How It Connects to the Business (Admin) Dashboard

### Connection 1: Plan ? Feature Access in Dashboard

The superadmin creates/edits a plan at `POST/PUT /v1/plans`.
When a business user loads their dashboard, TenantProvider fetches business data including:
- `business.subscription_plan = "professional"`
- `business.usage_limits = { maxUsers: 15, maxProducts: 5000, ... }`
- `business.current_usage = { total_users: 8, total_products: 1200, ... }`

SubscriptionProvider reads this data and provides:
- `hasFeature('advanced_analytics')` ? true/false
- `checkUsageLimit('products', 1200)` ? true (within limit)
- `getUsageLimitPercentage('products')` ? 24%

Every feature flag check, every usage bar, every "Upgrade" prompt in the business dashboard flows through plan limits set by the superadmin.

### Connection 2: Suspension ? Dashboard Lockout

When superadmin calls `POST /v1/businesses/:id/suspend`, the backend marks the business as suspended.
On the business user's next API request, the backend returns 401/403.
The Axios interceptor fires: attempts token refresh ? fails ? triggers 'logout' event ? user is redirected to /login.

### Connection 3: Business Created by Superadmin ? Tenant Context

Superadmin creates a business: `POST /v1/businesses { name, email, plan, owner... }`
Backend creates the tenant, user account, and subscription record.
Business owner receives invite, logs in, and their dashboard reflects the assigned plan.

### Connection 4: Plan Changes ? Immediate Effect on Dashboard

When superadmin edits plan limits (e.g., increases maxProducts 500 ? 1000 for Starter):
On the next business dashboard reload, TenantProvider re-fetches business data.
SubscriptionProvider recalculates limits. UsageProgressBar components update automatically.
UpgradePrompt may disappear if limits were increased.

### Connection 5: Business Operations Feed Into Superadmin Analytics

Business orders, payments, signups, cancellations ? aggregated by backend ? appear in:
- Platform MRR (sum of all business MRRs)
- Active Subscriptions KPI
- Total Users KPI
- Recent Activity feed (signup/upgrade/payment/cancellation events)

---

## 7. How Plans Affect the Sales/Operations Dashboard

### Feature Access: Plan-Level Matrix

| Feature | Free Trial | Starter | Professional | Enterprise |
|---|---|---|---|---|
| Dashboard | YES | YES | YES | YES |
| Products / Categories | YES | YES | YES | YES |
| Orders | YES | YES | YES | YES |
| Customers | YES | YES | YES | YES |
| Inventory | YES | YES | YES | YES |
| Suppliers | NO | YES | YES | YES |
| Purchases | NO | YES | YES | YES |
| Expenses | NO | YES | YES | YES |
| Basic Reports | YES | YES | YES | YES |
| Advanced Analytics | NO | NO | YES | YES |
| Bulk Operations | NO | NO | YES | YES |
| API Access | NO | NO | YES | YES |
| Custom Reports | NO | NO | NO | YES |
| Webhooks | NO | NO | NO | YES |
| Custom Branding | NO | NO | NO | YES |
| Audit Logs | NO | NO | NO | YES |

### Usage Limits by Plan

| Limit | Free Trial | Starter | Professional | Enterprise |
|---|---|---|---|---|
| Max Products | 100 | 500 | 5,000 | Unlimited |
| Max Users | 1 | 5 | 15 | Unlimited |
| Max Storage | — | 5 GB | 50 GB | 500 GB |
| Max Locations | 1 | 1 | 5 | Unlimited |

### Role x Plan Double Gate

Dashboard routes have TWO layers of access control:
1. **Plan Gate** — Is this feature enabled for the current plan?
2. **Role Gate** — Does the user's role allow this action?

| Role | Access Level |
|---|---|
| CEO | All routes + user creation |
| MANAGER | Management + all-role routes |
| SALES | All-role routes only (orders, customers, view products) |

A Sales user on Professional plan can view products (role: yes, plan: yes)
but cannot access Advanced Analytics (role gate blocks it)
and cannot create products (role: management only).

---

## 8. Data Flow Diagrams

### Login Flow: Superadmin vs Business User

`
User submits login
      ¦
      ?
POST /v1/auth/login
      ¦
  response: user.role, user.isSuperAdmin
      ¦
  AuthProvider normalizes
      ¦
  isSuperAdmin = true/false
      ¦
  +-------+
  ¦       ¦
 true   false
  ¦       ¦
  ?       ?
/super  /dash
admin  board
`

### Dashboard Feature Access Flow

`
User navigates to /dashboard/reports
      ¦
      ?
ProtectedRoute (token check)
      ¦
      ?
RoleRoute [CEO, MANAGER]
      ¦
      ?
Reports page ? useSubscription()
      ¦
      ?
SubscriptionProvider.hasFeature('advanced_analytics')
      ¦
  reads currentBusiness.subscription_plan (TenantProvider)
      ¦
  checks featureGating.js plan-feature map
      ¦
  +-------+
  ¦       ¦
true   false
  ¦       ¦
render  <UpgradePrompt />
`

### Plan Edit Impact Flow

`
Superadmin edits Starter plan: maxProducts 500 ? 800
      ¦
PUT /v1/plans/:id
      ¦
Backend updates plan in DB
      ¦
Business user (Starter) reloads dashboard
      ¦
TenantProvider re-fetches business data
      ¦
business.usage_limits.maxProducts = 800
      ¦
SubscriptionProvider recalculates
      ¦
UsageProgressBar: 60% (was 96%)
UpgradePrompt hidden
`

---

## 9. Cross-Portal Connection Map

`
SUPER ADMIN PORTAL (/superadmin/*)
+-- Dashboard — reads MRR, subscription counts, recent biz
+-- Businesses — CRUD, suspend/delete, view nested data
¦    +-- BusinessDetails tabs: overview / subscription / users / activity / settings
+-- Pricing Plans — define limits and features per tier
         ¦
         ¦ Plans propagate to all subscribers
         ?
BACKEND API (/v1/businesses, /v1/plans, /superadmin/analytics)
Shared JWT Auth — role-scoped access
         ¦
         ¦ Returns tenant data + plan limits
         ?
BUSINESS DASHBOARD PORTAL (/dashboard/*)
+-- TenantProvider ? currentBusiness (plan, limits, usage)
+-- SubscriptionProvider ? hasFeature(), checkUsageLimit()
+-- All Modules (Products/Orders/Inventory/Reports/Users)
          +-- Feature gates, usage bars, UpgradePrompts
`

---

## 10. Known Gaps & Recommendations

### Current Limitations

| Gap | Description | Impact |
|---|---|---|
| No Roles page in routing | /superadmin/roles directory exists but no route registered | Roles management UI unreachable |
| Impersonation stub | login_as shows info modal but doesn't actually log in as business user | Cannot debug customer issues |
| Analytics mock fallback | Shows fake numbers silently when API is down | Can mislead operators |
| BusinessSettings not wired | Toggles (verified, maintenance, beta) not saved to backend | Changes lost on refresh |
| System analytics tab off | AnalyticsSystem component commented out | No infrastructure visibility |
| Suspension not reactive | Business user not kicked out immediately on suspension | Delayed effect |

### Recommendations

1. **Wire BusinessSettings Save button** to `PUT /v1/businesses/:id/overrides` to persist verified/maintenance/beta states.
2. **Implement real impersonation** — Generate a short-lived impersonation token server-side and redirect superadmin to /dashboard with that token.
3. **Add Roles page** — Register the /superadmin/roles route and build UI to manage platform-level roles.
4. **Real-time suspension** — Use WebSocket or polling so business user session terminates immediately on suspension.
5. **Plan change notifications** — Notify business owners when their plan limits change.
6. **Enable System Analytics tab** — Wire AnalyticsSystem to server health metrics (uptime, API latency, error rates).
7. **Guard mock data fallback** — Show a visible warning banner on Analytics when mock data is being displayed.

---

*Documentation generated by code analysis of the StringVentory frontend repository.*
*Source: frontend/src/ — superadmin components, pages, services, providers, and routing.*
