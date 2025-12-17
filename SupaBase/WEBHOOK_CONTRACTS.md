# Webhook API Contracts

This document defines the exact contract for all webhook endpoints that n8n will call.

## Authentication

All webhooks require authentication via HTTP header:
```
Authorization: Bearer {WEBHOOK_SECRET}
```

The `WEBHOOK_SECRET` must match the value set in your environment variables.

## Base URL

Production: `https://your-app.vercel.app/api/webhooks`
Development: `http://localhost:3000/api/webhooks`

---

## 1. Trade Webhook

**Endpoint:** `POST /api/webhooks/trade`

**Description:** Creates or updates a trade record. If `trade_id` is provided, updates existing trade. Otherwise, creates new trade.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",  // Required: UUID
  "account_id": "550e8400-e29b-41d4-a716-446655440001", // Optional: UUID (auto-created if missing)
  "symbol": "EURUSD",                                   // Required: String
  "direction": "BUY",                                   // Required: "BUY" | "SELL"
  "entry_price": 1.08500,                              // Required: Number (decimal)
  "exit_price": 1.08600,                               // Optional: Number (decimal)
  "lot_size": 0.01,                                    // Optional: Number (default: 0.01)
  "profit": 10.50,                                     // Optional: Number (default: 0)
  "status": "CLOSED",                                  // Optional: "OPEN" | "CLOSED" | "PENDING" (default: "OPEN")
  "ai_comment": "Strong bullish momentum detected",    // Optional: String
  "opened_at": "2024-01-01T10:00:00Z",                // Optional: ISO 8601 string
  "closed_at": "2024-01-01T12:00:00Z",                // Optional: ISO 8601 string
  "trade_id": "550e8400-e29b-41d4-a716-446655440002"   // Optional: UUID (for updates)
}
```

**Response (Success):**
```json
{
  "success": true,
  "trade": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "account_id": "550e8400-e29b-41d4-a716-446655440001",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "exit_price": 1.08600,
    "lot_size": 0.01,
    "profit": 10.50,
    "status": "CLOSED",
    "ai_comment": "Strong bullish momentum detected",
    "opened_at": "2024-01-01T10:00:00Z",
    "closed_at": "2024-01-01T12:00:00Z",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["symbol"],
      "message": "Required"
    }
  ]
}
```

**Example n8n HTTP Request Node:**
- Method: POST
- URL: `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/trade`
- Authentication: Header
- Header Name: `Authorization`
- Header Value: `Bearer {{$env.WEBHOOK_SECRET}}`
- Body: JSON
- JSON Body: (use expression editor with your trade data)

---

## 2. Account Webhook

**Endpoint:** `POST /api/webhooks/account`

**Description:** Updates account balance, equity, or bot status. Creates account if it doesn't exist.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",  // Required: UUID
  "balance": 10000.00,                                // Optional: Number (decimal)
  "equity": 10050.00,                                 // Optional: Number (decimal)
  "bot_status": true                                  // Optional: Boolean
}
```

**Response (Success):**
```json
{
  "success": true,
  "account": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "balance": 10000.00,
    "equity": 10050.00,
    "bot_status": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

**Example n8n Workflow:**
1. MT4/MT5 EA sends account update
2. n8n receives webhook
3. Transform data to match schema
4. Call Account Webhook endpoint

---

## 3. Signal Webhook

**Endpoint:** `POST /api/webhooks/signal`

**Description:** Creates a new AI trading signal.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",  // Required: UUID
  "symbol": "EURUSD",                                  // Required: String
  "direction": "BUY",                                  // Required: "BUY" | "SELL"
  "entry_price": 1.08500,                             // Required: Number (decimal)
  "take_profit": 1.09000,                             // Optional: Number (decimal)
  "stop_loss": 1.08000,                               // Optional: Number (decimal)
  "confidence_score": 85.5,                            // Optional: Number (0-100)
  "notes": "Strong support level identified",         // Optional: String
  "signal_type": "DAILY",                              // Required: "DAILY" | "WEEKLY"
  "expires_at": "2024-01-02T00:00:00Z"                // Optional: ISO 8601 string
}
```

**Response (Success):**
```json
{
  "success": true,
  "signal": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "take_profit": 1.09000,
    "stop_loss": 1.08000,
    "confidence_score": 85.5,
    "notes": "Strong support level identified",
    "signal_type": "DAILY",
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-01-02T00:00:00Z"
  }
}
```

---

## 4. Alert Webhook

**Endpoint:** `POST /api/webhooks/alert`

**Description:** Creates a new alert notification.

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",  // Required: UUID
  "title": "Trade Executed",                          // Required: String
  "message": "EURUSD BUY order filled at 1.08500",   // Required: String
  "alert_type": "SUCCESS"                             // Optional: "INFO" | "WARNING" | "ERROR" | "SUCCESS" (default: "INFO")
}
```

**Response (Success):**
```json
{
  "success": true,
  "alert": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Trade Executed",
    "message": "EURUSD BUY order filled at 1.08500",
    "alert_type": "SUCCESS",
    "seen": false,
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

---

## 5. Screenshot Webhook

**Endpoint:** `POST /api/webhooks/screenshot`

**Description:** Uploads a screenshot and links it to a trade. Supports three methods:
1. Provide `storage_path` if already uploaded to Supabase Storage
2. Provide `image_url` to download and upload
3. Provide `image_data` as base64 to upload

**Request Body (Option 1 - Storage Path):**
```json
{
  "trade_id": "550e8400-e29b-41d4-a716-446655440002",  // Required: UUID
  "storage_path": "trade_id/1234567890.png"            // Required: String (path in screenshots bucket)
}
```

**Request Body (Option 2 - Image URL):**
```json
{
  "trade_id": "550e8400-e29b-41d4-a716-446655440002",  // Required: UUID
  "image_url": "https://cdn.discordapp.com/attachments/..." // Required: String (URL to download)
}
```

**Request Body (Option 3 - Base64 Image):**
```json
{
  "trade_id": "550e8400-e29b-41d4-a716-446655440002",  // Required: UUID
  "image_data": "iVBORw0KGgoAAAANSUhEUgAA..."         // Required: String (base64 encoded image)
}
```

**Response (Success):**
```json
{
  "success": true,
  "screenshot": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "trade_id": "550e8400-e29b-41d4-a716-446655440002",
    "storage_path": "550e8400-e29b-41d4-a716-446655440002/1704110400000.png",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

**Example n8n Workflow for Screenshots:**
1. Discord webhook receives message with image attachment
2. n8n extracts image URL from Discord attachment
3. Call Screenshot Webhook with `image_url` parameter
4. Webhook downloads image and uploads to Supabase Storage
5. Screenshot record is created in database

---

## Error Responses

All endpoints return consistent error formats:

**400 Bad Request (Validation Error):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["field_name"],
      "message": "Error message"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "error": "Trade not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to create trade",
  "details": "Detailed error message"
}
```

---

## n8n Workflow Examples

### Complete Trade Flow
1. **Discord Webhook Trigger** - Receives trade notification
2. **Extract Data** - Parse Discord message for trade details
3. **HTTP Request (Trade)** - POST to `/api/webhooks/trade`
4. **Extract Image URL** - Get screenshot URL from Discord attachment
5. **HTTP Request (Screenshot)** - POST to `/api/webhooks/screenshot` with `image_url`
6. **HTTP Request (Alert)** - POST to `/api/webhooks/alert` to notify user

### Account Update Flow
1. **MT4/MT5 EA** - Sends account balance update
2. **n8n Webhook** - Receives account data
3. **Transform** - Map to webhook schema
4. **HTTP Request (Account)** - POST to `/api/webhooks/account`

### Signal Generation Flow
1. **AI Service** - Generates trading signal
2. **n8n Webhook** - Receives signal data
3. **HTTP Request (Signal)** - POST to `/api/webhooks/signal`
4. **HTTP Request (Alert)** - POST to `/api/webhooks/alert` to notify user

---

## Testing with cURL

### Test Trade Webhook
```bash
curl -X POST https://your-app.vercel.app/api/webhooks/trade \
  -H "Authorization: Bearer your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "status": "OPEN"
  }'
```

### Test Account Webhook
```bash
curl -X POST https://your-app.vercel.app/api/webhooks/account \
  -H "Authorization: Bearer your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "balance": 10000.00,
    "equity": 10050.00,
    "bot_status": true
  }'
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:
- Consider implementing rate limiting per `user_id`
- Monitor webhook call frequency
- Set up alerts for unusual patterns

## Idempotency

- Trade updates are idempotent when `trade_id` is provided
- Account updates are idempotent (last update wins)
- Signals and alerts are not idempotent (each call creates new record)

For idempotent operations, include a unique identifier in your n8n workflow and check for duplicates before calling webhooks.

