#!/bin/bash

# Test n8n Webhook Endpoints
# Use this to test your webhooks before setting up n8n

USER_ID="d60f254c-b41a-49c2-9788-12975c94f085"
WEBHOOK_SECRET="d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa"
BASE_URL="http://localhost:3000"

echo "=== Testing n8n Webhook Endpoints ==="
echo ""

echo "1. Testing Account Update..."
curl -X POST ${BASE_URL}/api/webhooks/account \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"balance\": 10000.00,
    \"equity\": 10050.00,
    \"bot_status\": true
  }" | jq '.'

echo ""
echo "2. Testing Trade Creation..."
curl -X POST ${BASE_URL}/api/webhooks/trade \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"symbol\": \"EURUSD\",
    \"direction\": \"BUY\",
    \"entry_price\": 1.08500,
    \"lot_size\": 0.01,
    \"status\": \"OPEN\",
    \"profit\": 0,
    \"ai_comment\": \"Test trade from script\"
  }" | jq '.'

echo ""
echo "3. Testing Signal Creation..."
curl -X POST ${BASE_URL}/api/webhooks/signal \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"symbol\": \"EURUSD\",
    \"direction\": \"BUY\",
    \"entry_price\": 1.08500,
    \"take_profit\": 1.09000,
    \"stop_loss\": 1.08000,
    \"confidence_score\": 85.5,
    \"notes\": \"Test signal from script\",
    \"signal_type\": \"DAILY\"
  }" | jq '.'

echo ""
echo "4. Testing Alert Creation..."
curl -X POST ${BASE_URL}/api/webhooks/alert \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"title\": \"Test Alert\",
    \"message\": \"This is a test alert from the script\",
    \"alert_type\": \"SUCCESS\"
  }" | jq '.'

echo ""
echo "=== Tests Complete ==="
echo "Check your dashboard to see the updates!"


