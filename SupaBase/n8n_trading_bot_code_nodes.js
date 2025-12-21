// ============================================
// NODE 1: Extract Trade Data from AI Agent
// ============================================
// Type: Code Node
// Mode: Run Once for All Items
// Position: After AI Agent, before Switch Node

const items = $input.all();

// Find AI Agent output (contains decision, heading, confidence, discord_message)
const aiOutput = items.find(item => 
  item.json.decision || item.json.heading || item.json.discord_message
);

// Find original webhook input (contains symbol, signal, screenshot_url)
const webhookInput = items.find(item => 
  item.json.body && (item.json.body.symbol || item.json.body.signal)
);

if (!aiOutput) {
  return [{ json: { error: 'AI Agent output not found', decision: 'DECLINED' } }];
}

if (!webhookInput) {
  return [{ json: { error: 'Webhook input not found', decision: 'DECLINED' } }];
}

const decision = aiOutput.json.decision || 'DECLINED';
const heading = aiOutput.json.heading || '';
const confidence = parseFloat(aiOutput.json.confidence || 0);
const discordMessage = aiOutput.json.discord_message || '';

// Extract symbol and direction from heading (e.g., "XAUUSD BUY" or "BTCUSD SELL")
let symbol = webhookInput.json.body.symbol || '';
let direction = webhookInput.json.body.signal || '';

if (heading) {
  const headingParts = heading.trim().split(/\s+/);
  if (headingParts.length >= 2) {
    symbol = headingParts[0];
    direction = headingParts[1].toUpperCase();
  } else if (headingParts.length === 1) {
    symbol = headingParts[0];
  }
}

// Ensure direction is BUY or SELL
direction = direction.toUpperCase();
if (direction !== 'BUY' && direction !== 'SELL') {
  direction = webhookInput.json.body.signal?.toUpperCase() || 'BUY';
}

// Get user_id (from webhook body or environment variable)
const userId = webhookInput.json.body.user_id || $env.USER_ID || '';

// Extract SL/TP from AI output if available (AI Agent may include these)
const stopLoss = aiOutput.json.stop_loss || aiOutput.json.stopLoss || null;
const takeProfit = aiOutput.json.take_profit || aiOutput.json.takeProfit || null;

// Get entry price (from webhook or default to 0 - will need to be updated)
const entryPrice = parseFloat(webhookInput.json.body.entry_price) || 0;

// Get screenshot URL
const screenshotUrl = webhookInput.json.body.screenshot_url || null;

// Build AI comment
const aiComment = discordMessage || 
  `AI Decision: ${decision}, Confidence: ${confidence}%` +
  (stopLoss ? `, SL: ${stopLoss}` : '') +
  (takeProfit ? `, TP: ${takeProfit}` : '');

return [{
  json: {
    decision,
    symbol,
    direction,
    entry_price: entryPrice,
    stop_loss: stopLoss,
    take_profit: takeProfit,
    lot_size: 0.1, // Default lot size
    user_id: userId,
    ai_comment: aiComment,
    confidence_score: confidence,
    screenshot_url: screenshotUrl,
    heading,
    discord_message: discordMessage,
  }
}];


// ============================================
// NODE 2: Parse Trade Execution Response
// ============================================
// Type: Code Node (Optional - if you need to parse Open Trade tool response)
// Mode: Run Once for All Items
// Position: After Open Trade tool execution (if you can capture its response)

// This node would parse the response from the trade execution API
// Example response structure (adjust based on your actual API):
/*
const executionResponse = $input.first().json;

// Parse the execution response to extract:
// - Order ID
// - Entry price (actual filled price)
// - Execution status
// - Any error messages

const orderId = executionResponse.order_id || executionResponse.id || null;
const filledPrice = parseFloat(executionResponse.price || executionResponse.entry_price || 0);
const executionStatus = executionResponse.status || executionResponse.result || 'UNKNOWN';

return [{
  json: {
    order_id: orderId,
    entry_price: filledPrice,
    execution_status: executionStatus,
    execution_response: executionResponse,
  }
}];
*/


// ============================================
// NODE 3: Merge Trade Data with Execution
// ============================================
// Type: Code Node (Optional - if you have execution response)
// Mode: Run Once for All Items
// Position: After both Extract Trade Data and Parse Execution Response

// Merge trade data with execution response
/*
const tradeData = $input.all().find(item => item.json.symbol);
const executionData = $input.all().find(item => item.json.order_id);

if (!tradeData) {
  return $input.all();
}

const merged = {
  ...tradeData.json,
};

if (executionData) {
  // Update entry_price with actual filled price
  if (executionData.json.entry_price > 0) {
    merged.entry_price = executionData.json.entry_price;
  }
  
  // Add order_id to ai_comment
  if (executionData.json.order_id) {
    merged.ai_comment += ` | Order ID: ${executionData.json.order_id}`;
  }
}

return [{ json: merged }];
*/

