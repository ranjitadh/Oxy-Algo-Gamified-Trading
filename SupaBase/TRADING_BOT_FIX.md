# Trading Bot Workflow Fix Guide

## Current Issue

Your trading bot workflow receives MT4 signals, processes them through an AI Agent, but **doesn't post trade data back to the dashboard** after execution.

## Complete Workflow Fix

### Step 1: Fix the "Open Trade" Tool Configuration

The "Open Trade" HTTP Request tool in your AI Agent needs proper configuration:

**Current Issue:** Shows "GET: undefined" - URL is not properly set

**Fix:**
1. In n8n, edit the "Open Trade" tool node
2. **Method:** GET (keep as is - this is correct for your execution API)
3. **URL:** Set this to your actual trade execution endpoint:
   ```
   https://server.oxyalgo.com/orders-api-v1/orders-api.php?api_key=fAvjpL0WAJTfzeE1a&action={{action}}&symbol={{symbol}}&volume=0.1&sl={{stop_loss}}&tp={{take_profit}}
   ```
4. **Note:** The AI Agent will populate `{{action}}`, `{{symbol}}`, `{{stop_loss}}`, `{{take_profit}}` automatically

### Step 2: Add Nodes After AI Agent Decision

After your AI Agent node, add these nodes to capture and post trade data:

#### Node 1: Extract Trade Data (Code Node)

**Purpose:** Extract trade details from AI Agent output and webhook input

**Mode:** Run Once for All Items

**Code:**
```javascript
// Get AI Agent output
const aiOutput = $input.all().find(item => item.json.decision);
const webhookInput = $input.all().find(item => item.json.body);

if (!aiOutput || !webhookInput) {
  return [{ json: { error: 'Missing required data' } }];
}

const decision = aiOutput.json.decision;
const heading = aiOutput.json.heading || '';
const confidence = aiOutput.json.confidence || 0;

// Extract symbol and direction from heading (e.g., "XAUUSD BUY")
const headingParts = heading.split(' ');
const symbol = headingParts[0] || webhookInput.json.body.symbol;
const direction = headingParts[1] || webhookInput.json.body.signal;

// Get user_id from webhook (you may need to set this as an environment variable)
const userId = webhookInput.json.body.user_id || $env.USER_ID;

// Extract SL/TP from AI Agent's execution (if available)
// Note: The AI Agent executes the trade, but we need to capture the response
// For now, we'll use defaults or extract from the execution response
const stopLoss = aiOutput.json.stop_loss || null;
const takeProfit = aiOutput.json.take_profit || null;

// Get entry price (you may need to fetch current market price or use a default)
const entryPrice = webhookInput.json.body.entry_price || 0;

return [{
  json: {
    decision,
    symbol,
    direction: direction.toUpperCase(),
    entry_price: entryPrice,
    stop_loss: stopLoss,
    take_profit: takeProfit,
    lot_size: 0.1,
    user_id: userId,
    ai_comment: aiOutput.json.discord_message || `AI Decision: ${decision}, Confidence: ${confidence}%`,
    confidence_score: parseFloat(confidence),
    screenshot_url: webhookInput.json.body.screenshot_url || null,
  }
}];
```

#### Node 2: Switch Node (Route by Decision)

**Purpose:** Route APPROVED trades to trade creation, DECLINED to alert only

**Mode:** Route Based on Rules

**Rules:**
- **Rule 1:** `decision` equals `APPROVED` → Route to "Create Trade" branch
- **Rule 2:** `decision` equals `DECLINED` → Route to "Create Alert" branch

#### Node 3: Create Trade (HTTP Request) - APPROVED Branch

**Purpose:** Post trade data to dashboard

**Method:** POST

**URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/trade`

**Authentication:** Header Auth
- **Name:** `Authorization`
- **Value:** `Bearer {{$env.WEBHOOK_SECRET}}`

**Body (JSON):**
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

#### Node 4: Create Alert for Trade (HTTP Request) - APPROVED Branch

**Purpose:** Create success alert for executed trade

**Method:** POST

**URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`

**Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`

**Body (JSON):**
```json
{
  "user_id": "{{$json.user_id}}",
  "title": "Trade Executed",
  "message": "{{$json.symbol}} {{$json.direction}} trade opened at {{$json.entry_price}}",
  "alert_type": "SUCCESS"
}
```

#### Node 5: Create Alert for Decline (HTTP Request) - DECLINED Branch

**Purpose:** Create info alert for declined trade

**Method:** POST

**URL:** `{{$env.WEBHOOK_BASE_URL}}/api/webhooks/alert`

**Authentication:** Header Auth → `Bearer {{$env.WEBHOOK_SECRET}}`

**Body (JSON):**
```json
{
  "user_id": "{{$json.user_id}}",
  "title": "Trade Declined",
  "message": "{{$json.ai_comment}}",
  "alert_type": "INFO"
}
```

### Step 3: Update AI Agent Prompt

Modify your AI Agent prompt to include trade execution details in the response:

**Add to OUTPUT section:**
```json
{
  "decision": "APPROVED or DECLINED",
  "heading": "{SYMBOL} {BUY/SELL}",
  "confidence": "0-100",
  "discord_message": "...",
  "stop_loss": 1234.56,  // ADD THIS
  "take_profit": 1235.00, // ADD THIS
  "entry_price": 1234.50  // ADD THIS (if known)
}
```

### Step 4: Set n8n Environment Variables

Make sure these are set in your n8n environment:

```bash
WEBHOOK_BASE_URL=https://task.oxyalgo.com/webhook
WEBHOOK_SECRET=d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa
USER_ID=d60f254c-b41a-49c2-9788-12975c94f085
```

### Step 5: Update Webhook to Include user_id

Your MT4 webhook should include `user_id` in the body:

**MT4 Webhook Body:**
```json
{
  "signal": "BUY",
  "symbol": "XAUUSD",
  "screenshot_url": "...",
  "user_id": "d60f254c-b41a-49c2-9788-12975c94f085"
}
```

Or set it as a default in the first Set node after the webhook.

## Complete Workflow Structure

```
Webhook (MT4 Signal)
  ↓
Set Node (Add user_id if missing)
  ↓
AI Agent
  ├─→ OpenAI Chat Model
  ├─→ Simple Memory
  └─→ Tools:
      ├─→ Call 'Analysis Model 1 New'
      ├─→ Open Trade (executes trade)
      └─→ Send Messages (Discord/Telegram)
  ↓
Extract Trade Data (Code Node)
  ↓
Switch Node (by decision)
  ├─→ APPROVED:
  │   ├─→ Create Trade (HTTP Request)
  │   └─→ Create Alert (HTTP Request)
  └─→ DECLINED:
      └─→ Create Alert (HTTP Request)
```

## Testing

1. **Test with MT4 Signal:**
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

2. **Check Dashboard:**
   - Go to `/dashboard/trades` - should see new trade
   - Go to `/dashboard/alerts` - should see alert

3. **Check n8n Execution Logs:**
   - Verify all nodes execute successfully
   - Check HTTP Request responses

## Troubleshooting

### Issue: "Open Trade" shows "GET: undefined"
**Fix:** Set the URL properly in the HTTP Request tool configuration

### Issue: Trade not appearing in dashboard
**Fix:** 
- Check `WEBHOOK_SECRET` matches
- Verify `user_id` is included in webhook body
- Check n8n execution logs for HTTP Request errors

### Issue: AI Agent doesn't return stop_loss/take_profit
**Fix:** Update AI Agent prompt to include these fields in JSON output

### Issue: user_id is missing
**Fix:** Add a Set node after webhook to inject `user_id` from environment variable

