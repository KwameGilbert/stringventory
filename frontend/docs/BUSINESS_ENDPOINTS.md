# Business Superadmin Endpoints

## 1. Get Business Details (Updated)

### Endpoint
```
GET /api/superadmin/businesses/{id}
```

### Response Body
```json
{
    "success": true,
    "message": "Business fetched successfully",
    "currency": "GHS",
    "data": {
        "id": 1,
        "name": "Acme Retail",
        "email": "contact@acmeretail.com",
        "domain": "acme.store",
        "phone": "+233 24 123 4567",
        "industry": "Retail & E-commerce",
        "country": "Ghana",
        "city": "Accra",
        "address": "123 Business Street, Accra",
        "status": "active",
        "usedStorageMb": 512,
        "createdAt": "2026-05-17T21:00:29.000000Z",
        "updatedAt": "2026-05-17T21:00:29.000000Z",
        "verifiedAt": "2026-05-17T21:00:29.000000Z",
        "users": [
            {
                "id": 4,
                "businessId": 1,
                "firstName": "Jane",
                "lastName": "Manager",
                "role": "manager",
                "email": "manager1@acme.com",
                "phone": "+233 24 987 6543",
                "status": "active",
                "profileImage": "https://cdn.example.com/profile/4.jpg",
                "emailVerified": true,
                "lastLogin": "2026-05-19T10:30:00.000000Z",
                "createdAt": "2026-05-17T21:00:30.000000Z",
                "updatedAt": "2026-05-17T21:00:30.000000Z",
                "mustChangePassword": false
            },
            {
                "id": 3,
                "businessId": 1,
                "firstName": "John",
                "lastName": "Doe",
                "role": "owner",
                "email": "owner1@acme.com",
                "phone": "+233 24 111 2222",
                "status": "active",
                "profileImage": "https://cdn.example.com/profile/3.jpg",
                "emailVerified": true,
                "lastLogin": "2026-05-19T15:45:00.000000Z",
                "createdAt": "2026-05-17T21:00:30.000000Z",
                "updatedAt": "2026-05-17T21:00:30.000000Z",
                "mustChangePassword": false
            },
            {
                "id": 5,
                "businessId": 1,
                "firstName": "Bob",
                "lastName": "Sales",
                "role": "salesperson",
                "email": "sales1@acme.com",
                "phone": "+233 24 555 6666",
                "status": "active",
                "profileImage": null,
                "emailVerified": false,
                "lastLogin": null,
                "createdAt": "2026-05-17T21:00:30.000000Z",
                "updatedAt": "2026-05-17T21:00:30.000000Z",
                "mustChangePassword": true
            }
        ],
        "subscription": {
            "id": 1,
            "businessId": 1,
            "planId": 2,
            "planName": "professional",
            "billingCycle": "monthly",
            "mrr": 29.99,
            "status": "active",
            "trialEndsAt": null,
            "currentPeriodStart": "2026-05-17T21:00:29.000000Z",
            "currentPeriodEnd": "2026-06-17T21:00:29.000000Z",
            "cancelAtPeriodEnd": false,
            "gatewayCustomerId": "cus_1234567890",
            "gatewaySubscriptionId": "sub_1234567890",
            "paymentMethodBrand": "visa",
            "paymentMethodLast4": "4242",
            "createdAt": "2026-05-17T21:00:29.000000Z",
            "updatedAt": "2026-05-17T21:00:29.000000Z"
        }
    }
}
```

---

## 2. Get Business Activity Logs

### Endpoint
```
GET /api/superadmin/businesses/{id}/activity-logs
GET /api/superadmin/businesses/{id}/activity-logs?limit=20&offset=0
```

### Query Parameters
- `limit` (optional, default: 20): Number of logs to return
- `offset` (optional, default: 0): Pagination offset
- `type` (optional): Filter by type (user, subscription, product, security, billing, settings)
- `startDate` (optional): Filter logs from this date (ISO 8601)
- `endDate` (optional): Filter logs until this date (ISO 8601)

### Response Body
```json
{
    "success": true,
    "message": "Activity logs fetched successfully",
    "data": {
        "total": 45,
        "limit": 20,
        "offset": 0,
        "logs": [
            {
                "id": 1,
                "businessId": 1,
                "userId": 3,
                "action": "User Added",
                "type": "user",
                "description": "New team member Jane Manager (manager1@acme.com) added by owner",
                "details": {
                    "newUserId": 4,
                    "newUserEmail": "manager1@acme.com",
                    "newUserRole": "manager",
                    "performedBy": "owner1@acme.com"
                },
                "timestamp": "2026-05-19T15:30:00.000000Z",
                "ipAddress": "192.168.1.1",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            {
                "id": 2,
                "businessId": 1,
                "userId": 3,
                "action": "Subscription Upgraded",
                "type": "subscription",
                "description": "Business upgraded from starter to professional plan",
                "details": {
                    "fromPlan": "starter",
                    "toPlan": "professional",
                    "fromMrr": 9.99,
                    "toMrr": 29.99,
                    "prorationCredit": 0,
                    "performedBy": "owner1@acme.com"
                },
                "timestamp": "2026-05-18T10:15:00.000000Z",
                "ipAddress": "192.168.1.1",
                "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)"
            },
            {
                "id": 3,
                "businessId": 1,
                "userId": null,
                "action": "Security: IP Allowlist Updated",
                "type": "security",
                "description": "IP allowlist modified by superadmin",
                "details": {
                    "addedIPs": ["203.0.113.45"],
                    "removedIPs": [],
                    "performedBy": "superadmin@platform.com"
                },
                "timestamp": "2026-05-18T08:00:00.000000Z",
                "ipAddress": "198.51.100.1",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
            },
            {
                "id": 4,
                "businessId": 1,
                "userId": 3,
                "action": "Settings Modified",
                "type": "settings",
                "description": "Business settings updated: Theme changed to dark mode",
                "details": {
                    "setting": "theme",
                    "oldValue": "light",
                    "newValue": "dark",
                    "performedBy": "owner1@acme.com"
                },
                "timestamp": "2026-05-17T14:20:00.000000Z",
                "ipAddress": "192.168.1.1",
                "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            {
                "id": 5,
                "businessId": 1,
                "userId": null,
                "action": "Billing: Invoice Generated",
                "type": "billing",
                "description": "Monthly invoice generated for professional plan subscription",
                "details": {
                    "invoiceId": "INV-2026-00001",
                    "amount": 29.99,
                    "currency": "GHS",
                    "period": "2026-05-17 to 2026-06-17"
                },
                "timestamp": "2026-05-17T21:00:29.000000Z",
                "ipAddress": null,
                "userAgent": null
            }
        ]
    }
}
```

---

## 3. Update Business Settings (Superadmin Override)

### Endpoint
```
PUT /api/superadmin/businesses/{id}/settings
```

### Request Body
```json
{
    "verifiedStatus": true,
    "betaFeaturesEnabled": true,
    "maintenanceMode": false,
    "manualOverride": true,
    "suspensionReason": null,
    "notes": "Verified legitimate business - all checks passed"
}
```

### Response Body
```json
{
    "success": true,
    "message": "Business settings updated successfully",
    "data": {
        "id": 1,
        "businessId": 1,
        "verifiedStatus": true,
        "verifiedAt": "2026-05-19T16:45:00.000000Z",
        "betaFeaturesEnabled": true,
        "maintenanceMode": false,
        "manualOverride": true,
        "suspensionReason": null,
        "notes": "Verified legitimate business - all checks passed",
        "updatedAt": "2026-05-19T16:45:00.000000Z",
        "updatedBy": "superadmin@platform.com"
    }
}
```

---

## 4. Suspend Business

### Endpoint
```
POST /api/superadmin/businesses/{id}/suspend
```

### Request Body
```json
{
    "reason": "Payment method expired and unable to renew",
    "notifyOwner": true,
    "suspensionType": "temporary",
    "suspendUntil": "2026-05-26T23:59:59.000000Z",
    "dataPreservation": true,
    "notes": "Owner requested grace period for payment"
}
```

### Response Body
```json
{
    "success": true,
    "message": "Business suspended successfully",
    "data": {
        "id": 1,
        "name": "Acme Retail",
        "status": "suspended",
        "suspensionDetails": {
            "reason": "Payment method expired and unable to renew",
            "type": "temporary",
            "suspendedAt": "2026-05-19T16:50:00.000000Z",
            "suspendedUntil": "2026-05-26T23:59:59.000000Z",
            "suspendedBy": "superadmin@platform.com",
            "dataPreserved": true,
            "notes": "Owner requested grace period for payment",
            "notificationSentAt": "2026-05-19T16:50:05.000000Z"
        }
    }
}
```

---

## 5. Reactivate Business

### Endpoint
```
POST /api/superadmin/businesses/{id}/reactivate
```

### Request Body
```json
{
    "reason": "Payment method updated and verified",
    "notifyOwner": true,
    "notes": "Issue resolved - business can resume operations"
}
```

### Response Body
```json
{
    "success": true,
    "message": "Business reactivated successfully",
    "data": {
        "id": 1,
        "name": "Acme Retail",
        "status": "active",
        "reactivationDetails": {
            "reason": "Payment method updated and verified",
            "reactivatedAt": "2026-05-19T17:00:00.000000Z",
            "reactivatedBy": "superadmin@platform.com",
            "notes": "Issue resolved - business can resume operations",
            "notificationSentAt": "2026-05-19T17:00:05.000000Z"
        }
    }
}
```

---

## 6. Delete Business

### Endpoint
```
DELETE /api/superadmin/businesses/{id}
```

### Query Parameters
- `hardDelete` (optional, default: false): If true, permanently delete with all data. If false, soft delete (business marked as deleted but data preserved)

### Request Body (Optional)
```json
{
    "reason": "Duplicate business account - merged with main account",
    "preserveData": true,
    "transferDataTo": null,
    "notifyOwner": true
}
```

### Response Body
```json
{
    "success": true,
    "message": "Business deleted successfully",
    "data": {
        "id": 1,
        "name": "Acme Retail",
        "status": "deleted",
        "deletionDetails": {
            "reason": "Duplicate business account - merged with main account",
            "deletedAt": "2026-05-19T17:05:00.000000Z",
            "deletedBy": "superadmin@platform.com",
            "hardDelete": false,
            "dataPreserved": true,
            "transferredTo": null,
            "notificationSentAt": "2026-05-19T17:05:02.000000Z"
        }
    }
}
```

---

## Error Response Examples

### 400 Bad Request
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "reason",
            "message": "Reason is required for suspension"
        }
    ]
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Business not found",
    "data": null
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Only superadmin can perform this action",
    "data": null
}
```

### 409 Conflict
```json
{
    "success": false,
    "message": "Business is already suspended",
    "data": null
}
```

---

## Activity Log Types Reference

| Type | Icon | Color | Examples |
|------|------|-------|----------|
| `user` | Users | Blue | User added, role changed, user deleted |
| `subscription` | CreditCard | Emerald | Plan upgraded/downgraded, billing updated |
| `product` | Package | Emerald | Product added, inventory updated |
| `security` | Shield | Red | IP allowlist changed, permissions modified |
| `billing` | FileText | Gray | Invoice generated, payment processed |
| `settings` | Activity | Amber | Theme changed, preferences updated |

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- Phone numbers should include country code when available
- Currency is specified at business level (e.g., GHS for Ghana Cedis)
- Activity logs are immutable and serve as an audit trail
- Suspension is reversible; deletion can be soft or hard
- All superadmin actions are logged with user and IP information
