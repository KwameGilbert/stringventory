# User Registration API Documentation

Registers a new user in the system. Upon successful registration, the user is automatically logged in (session created) and a verification email is sent to their registered address.

## Endpoint Information

- **URL:** `{{baseUrl}}/auth/register`
- **Method:** `POST`
- **Authentication:** None (Public)
- **Rate Limit:** Standard application rate limits apply.

## Request Headers

| Header       | Value              |
| :----------- | :----------------- |
| Content-Type | `application/json` |

## Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "role": "user"
}
```

### Parameters

| Field       | Type   | Required | Description                                                    |
| :---------- | :----- | :------- | :------------------------------------------------------------- |
| `firstName` | String | Yes      | User's first name.                                             |
| `lastName`  | String | Yes      | User's last name.                                              |
| `email`     | String | Yes      | A unique, valid email address.                                 |
| `password`  | String | Yes      | Minimum 8 characters. Will be hashed before storage.           |
| `role`      | String | No       | Defaults to `user`. Restricted roles require admin privileges. |

---

## Response

### Success (201 Created)

```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "status": "active"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "...",
    "session": {
      "id": "uuid",
      "expiresAt": "2026-03-21T...",
      "rememberMe": false
    }
  }
}
```

### Errors

- **409 Conflict**: A user with this email already exists.
- **400 Bad Request**: Validation failed (e.g., weak password, invalid email format).

---

## Post-Registration Flow

1. **Email Verification**: A verification token is generated and stored in the `tokens` table.
2. **Notification**: An email containing the verification link is sent via `EmailService`.
3. **Audit Trail**: An `account_created` event is logged in the `auditLogs`.
4. **Session**: A default "non-remembered" session is started immediately for a seamless onboarding experience.
