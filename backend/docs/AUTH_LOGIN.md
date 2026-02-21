# User Login API Documentation

Authenticates a user and establishes a secure session. This endpoint includes built-in rate limiting, bot detection, and device fingerprinting.

## Endpoint Information

- **URL:** `{{baseUrl}}/auth/login`
- **Method:** `POST`
- **Authentication:** None (Public)
- **Rate Limit:** 5 attempts per 15 minutes per email/IP.

## Request Headers

| Header       | Value              |
| :----------- | :----------------- |
| Content-Type | `application/json` |

## Request Body

```json
{
  "email": "user@example.com",
  "password": "your_secure_password",
  "rememberMe": true
}
```

### Parameters

| Field        | Type    | Required | Description                                                                                                      |
| :----------- | :------ | :------- | :--------------------------------------------------------------------------------------------------------------- |
| `email`      | String  | Yes      | The user's registered email address.                                                                             |
| `password`   | String  | Yes      | The user's account password.                                                                                     |
| `rememberMe` | Boolean | No       | If `true`, the session and refresh token will have a longer expiration (typically 30 days). Defaults to `false`. |

---

## Response

### Success (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "...",
    "session": {
      "id": "uuid",
      "expiresAt": "2026-03-21T...",
      "rememberMe": true
    }
  }
}
```

### Errors

- **401 Unauthorized**: Invalid email or password, or account is locked/inactive.
- **429 Too Many Requests**: Excessive login attempts.
- **400 Bad Request**: Validation failed (e.g., missing fields).

---

## Security Features

1. **Device Fingerprinting**: Automatically captures browser and OS info to track session security.
2. **Session Persistence**: Sessions are stored in the `authSessions` table, allowing users to manage active devices.
3. **Audit Logging**: All attempts are recorded in the `auditLogs` for security monitoring.
4. **Account Protection**: Automatically locks accounts after 5 consecutive failures.
