## payload for backend to create the api endpionts for sringVentory system

## BASE_URL = 
`/api/v1`

## Authentiction

### Signup 
## Request Metthod: `POST`
-- **Endpoint:** `/api/v1/auth/login`

* Request body * 
`{
  "user": {
    "id": "user_88234",
    "fullName": "John Doe",
    "roleTitle": "Sales Manager",
    "status": "active"
  },
  "access": {
    "role": "ADMIN", 
    "permissions": [
      "VIEW_DASHBOARD",
      "VIEW_KPI_GROSS_REVENUE",
      "VIEW_PRODUCTS",
      "MANAGE_PRODUCTS"
    ],
  }
}`

## Response ##
{
    `email` (string, rquired)
    `password` (sring, required)
    `status`: success
    `message`: User logged in successfully
    `token`: JWT token
    `data`: user object (without password)
    `role`: admin
}


## Admin User Management (Requires Admin JWT)

### Create User
- **Endpoint:** `/api/v1/admin/users/create-user`
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "admin@test.com",
  "password": "hashed_password_or_plain_if_new",
  "roleTitle": "Sales Manager",
  "status": "active",
  "twoFactorEnabled": false,
  "permissions": [
    "VIEW_DASHBOARD",
    "VIEW_KPI_GROSS_REVENUE",
    "VIEW_PRODUCTS",
    "MANAGE_PRODUCTS",
    "VIEW_ORDERS"
  ]
}