# Password Reset API Documentation

Handles the secure process of resetting a user's password when they have forgotten it. This involves two steps: requesting a reset link and resetting the password using a token.

## Step 1: Request Password Reset

Sends a password reset link to the user's email if the account exists.

### Endpoint Information

- **URL:** `{{baseUrl}}/auth/forgot-password`
- **Method:** `POST`
- **Authentication:** None (Public)
- **Rate Limit:** 3 attempts per 15 minutes.

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Parameters

| Field   | Type   | Required | Description                          |
| :------ | :----- | :------- | :----------------------------------- |
| `email` | String | Yes      | The user's registered email address. |

### Response

**Success (200 OK)**

```json
{
  "success": true,
  "message": "If an account exists with this email, you will receive a password reset link",
  "data": null
}
```

_Note: The response is the same whether the email exists or not to prevent account enumeration._

---

## Step 2: Reset Password

Resets the user's password using a valid token received via email.

### Endpoint Information

- **URL:** `{{baseUrl}}/auth/reset-password`
- **Method:** `POST`
- **Authentication:** None (Public)

### Request Body

```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePassword123!"
}
```

### Parameters

| Field      | Type   | Required | Description                                |
| :--------- | :----- | :------- | :----------------------------------------- |
| `token`    | String | Yes      | The secure token sent to the user's email. |
| `password` | String | Yes      | The new password (minimum 8 characters).   |

### Response (Success)

**200 OK**

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

---

## Technical Details

1. **Token Expiration**: Reset tokens are valid for **1 hour** from creation.
2. **One-Time Use**: Tokens are invalidated immediately after a successful reset.
3. **Audit Logging**:
   - `password_reset_requested` is logged when Step 1 is successful.
   - `password_reset_completed` is logged when Step 2 is successful.
4. **Security Notifications**: An automated email is sent to the user confirming the password change.
