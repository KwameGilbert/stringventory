# Messaging API Specification

The Messaging Center handles bulk campaigns, message history, and support communication.

## 1. Send Bulk Message (Campaigns)
Used when sending a message to multiple selected customers.

- **Method**: `POST`
- **Endpoint**: `/v1/messaging/bulk-messages`
- **Request Body**:
```json
{
    "recipientIds": [1, 2, 24], // Array of customer IDs
    "body": "Your message content here",
    "templateId": 5 // Optional: if using a predefined template
}
```

- **Success Response**:
```json
{
    "success": true,
    "message": "Successfully sent to 3 customers",
    "data": {
        "campaignId": "CAMP-12345",
        "status": "queued"
    }
}
```

## 2. Get Messages History
Used to populate the "History" tab.

- **Method**: `GET`
- **Endpoint**: `/v1/messaging/messages`
- **Query Parameters**: `?page=1&limit=10&recipientId=5` (optional filters)

- **Success Response**:
```json
{
    "success": true,
    "data": {
        "messages": [
            {
                "id": 101,
                "body": "Welcome to our new store!",
                "recipientCount": 45,
                "status": "delivered",
                "createdAt": "2026-04-08T10:00:00Z"
            }
        ],
        "pagination": {
            "total": 1,
            "pages": 1
        }
    }
}
```

## 3. Get Message Details
Used when clicking "View" on a message in the history.

- **Method**: `GET`
- **Endpoint**: `/v1/messaging/messages/{id}`

- **Success Response**:
```json
{
    "success": true,
    "data": {
        "id": 101,
        "body": "Welcome to our new store!",
        "recipients": [
            { "id": 1, "name": "John Doe", "status": "read" },
            { "id": 2, "name": "Jane Smith", "status": "delivered" }
        ],
        "stats": {
            "read": 24,
            "delivered": 21
        }
    }
}
```

## 4. Get Message Templates
Used to populate a "Templates" dropdown in the composer.

- **Method**: `GET`
- **Endpoint**: `/v1/messaging/templates`

- **Success Response**:
```json
{
    "success": true,
    "data": [
        { "id": 1, "name": "Welcome Text", "body": "Hi {{name}}, welcome to SV!" },
        { "id": 2, "name": "Order Alert", "body": "Your order #{{orderId}} is moving!" }
    ]
}
```

## 5. Support Chat
Standard structure for the support chat communication.

- **Send Message**: `POST /v1/messaging/messages`
- **Get Chat History**: `GET /v1/messaging/messages?recipientId=SUPPORT`
- **Request Body**:
```json
{
    "recipientId": "SUPPORT",
    "body": "I need help"
}
```
