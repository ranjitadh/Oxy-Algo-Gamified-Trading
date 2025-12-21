# Fix: "Open Trade" Tool Shows "GET: undefined"

## Problem
The "Open Trade" HTTP Request tool in your AI Agent shows "GET: undefined" instead of a proper URL.

## Root Cause
The URL field in the HTTP Request tool is not properly configured. The AI Agent needs a template URL that it can populate with parameters.

## Solution

### Option 1: Configure URL in HTTP Request Tool (Recommended)

1. **Edit the "Open Trade" tool node** in your AI Agent workflow
2. **Set the URL field** to:
   ```
   https://server.oxyalgo.com/orders-api-v1/orders-api.php
   ```
3. **Enable "Send Query Parameters"** toggle
4. **Add Query Parameters:**
   - `api_key` = `fAvjpL0WAJTfzeE1a`
   - `action` = `{{action}}` (AI will populate)
   - `symbol` = `{{symbol}}` (AI will populate)
   - `volume` = `0.1` (or `{{volume}}` if AI sets it)
   - `sl` = `{{stop_loss}}` (AI will populate)
   - `tp` = `{{take_profit}}` (AI will populate)

5. **Method:** Keep as GET

### Option 2: Use Full URL Template (Alternative)

If Option 1 doesn't work, set the URL field directly to:
```
https://server.oxyalgo.com/orders-api-v1/orders-api.php?api_key=fAvjpL0WAJTfzeE1a&action={{action}}&symbol={{symbol}}&volume=0.1&sl={{stop_loss}}&tp={{take_profit}}
```

**Note:** The AI Agent will replace `{{action}}`, `{{symbol}}`, `{{stop_loss}}`, and `{{take_profit}}` with actual values when executing.

### Option 3: Use Function Node to Build URL (If AI Agent doesn't support templates)

If the AI Agent can't use URL templates, you'll need to:

1. **Remove the "Open Trade" tool** from AI Agent
2. **Add a Function node** after AI Agent that builds the URL:
   ```javascript
   const action = $json.decision === 'APPROVED' ? $json.direction : null;
   const symbol = $json.symbol;
   const stopLoss = $json.stop_loss;
   const takeProfit = $json.take_profit;
   
   if (!action || !symbol) {
     return [{ json: { error: 'Missing required fields' } }];
   }
   
   const url = `https://server.oxyalgo.com/orders-api-v1/orders-api.php?api_key=fAvjpL0WAJTfzeE1a&action=${action}&symbol=${symbol}&volume=0.1&sl=${stopLoss}&tp=${takeProfit}`;
   
   return [{ json: { execution_url: url, ...$json } }];
   ```

3. **Add HTTP Request node** after Function node:
   - **Method:** GET
   - **URL:** `{{$json.execution_url}}`

## Verify Fix

After fixing, test the workflow:

1. **Send a test signal** from MT4
2. **Check AI Agent execution** - it should call "Open Trade" tool
3. **Check the execution URL** - should show the full URL with parameters
4. **Check trade execution response** - should return success/error from your broker API

## Important Notes

- The AI Agent's "Open Trade" tool executes the trade **before** you post to the dashboard
- You need to capture the execution response to get the actual `entry_price`
- If execution fails, don't post to dashboard (or post with status "PENDING")

## Next Step

After fixing "Open Trade", follow `QUICK_FIX_TRADING_BOT.md` to add nodes that post trade data to the dashboard.

