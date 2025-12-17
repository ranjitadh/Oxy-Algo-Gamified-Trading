#!/bin/bash

# Test MT4 Webhook Format
# Simulates what your MT4 bot sends to n8n

WEBHOOK_URL="http://localhost:3000/api/webhooks/trade"
WEBHOOK_SECRET="d4c63defd9d3a1b2ac42378b816b680058cf3ba4e904811e6cf2ea104eb213aa"
USER_ID="d60f254c-b41a-49c2-9788-12975c94f085"

echo "=== Testing MT4 Webhook Format ==="
echo ""

echo "Test 1: BUY Signal for XAUUSD..."
curl -X POST ${WEBHOOK_URL} \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"symbol\": \"XAUUSD\",
    \"direction\": \"BUY\",
    \"entry_price\": 2650.50,
    \"lot_size\": 0.01,
    \"status\": \"OPEN\",
    \"profit\": 0,
    \"ai_comment\": \"MT4 Alert: BUY signal for XAUUSD\"
  }" | jq '.'

echo ""
echo "Test 2: SELL Signal for EURUSD..."
curl -X POST ${WEBHOOK_URL} \
  -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"${USER_ID}\",
    \"symbol\": \"EURUSD\",
    \"direction\": \"SELL\",
    \"entry_price\": 1.08500,
    \"lot_size\": 0.01,
    \"status\": \"OPEN\",
    \"profit\": 0,
    \"ai_comment\": \"MT4 Alert: SELL signal for EURUSD\"
  }" | jq '.'

echo ""
echo "=== Tests Complete ==="
echo "Check your dashboard to see the trades!"

