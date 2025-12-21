# n8n Integration Guide

Complete guide to connect n8n workflows to your AI Trading Dashboard.

## Prerequisites

- n8n instance running (local or cloud)
- Your User ID: `d60f254c-b41a-49c2-9788-12975c94f085`
- Webhook Secret: `d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa`
- Dashboard URL: `http://localhost:3000` (or your production URL)

## Quick Setup

### Step 1: Configure n8n Environment Variables

In n8n, go to **Settings → Environment Variables** and add:

```
WEBHOOK_BASE_URL=http://localhost:3000
WEBHOOK_SECRET=d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa
USER_ID=d60f254c-b41a-49c2-9788-12975c94f085
```

### Step 2: Create Your First Workflow

## Workflow Examples

### Workflow 1: Update Account Balance

**Use Case:** MT4/MT5 EA sends account updates

**n8n Workflow:**
1. **Webhook Trigger** (or Manual Trigger for testing)
2. **HTTP Request Node**

**HTTP Request Configuration:**
- **Method:** `POST`
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/account`
- **Authentication:** Generic Credential Type → Header Auth
- **Name:** `Authorization`
- **Value:** `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body Content Type:** JSON
- **Body:**
```json
{
  "user_id": "{{$env.USER_ID}}",
  "balance": {{$json.balance}},
  "equity": {{$json.equity}},
  "bot_status": {{$json.bot_status}}
}
```

**Test Data:**
```json
{
  "balance": 10000.00,
  "equity": 10050.00,
  "bot_status": true
}
```

---

### Workflow 2: Create Trade

**Use Case:** MT4/MT5 EA sends trade notification

**n8n Workflow:**
1. **Webhook Trigger** (receives trade data from EA/Discord)
2. **Set Node** (transform data to match schema)
3. **HTTP Request Node** (send to dashboard)

**Set Node Configuration:**
- Map incoming data to webhook format:
  - `user_id` → `{{$env.USER_ID}}`
  - `symbol` → `{{$json.symbol}}`
  - `direction` → `{{$json.direction}}`
  - `entry_price` → `{{$json.entry_price}}`
  - etc.

**HTTP Request Configuration:**
- **Method:** `POST`
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/trade`
- **Authentication:** Header Auth
- **Name:** `Authorization`
- **Value:** `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body Content Type:** JSON
- **Body:**
```json
{
  "user_id": "{{$env.USER_ID}}",
  "symbol": "{{$json.symbol}}",
  "direction": "{{$json.direction}}",
  "entry_price": {{$json.entry_price}},
  "lot_size": {{$json.lot_size || 0.01}},
  "status": "{{$json.status || 'OPEN'}}",
  "profit": {{$json.profit || 0}},
  "ai_comment": "{{$json.ai_comment || ''}}"
}
```

**Test Data:**
```json
{
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "lot_size": 0.01,
  "status": "OPEN",
  "profit": 0,
  "ai_comment": "Test trade from n8n"
}
```

---

### Workflow 3: Complete Trade Flow (Trade + Screenshot + Alert)

**Use Case:** Discord bot posts trade with screenshot

**n8n Workflow:**
1. **Discord Trigger** (or Webhook Trigger)
2. **Extract Trade Data** (Set Node)
3. **HTTP Request** → Create Trade
4. **Extract Screenshot URL** (from Discord attachment)
5. **HTTP Request** → Upload Screenshot
6. **HTTP Request** → Create Alert

**Step 3: Create Trade**
- Same as Workflow 2

**Step 5: Upload Screenshot**
- **Method:** `POST`
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/screenshot`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body:**
```json
{
  "trade_id": "{{$json('Create Trade').trade.id}}",
  "image_url": "{{$json.attachment_url}}"
}
```

**Step 6: Create Alert**
- **Method:** `POST`
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body:**
```json
{
  "user_id": "{{$env.USER_ID}}",
  "title": "Trade Executed",
  "message": "{{$json.symbol}} {{$json.direction}} trade opened at {{$json.entry_price}}",
  "alert_type": "SUCCESS"
}
```

---

### Workflow 4: Create AI Signal

**Use Case:** AI service generates trading signal

**n8n Workflow:**
1. **Webhook Trigger** (receives signal from AI service)
2. **HTTP Request Node**

**HTTP Request Configuration:**
- **Method:** `POST`
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/signal`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body:**
```json
{
  "user_id": "{{$env.USER_ID}}",
  "symbol": "{{$json.symbol}}",
  "direction": "{{$json.direction}}",
  "entry_price": {{$json.entry_price}},
  "take_profit": {{$json.take_profit}},
  "stop_loss": {{$json.stop_loss}},
  "confidence_score": {{$json.confidence_score}},
  "notes": "{{$json.notes}}",
  "signal_type": "{{$json.signal_type}}"
}
```

**Test Data:**
```json
{
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "take_profit": 1.09000,
  "stop_loss": 1.08000,
  "confidence_score": 85.5,
  "notes": "Strong support level identified",
  "signal_type": "DAILY"
}
```

---

## Testing Your Workflows

### Test 1: Update Account

**Manual Trigger** with this data:
```json
{
  "balance": 10000.00,
  "equity": 10050.00,
  "bot_status": true
}
```

**Expected Result:**
- Dashboard updates immediately
- Balance shows $10,000.00
- Equity shows $10,050.00
- Bot status shows "ON"

### Test 2: Create Trade

**Manual Trigger** with this data:
```json
{
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "lot_size": 0.01,
  "status": "OPEN"
}
```

**Expected Result:**
- Trade appears in Trades page
- Dashboard shows 1 open trade
- Updates in real-time

### Test 3: Create Signal

**Manual Trigger** with this data:
```json
{
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "take_profit": 1.09000,
  "stop_loss": 1.08000,
  "confidence_score": 85.5,
  "notes": "Test signal",
  "signal_type": "DAILY"
}
```

**Expected Result:**
- Signal appears on Signals page
- Shows confidence score
- All levels displayed

---

## Common n8n Patterns

### Pattern 1: Error Handling

Add **IF Node** after HTTP Request:
- **Condition:** `{{$json.error}}` exists
- **True:** Send error notification
- **False:** Continue workflow

### Pattern 2: Retry Logic

Add **Wait Node** + **HTTP Request** loop:
- If request fails, wait 5 seconds
- Retry up to 3 times
- Log failures

### Pattern 3: Data Transformation

Use **Set Node** to transform:
- Discord message → Trade format
- MT4 data → Account format
- AI output → Signal format

---

## Production Setup

### For Production (Vercel):

1. **Update Environment Variables:**
   ```
   WEBHOOK_BASE_URL=https://your-app.vercel.app
   ```

2. **Use Same Webhook Secret:**
   - Keep `WEBHOOK_SECRET` the same
   - Update in both n8n and Vercel

3. **Test Production:**
   - Use production URL in n8n workflows
   - Test with real data
   - Monitor dashboard for updates

---

## Troubleshooting

### Issue: 401 Unauthorized

**Fix:**
- Check `WEBHOOK_SECRET` matches exactly
- Verify Authorization header format: `Bearer {secret}`
- No extra spaces in secret

### Issue: Validation Error

**Fix:**
- Check JSON body matches schema
- Verify `user_id` is correct UUID
- Check required fields are present

### Issue: Data Not Appearing

**Fix:**
- Check n8n workflow executed successfully
- Verify HTTP Request returned 200 status
- Check dashboard is open (to see real-time updates)
- Refresh dashboard page

### Issue: Real-time Not Working

**Fix:**
- Verify Realtime is enabled in Supabase
- Check RLS policies allow SELECT
- Ensure dashboard page is open

---

## Quick Reference

### Your Credentials:
- **User ID:** `d60f254c-b41a-49c2-9788-12975c94f085`
- **Webhook Secret:** `d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa`
- **Base URL (Dev):** `http://localhost:3000`
- **Base URL (Prod):** `https://your-app.vercel.app`

### Webhook Endpoints:
- **Account:** `/api/webhooks/account`
- **Trade:** `/api/webhooks/trade`
- **Signal:** `/api/webhooks/signal`
- **Alert:** `/api/webhooks/alert`
- **Screenshot:** `/api/webhooks/screenshot`

### Required Header:
```
Authorization: Bearer d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa
```

---

## Next Steps

1. ✅ Set up n8n environment variables
2. ✅ Create test workflow (Account update)
3. ✅ Test with manual trigger
4. ✅ Verify dashboard updates
5. ✅ Connect your MT4/MT5 EA or Discord bot
6. ✅ Set up production workflows

Your system is ready! Start with the Account Update workflow and test it, then add more workflows as needed.



