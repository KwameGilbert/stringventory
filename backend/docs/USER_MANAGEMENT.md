# User Management API Documentation (Admin)

These endpoints are used for administrative user management. Access is restricted to users with `admin` or `super_admin` roles.

## Base URL

`{{baseUrl}}/users`

## Endpoints

### 1. List Users

Returns a paginated list of users with filtering and search support.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Admin, Super Admin
- **Query Params:**
  - `page`: Page number (default: 1)
  - `limit`: Records per page (default: 20)
  - `search`: Search by name or email
  - `status`: Filter by `active`, `inactive`, `suspended`
  - `role`: Filter by `user`, `admin`, `super_admin`

---

### 2. Create User

Allows an admin to manually create a user.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin, Super Admin
- **Body:**
  ```json
  {
    "firstName": "String",
    "lastName": "String",
    "email": "String",
    "password": "String",
    "role": "Enum",
    "status": "Enum"
  }
  ```

---

### 3. Update User

Update basic user information.

- **URL:** `/:id`
- **Method:** `PATCH`
- **Access:** Admin, Super Admin

---

### 4. Update Role

Change a user's role.

- **URL:** `/:id/role`
- **Method:** `PATCH`
- **Access:** **Super Admin Only**

---

### 5. Status Management

Quick endpoints for changing user account status.

- **Activate**: `POST /:id/activate`
- **Deactivate**: `POST /:id/deactivate`
- **Suspend**: `POST /:id/suspend`
- **Access:** Admin, Super Admin

---

### 6. Delete & Restore

- **Delete (Soft)**: `DELETE /:id` (Moves to trash/sets `deletedAt`)
- **Restore**: `POST /:id/restore` (Removes `deletedAt` flag)
- **Access:** Admin, Super Admin

## Security & Auditing

- **Authorization**: All requests must include a `Bearer` token in the `Authorization` header.
- **Audit Trails**: Every action (Creation, Update, Status Change, Deletion) is automatically logged in the `auditLogs` table with the ID of the performing admin.
- **Self-Protection**: Admins cannot delete their own accounts via these endpoints.
