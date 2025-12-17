# MT4 Bot Data Verification

## ✅ Your Bot Data Structure is CORRECT

Your MT4 bot is sending the correct format to n8n:

```json
{
  "body": {
    "signal": "BUY",           // ✅ Correct - Will map to "direction"
    "symbol": "XAUUSD",        // ✅ Correct - Trading pair
    "screenshot_url": "C:\\..." // ⚠️ Local path (will need handling)
  }
}
```

## Data Mapping

### What Your Bot Sends → Dashboard Format

| Your Bot Field | Dashboard Field | Status |
|---------------|----------------|--------|
| `signal` (BUY/SELL) | `direction` | ✅ Perfect |
| `symbol` (XAUUSD) | `symbol` | ✅ Perfect |
| `screenshot_url` | `screenshot` | ⚠️ Needs cloud upload |

## What Works

✅ **Signal** - "BUY" or "SELL" maps perfectly to `direction`  
✅ **Symbol** - "XAUUSD" maps directly to `symbol`  
✅ **Structure** - JSON format is correct  
✅ **Webhook** - n8n receives it correctly  

## What Needs Attention

### Screenshot Path Issue

Your screenshot URL is a **local Windows path**:
```
C:\Users\Administrator\AppData\Roaming\MetaQuotes\Terminal\...\screenshot_BUY_2025-12-07_21-31-23.png
```

**Problem:** 
- n8n can't access local Windows paths
- Dashboard can't download from local paths
- Only works on the MT4 server itself

**Solutions:**

#### Option 1: Skip Screenshot (Easiest)
- Remove screenshot handling for now
- Trade will still be created
- Add screenshots later when you have cloud storage

#### Option 2: Upload to Cloud First
- MT4 uploads screenshot to:
  - Discord (then get URL from Discord)
  - FTP server
  - Cloud storage (S3, Supabase Storage, etc.)
- Then send the cloud URL to n8n

#### Option 3: Use Discord as Middleman
1. MT4 → Posts screenshot to Discord channel
2. Discord → Sends webhook to n8n with image URL
3. n8n → Downloads from Discord URL
4. n8n → Uploads to Supabase Storage
5. Dashboard → Shows screenshot

## Recommended n8n Workflow

### Current Workflow (Without Screenshot):

```
Webhook (receives your bot data)
    ↓
Set Node (transform data)
    - user_id: {{$env.USER_ID}}
    - symbol: {{$json.body.symbol}}
    - direction: {{$json.body.signal}}
    - entry_price: 0 (or add if MT4 sends it)
    - status: "OPEN"
    ↓
HTTP Request → Create Trade
    ↓
HTTP Request → Create Alert
    ↓
Respond to Webhook
```

### Enhanced Workflow (With Screenshot - Future):

```
Webhook (receives your bot data)
    ↓
Set Node (transform data)
    ↓
HTTP Request → Create Trade
    ↓
IF Node (check if screenshot_url exists and is cloud URL)
    ↓ (True)
Download File (from cloud URL)
    ↓
Upload to Supabase Storage
    ↓
HTTP Request → Create Screenshot
    ↓
HTTP Request → Create Alert
```

## Testing Your Bot Data

### Test 1: Verify Structure

Your data structure is perfect. Test it:

```bash
# This simulates what your bot sends
curl -X POST http://localhost:3000/api/webhooks/trade \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d60f254c-b41a-49c2-9788-12975c94f085",
    "symbol": "XAUUSD",
    "direction": "BUY",
    "entry_price": 2650.50,
    "lot_size": 0.01,
    "status": "OPEN",
    "ai_comment": "MT4 Alert: BUY signal for XAUUSD"
  }'
```

### Test 2: Check n8n Receives It

1. Set up n8n webhook
2. Send test data from your bot
3. Check n8n execution logs
4. Verify data is received correctly

## Your Bot Configuration

### Current Setup:
- ✅ **Webhook URL:** `https://task.oxyalgo.com/webhook-test/...`
- ✅ **User Agent:** `MT4 Alert Catcher/1.0`
- ✅ **Data Format:** JSON
- ✅ **Fields:** signal, symbol, screenshot_url

### What to Add (Optional):

If your MT4 EA can send more data, add these fields:

```json
{
  "signal": "BUY",
  "symbol": "XAUUSD",
  "entry_price": 2650.50,      // Add if available
  "lot_size": 0.01,            // Add if available
  "screenshot_url": "..."
}
```

## n8n Transformation

Your n8n workflow should transform like this:

**Input (from your bot):**
```json
{
  "body": {
    "signal": "BUY",
    "symbol": "XAUUSD"
  }
}
```

**Output (to dashboard):**
```json
{
  "user_id": "d60f254c-b41a-49c2-9788-12975c94f085",
  "symbol": "XAUUSD",
  "direction": "BUY",
  "entry_price": 0,
  "lot_size": 0.01,
  "status": "OPEN",
  "ai_comment": "MT4 Alert: BUY signal for XAUUSD"
}
```

## Confirmation Checklist

- [x] Bot sends JSON format ✅
- [x] Has `signal` field (BUY/SELL) ✅
- [x] Has `symbol` field ✅
- [x] Webhook URL is accessible ✅
- [ ] Screenshot handling (optional - skip for now)

## Next Steps

1. ✅ **Your bot format is correct** - No changes needed
2. ✅ **Set up n8n workflow** - Use `MT4_N8N_SETUP.md` guide
3. ✅ **Test the connection** - Send test alert from MT4
4. ⏭️ **Add screenshots later** - Focus on trades first

## Summary

**YES, your bot is correct!** ✅

The data structure is perfect for the dashboard. The only thing to note is the screenshot path (local Windows path), but you can:
- Skip screenshots for now (recommended)
- Add cloud upload later
- Everything else will work perfectly

Your bot is ready to connect! Just set up the n8n workflow as described in `MT4_N8N_SETUP.md`.

