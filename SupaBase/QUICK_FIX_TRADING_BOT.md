# Quick Fix: Trading Bot Workflow

## Problem
Your trading bot executes trades via AI Agent but doesn't post trade data to the dashboard.

## Solution: Add 4 Nodes After AI Agent

### Step 1: Add Code Node - "Extract Trade Data"

**Position:** Right after AI Agent node

**Settings:**
- **Mode:** Run Once for All Items
- **Code:** Copy from `n8n_trading_bot_code_nodes.js` (Node 1)

**What it does:** Extracts symbol, direction, decision from AI Agent output and webhook input.

---

### Step 2: Add Switch Node - "Route by Decision"

**Position:** After "Extract Trade Data" node

**Settings:**
- **Mode:** Route Based on Rules
- **Rules:**
  1. **Rule Name:** `APPROVED`
     - **Condition:** `decision` equals `APPROVED`
     - **Output:** `main`
  
  2. **Rule Name:** `DECLINED`
     - **Condition:** `decision` equals `DECLINED`
     - **Output:** `main`

**What it does:** Routes APPROVED trades to one branch, DECLINED to another.

---

### Step 3: Add HTTP Request Node - "Create Trade" (APPROVED branch)

**Position:** After Switch Node → APPROVED output

**Settings:**
- **Method:** POST
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/trade`
- **Authentication:** Header Auth
  - **Name:** `Authorization`
  - **Value:** `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body Content Type:** JSON
- **Body:**
```json
{
  "user_id": "{{$json.user_id}}",
  "symbol": "{{$json.symbol}}",
  "direction": "{{$json.direction}}",
  "entry_price": {{$json.entry_price}},
  "lot_size": {{$json.lot_size}},
  "status": "OPEN",
  "profit": 0,
  "ai_comment": "{{$json.ai_comment}}"
}
```

**What it does:** Posts trade data to dashboard.

---

### Step 4: Add HTTP Request Node - "Create Alert" (Both branches)

**Position A:** After "Create Trade" node (APPROVED branch)
**Position B:** After Switch Node → DECLINED output

**Settings (APPROVED):**
- **Method:** POST
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body:**
```json
{
  "user_id": "{{$json.user_id}}",
  "title": "Trade Executed",
  "message": "{{$json.symbol}} {{$json.direction}} trade opened",
  "alert_type": "SUCCESS"
}
```

**Settings (DECLINED):**
- **Method:** POST
- **URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`
- **Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`
- **Body:**
```json
{
  "user_id": "{{$json.user_id}}",
  "title": "Trade Declined",
  "message": "{{$json.ai_comment}}",
  "alert_type": "INFO"
}
```

---

## Environment Variables Required

Make sure these are set in n8n:

```bash
WEBHOOK_BASE_URL=https://task.oxyalgo.com/webhook
WEBHOOK_SECRET=d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa
USER_ID=d60f254c-b41a-49c2-9788-12975c94f085
```

---

## Workflow Structure

```
Webhook (MT4)
  ↓
AI Agent
  ├─→ OpenAI Chat Model
  ├─→ Simple Memory
  └─→ Tools (Analysis, Open Trade, Send Messages)
  ↓
Extract Trade Data (Code Node) ← ADD THIS
  ↓
Route by Decision (Switch Node) ← ADD THIS
  ├─→ APPROVED:
  │   ├─→ Create Trade (HTTP Request) ← ADD THIS
  │   └─→ Create Alert (HTTP Request) ← ADD THIS
  └─→ DECLINED:
      └─→ Create Alert (HTTP Request) ← ADD THIS
```

---

## Testing

1. **Send test signal:**
```bash
curl -X POST https://task.oxyalgo.com/webhook-test/b00192a1-e9b5-400c-a619-81b653fa0763 \
  -H "Content-Type: application/json" \
  -d '{
    "signal": "BUY",
    "symbol": "XAUUSD",
    "screenshot_url": "test.png",
    "user_id": "d60f254c-b41a-49c2-9788-12975c94f085"
  }'
```

2. **Check n8n execution:**
   - All nodes should execute successfully
   - Check HTTP Request responses (should return `{"success": true, ...}`)

3. **Check dashboard:**
   - `/dashboard/trades` - should show new trade
   - `/dashboard/alerts` - should show alert

---

## Common Issues

### Issue: `user_id` is missing
**Fix:** Add a Set node after Webhook to inject `user_id`:
- **Name:** `user_id`
- **Value:** `{{$env.USER_ID}}`

### Issue: `entry_price` is 0
**Fix:** The AI Agent should return `entry_price` in its JSON output. Update AI Agent prompt to include:
```json
{
  "entry_price": 1234.50
}
```

### Issue: HTTP Request returns 401 Unauthorized
**Fix:** Check `WEBHOOK_SECRET` matches exactly (no extra spaces).

### Issue: HTTP Request returns 400 Validation Error
**Fix:** Check that all required fields are present:
- `user_id` (UUID)
- `symbol` (string)
- `direction` ("BUY" or "SELL")
- `entry_price` (number, not string)

---

## Next Steps

After this works, you can:
1. Add screenshot upload to `/api/webhooks/screenshot`
2. Update account balance after trade execution
3. Add trade updates when trades close

