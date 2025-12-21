#!/bin/bash

# Test Login and Account Setup
# User ID: d60f254c-b41a-49c2-9788-12975c94f085
# Email: nikeshpyakurel32@gmail.com

USER_ID="d60f254c-b41a-49c2-9788-12975c94f085"
EMAIL="nikeshpyakurel32@gmail.com"

echo "=== Testing Account Setup ==="
echo "User ID: $USER_ID"
echo "Email: $EMAIL"
echo ""

# Read webhook secret from .env
if [ -f .env ]; then
    WEBHOOK_SECRET=$(grep WEBHOOK_SECRET .env | cut -d '=' -f2)
    echo "Webhook Secret found: ${WEBHOOK_SECRET:0:20}..."
else
    echo "ERROR: .env file not found"
    exit 1
fi

echo ""
echo "=== Test 1: Create/Update Account ==="
curl -X POST http://localhost:3000/api/webhooks/account \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"balance\": 10000.00,
    \"equity\": 10050.00,
    \"bot_status\": true
  }" | jq '.'

echo ""
echo "=== Test 2: Create a Test Trade ==="
curl -X POST http://localhost:3000/api/webhooks/trade \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"symbol\": \"EURUSD\",
    \"direction\": \"BUY\",
    \"entry_price\": 1.08500,
    \"lot_size\": 0.01,
    \"status\": \"OPEN\",
    \"profit\": 0,
    \"ai_comment\": \"Test trade - Account verified\"
  }" | jq '.'

echo ""
echo "=== Test 3: Create a Test Signal ==="
curl -X POST http://localhost:3000/api/webhooks/signal \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"symbol\": \"EURUSD\",
    \"direction\": \"BUY\",
    \"entry_price\": 1.08500,
    \"take_profit\": 1.09000,
    \"stop_loss\": 1.08000,
    \"confidence_score\": 85.5,
    \"notes\": \"Welcome to AI Trading Dashboard!\",
    \"signal_type\": \"DAILY\"
  }" | jq '.'

echo ""
echo "=== Test 4: Create a Welcome Alert ==="
curl -X POST http://localhost:3000/api/webhooks/alert \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"title\": \"Welcome!\",
    \"message\": \"Your account is set up and ready. Start trading!\",
    \"alert_type\": \"SUCCESS\"
  }" | jq '.'

echo ""
echo "=== Tests Complete ==="
echo "Now login at http://localhost:3000/login"
echo "Email: $EMAIL"
echo "You should see your account data on the dashboard!"



