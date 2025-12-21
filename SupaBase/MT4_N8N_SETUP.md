# MT4 Bot → n8n → Dashboard Integration Guide

Complete setup guide for connecting your MT4 bot to the dashboard via n8n.

## Your MT4 Webhook Data Structure

```json
{
  "signal": "BUY",
  "symbol": "XAUUSD",
  "screenshot_url": "C:\\Users\\Administrator\\AppData\\Roaming\\MetaQuotes\\Terminal\\..."
}
```

## Step-by-Step n8n Workflow Setup

### Step 1: Create Webhook Trigger

1. **Add Webhook Node**
   - **HTTP Method:** POST
   - **Path:** `mt4-trade` (or any name you want)
   - **Response Mode:** Respond to Webhook
   - **Save** the workflow to get the webhook URL

2. **Copy Webhook URL**
   - Example: `https://your-n8n.com/webhook/mt4-trade`
   - Use this URL in your MT4 EA

### Step 2: Transform Data (Set Node)

**Add Set Node** to transform MT4 data to our format:

**Assignments:**
- `user_id` → `{{$env.USER_ID}}`
- `symbol` → `{{$json.body.symbol}}`
- `direction` → `{{$json.body.signal}}` (BUY/SELL)
- `entry_price` → `{{$json.body.entry_price || 0}}` (add if MT4 sends it)
- `lot_size` → `{{$json.body.lot_size || 0.01}}`
- `status` → `"OPEN"`
- `ai_comment` → `"MT4 Alert: {{$json.body.signal}} signal for {{$json.body.symbol}}"`

### Step 3: Create Trade (HTTP Request)

**Add HTTP Request Node:**

- **Method:** POST
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/trade`
- **Authentication:** Header Auth
- **Name:** `Authorization`
- **Value:** `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body (JSON):**
```json
{
  "user_id": "{{$json.user_id}}",
  "symbol": "{{$json.symbol}}",
  "direction": "{{$json.direction}}",
  "entry_price": {{$json.entry_price}},
  "lot_size": {{$json.lot_size}},
  "status": "{{$json.status}}",
  "profit": 0,
  "ai_comment": "{{$json.ai_comment}}"
}
```

### Step 4: Create Alert (HTTP Request)

**Add HTTP Request Node:**

- **Method:** POST
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body (JSON):**
```json
{
  "user_id": "{{$env.USER_ID}}",
  "title": "Trade Alert",
  "message": "{{$json.symbol}} {{$json.direction}} signal received from MT4",
  "alert_type": "SUCCESS"
}
```

### Step 5: Respond to Webhook

**Add Respond to Webhook Node:**

- **Response Body:**
```json
{
  "success": true,
  "message": "Trade processed successfully",
  "trade_id": "{{$json.trade.id}}"
}
```

## Complete Workflow Structure

```
Webhook Trigger
    ↓
Transform Data (Set Node)
    ↓
Create Trade (HTTP Request)
    ↓
Create Alert (HTTP Request)
    ↓
Respond to Webhook
```

## MT4 EA Configuration

### Option 1: Simple Alert (Current)

Your MT4 EA should send HTTP POST to n8n webhook:

```mql4
// In your MT4 EA
string url = "https://your-n8n.com/webhook/mt4-trade";
string data = "{"
    + "\"signal\":\"" + signal + "\","
    + "\"symbol\":\"" + Symbol() + "\","
    + "\"screenshot_url\":\"" + screenshotPath + "\""
    + "}";

WebRequest("POST", url, "", data, headers, timeout, result, headers);
```

### Option 2: Enhanced (With More Data)

Add more fields to your MT4 EA:

```mql4
string data = "{"
    + "\"signal\":\"" + signal + "\","
    + "\"symbol\":\"" + Symbol() + "\","
    + "\"entry_price\":" + DoubleToString(Ask, 5) + ","
    + "\"lot_size\":" + DoubleToString(LotSize, 2) + ","
    + "\"screenshot_url\":\"" + screenshotPath + "\""
    + "}";
```

## Handling Screenshots

### Current Issue

Your screenshot URL is a local Windows path:
```
C:\Users\Administrator\...\screenshot_BUY_2025-12-07_21-31-23.png
```

This won't work because:
- n8n can't access local Windows paths
- Dashboard can't download from local paths

### Solutions

#### Solution 1: Upload Screenshot to Cloud Storage

**Add to n8n workflow after Create Trade:**

1. **Download File Node** (if MT4 uploads to FTP/HTTP)
2. **Upload to Supabase Storage** (or S3, etc.)
3. **HTTP Request** → Screenshot webhook

#### Solution 2: Skip Screenshot for Now

- Remove screenshot handling
- Just create trade and alert
- Add screenshots later when you have cloud storage

#### Solution 3: Use Discord as Middleman

1. MT4 → Discord (post screenshot)
2. Discord → n8n (webhook with image URL)
3. n8n → Dashboard (download and upload)

## Testing Your Workflow

### Test 1: Manual Test in n8n

1. Click "Execute Workflow" button
2. Use this test data:
```json
{
  "body": {
    "signal": "BUY",
    "symbol": "XAUUSD",
    "screenshot_url": "test.png"
  }
}
```

3. Check if:
   - Trade is created
   - Alert is created
   - Response is sent

### Test 2: Test from MT4

1. Trigger your MT4 EA
2. Check n8n workflow execution
3. Check dashboard for:
   - New trade in Trades page
   - New alert in Alerts page
   - Real-time update

## Enhanced Workflow (With Error Handling)

### Add Error Handling:

1. **IF Node** after Create Trade:
   - **Condition:** `{{$json.error}}` exists
   - **True:** Send error notification
   - **False:** Continue to Create Alert

2. **Try-Catch Node** (if available):
   - Wrap HTTP requests
   - Log errors
   - Send error alerts

## Your n8n Environment Variables

Make sure these are set in n8n:

```
WEBHOOK_BASE_URL=http://localhost:3000
WEBHOOK_SECRET=d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa
USER_ID=d60f254c-b41a-49c2-9788-12975c94f085
```

## Production Setup

### For Production:

1. **Update WEBHOOK_BASE_URL:**
   ```
   WEBHOOK_BASE_URL=https://your-app.vercel.app
   ```

2. **Update MT4 EA URL:**
   - Use your production n8n webhook URL
   - Make sure it's accessible from MT4 server

3. **Test Production:**
   - Send test alert from MT4
   - Verify dashboard updates
   - Check real-time updates work

## Troubleshooting

### Issue: Trade Not Appearing

**Check:**
1. n8n workflow executed? (check execution logs)
2. HTTP Request returned 200? (check response)
3. Dashboard open? (real-time updates only work if page is open)
4. Refresh dashboard page

### Issue: 401 Unauthorized

**Fix:**
- Check `WEBHOOK_SECRET` matches exactly
- Verify Authorization header: `Bearer {secret}`
- No extra spaces

### Issue: Validation Error

**Fix:**
- Check `user_id` is correct UUID
- Verify `symbol` is string (not number)
- Check `direction` is "BUY" or "SELL"
- Verify `entry_price` is number

### Issue: Screenshot Not Working

**Fix:**
- Local paths won't work
- Upload to cloud storage first
- Or skip screenshots for now

## Quick Reference

### Your Credentials:
- **User ID:** `d60f254c-b41a-49c2-9788-12975c94f085`
- **Webhook Secret:** `d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa`
- **Base URL:** `http://localhost:3000` (dev) or `https://your-app.vercel.app` (prod)

### MT4 Data Mapping:
- `signal` → `direction` (BUY/SELL)
- `symbol` → `symbol` (XAUUSD, EURUSD, etc.)
- `screenshot_url` → (skip for now or upload to cloud)

### Expected Flow:
1. MT4 EA sends POST to n8n webhook
2. n8n transforms data
3. n8n creates trade in dashboard
4. n8n creates alert
5. Dashboard updates in real-time
6. User sees trade and alert

## Next Steps

1. ✅ Set up n8n workflow (use guide above)
2. ✅ Test with manual trigger
3. ✅ Update MT4 EA to send to n8n webhook
4. ✅ Test from MT4
5. ✅ Verify dashboard updates
6. ✅ Set up screenshot handling (optional)

Your MT4 bot is ready to connect! Start with the basic workflow and add screenshots later.



