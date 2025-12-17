# Complete User Guide - AI Trading Dashboard

This guide walks you through setting up and using the entire system from start to finish.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Creating Your First User](#creating-your-first-user)
3. [Using the Dashboard](#using-the-dashboard)
4. [Setting Up Webhooks (n8n Integration)](#setting-up-webhooks-n8n-integration)
5. [Testing the System](#testing-the-system)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Step 1: Install Dependencies

```bash
cd /Users/nikeshpyakurel/Documents/SupaBase
npm install
```

### Step 2: Configure Environment

Your `.env` file should already be set up. Verify it contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://icrpihjhujopqicoktgw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WEBHOOK_SECRET=your_webhook_secret
```

### Step 3: Set Up Database

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run the migration:**
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy all SQL
   - Paste into Supabase SQL Editor
   - Click "Run"

3. **Enable Realtime:**
   - Run `supabase/migrations/002_enable_realtime.sql` in SQL Editor
   - Or use Database → Replication and toggle tables ON

4. **Create Storage Bucket:**
   - Go to Storage → Create Bucket
   - Name: `screenshots`
   - Make it Public

### Step 4: Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 👤 Creating Your First User

### Option 1: Sign Up (Recommended)

1. Go to http://localhost:3000/signup
2. Enter:
   - Email: `your-email@example.com`
   - Password: `password123` (min 6 characters)
   - Confirm Password: `password123`
3. Click "Create Account"
4. If email confirmation is enabled, check your email and click the link
5. You'll be redirected to the dashboard

### Option 2: Magic Link Login

1. Go to http://localhost:3000/login
2. Enter your email
3. Click "Send Magic Link"
4. Check your email and click the link
5. You'll be signed in automatically

### Get Your User ID

You'll need your User ID for webhook testing:

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user
3. Copy the UUID (it looks like: `550e8400-e29b-41d4-a716-446655440000`)

---

## 📊 Using the Dashboard

### Main Dashboard (`/dashboard`)

**What you'll see:**
- **Balance** - Current account balance
- **Equity** - Current account equity
- **Win Rate** - Percentage of winning trades
- **Open Trades** - Number of currently open trades
- **Equity & Balance Chart** - Real-time chart showing balance/equity over time
- **Profit Chart** - Daily profit visualization
- **Bot Status** - ON/OFF indicator
- **Trade Summary** - Total trades, wins, losses, total profit

**How it works:**
- Updates automatically when data changes (via webhooks)
- No page refresh needed
- Real-time charts update as new data arrives

### Trades Page (`/trades`)

**Features:**
- View all trades (Open, Closed, or All)
- Filter by status using buttons at top
- See trade details:
  - Symbol (e.g., EURUSD)
  - Direction (BUY/SELL)
  - Entry/Exit prices
  - Profit/Loss
  - Status
  - Screenshots (click "View" to see full image)
  - Opening date/time

**Screenshots:**
- Click "View" next to any trade with a screenshot
- Modal opens showing full-size image
- Images loaded from Supabase Storage

**AI Comments:**
- If trades have AI comments, they appear at the bottom
- Shows analysis and insights for each trade

### Signals Page (`/signals`)

**Features:**
- View AI trading signals
- Filter by type: All, Daily, or Weekly
- Each signal shows:
  - Symbol and direction
  - Entry price
  - Take Profit (TP)
  - Stop Loss (SL)
  - Confidence score (color-coded)
  - Notes/commentary
  - Creation date and expiration

**Color Coding:**
- **Green** - High confidence (80%+)
- **Yellow** - Medium confidence (60-79%)
- **Red** - Low confidence (<60%)

### Alerts Page (`/alerts`)

**Features:**
- View all system alerts
- See unread count at top
- Mark alerts as read/unread
- "Mark All as Read" button
- Filter by alert type:
  - INFO (blue)
  - SUCCESS (green)
  - WARNING (yellow)
  - ERROR (red)

**Real-time Updates:**
- New alerts appear automatically
- No page refresh needed
- Unread count updates instantly

### Settings Page (`/settings`)

**Account Information:**
- View your email
- See your User ID
- Account creation date

**Trading Bot Status:**
- See if bot is ON or OFF
- Read-only (controlled via webhooks)

**Notification Preferences:**
- Toggle email notifications
- Toggle in-app alerts
- Save preferences

**Account Statistics:**
- Current balance
- Current equity
- Account ID

---

## 🔗 Setting Up Webhooks (n8n Integration)

### Prerequisites

- n8n instance running
- Your webhook secret from `.env` file
- Your User ID from Supabase

### Basic n8n Workflow Setup

#### 1. Create Trade Webhook Workflow

**Trigger:** Discord Webhook (or MT4/MT5 EA)

**Steps:**
1. **Webhook Trigger** - Receives trade data
2. **Extract Data** - Parse JSON payload
3. **HTTP Request** - POST to your webhook endpoint

**HTTP Request Configuration:**
- Method: `POST`
- URL: `http://localhost:3000/api/webhooks/trade` (or your production URL)
- Authentication: Header
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_WEBHOOK_SECRET`
- Body: JSON
- JSON Body:
```json
{
  "user_id": "{{$json.user_id}}",
  "symbol": "{{$json.symbol}}",
  "direction": "{{$json.direction}}",
  "entry_price": {{$json.entry_price}},
  "status": "{{$json.status}}",
  "profit": {{$json.profit}},
  "ai_comment": "{{$json.ai_comment}}"
}
```

#### 2. Create Account Update Workflow

**HTTP Request Configuration:**
- URL: `http://localhost:3000/api/webhooks/account`
- Same authentication as above
- Body:
```json
{
  "user_id": "YOUR_USER_ID",
  "balance": 10000.00,
  "equity": 10050.00,
  "bot_status": true
}
```

#### 3. Create Signal Workflow

**HTTP Request Configuration:**
- URL: `http://localhost:3000/api/webhooks/signal`
- Body:
```json
{
  "user_id": "YOUR_USER_ID",
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

#### 4. Create Alert Workflow

**HTTP Request Configuration:**
- URL: `http://localhost:3000/api/webhooks/alert`
- Body:
```json
{
  "user_id": "YOUR_USER_ID",
  "title": "Trade Executed",
  "message": "EURUSD BUY order filled at 1.08500",
  "alert_type": "SUCCESS"
}
```

#### 5. Create Screenshot Workflow

**Steps:**
1. Receive Discord message with image
2. Extract image URL from Discord attachment
3. HTTP Request to screenshot webhook

**HTTP Request Configuration:**
- URL: `http://localhost:3000/api/webhooks/screenshot`
- Body:
```json
{
  "trade_id": "TRADE_UUID",
  "image_url": "https://cdn.discordapp.com/attachments/..."
}
```

### Complete Example: Trade + Screenshot Flow

```
Discord Webhook
    ↓
n8n Workflow Trigger
    ↓
Extract Trade Data
    ↓
HTTP Request → /api/webhooks/trade
    ↓
Extract Screenshot URL
    ↓
HTTP Request → /api/webhooks/screenshot
    ↓
HTTP Request → /api/webhooks/alert (notify user)
```

---

## 🧪 Testing the System

### Test 1: Manual Account Update

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/webhooks/account \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "balance": 10000.00,
    "equity": 10050.00,
    "bot_status": true
  }'
```

**Expected Result:**
- Dashboard updates immediately
- Balance shows $10,000.00
- Equity shows $10,050.00
- Bot status shows "ON"

### Test 2: Create a Trade

```bash
curl -X POST http://localhost:3000/api/webhooks/trade \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "lot_size": 0.01,
    "status": "OPEN",
    "profit": 0,
    "ai_comment": "Test trade - bullish momentum detected"
  }'
```

**Expected Result:**
- Trade appears in Trades page
- Dashboard shows 1 open trade
- Trade visible in real-time (no refresh needed)

### Test 3: Close a Trade

First, get the trade ID from Supabase or the Trades page, then:

```bash
curl -X POST http://localhost:3000/api/webhooks/trade \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "trade_id": "TRADE_UUID_HERE",
    "status": "CLOSED",
    "exit_price": 1.08600,
    "profit": 10.50
  }'
```

**Expected Result:**
- Trade status changes to "CLOSED"
- Profit shows $10.50
- Win rate updates
- Dashboard charts update

### Test 4: Create a Signal

```bash
curl -X POST http://localhost:3000/api/webhooks/signal \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "take_profit": 1.09000,
    "stop_loss": 1.08000,
    "confidence_score": 85.5,
    "notes": "Strong support level at 1.08500",
    "signal_type": "DAILY"
  }'
```

**Expected Result:**
- Signal appears on Signals page
- Shows confidence score in green (85.5%)
- All levels displayed correctly

### Test 5: Create an Alert

```bash
curl -X POST http://localhost:3000/api/webhooks/alert \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "title": "Trade Executed",
    "message": "EURUSD BUY order filled successfully",
    "alert_type": "SUCCESS"
  }'
```

**Expected Result:**
- Alert appears on Alerts page
- Shows "New" badge
- Unread count increases
- Alert appears in real-time

### Test 6: Real-time Updates

1. Open dashboard in **two browser tabs**
2. Make a webhook call (update account, create trade, etc.)
3. **Watch both tabs update simultaneously** - no refresh needed!

---

## 🔄 Common Workflows

### Workflow 1: Daily Trading Session

1. **Morning:** AI generates signals → Webhook creates signals → User sees on Signals page
2. **During Day:** 
   - Trades open → Webhook creates trades → Appears in Trades page
   - Account updates → Webhook updates balance/equity → Dashboard updates
   - Screenshots captured → Webhook uploads → Visible in Trades page
3. **Evening:** 
   - Trades close → Webhook updates trades → Win rate recalculates
   - Daily summary → Alert created → User notified

### Workflow 2: MT4/MT5 EA Integration

1. **EA detects trade:**
   - Sends data to Discord or n8n webhook
2. **n8n processes:**
   - Extracts trade data
   - Calls `/api/webhooks/trade`
   - Downloads screenshot from Discord
   - Calls `/api/webhooks/screenshot`
   - Creates alert notification
3. **User sees:**
   - Trade appears in Trades page
   - Screenshot available
   - Alert notification
   - All in real-time!

### Workflow 3: Account Monitoring

1. **EA sends periodic updates:**
   - Balance changes
   - Equity changes
   - Bot status changes
2. **n8n calls `/api/webhooks/account`**
3. **Dashboard updates:**
   - Charts update automatically
   - Metrics refresh
   - No user action needed

---

## 🐛 Troubleshooting

### Dashboard shows "Loading..." forever

**Check:**
- Supabase connection (check browser console)
- User is logged in
- RLS policies allow SELECT
- Realtime is enabled

**Fix:**
- Refresh page
- Check Supabase project status
- Verify environment variables

### Webhooks return 401 Unauthorized

**Check:**
- `WEBHOOK_SECRET` matches in `.env` and request header
- Header format: `Authorization: Bearer {secret}`
- No extra spaces in secret

**Fix:**
- Verify secret in `.env` file
- Check n8n webhook configuration
- Test with cURL first

### Trades/Signals not appearing

**Check:**
- Webhook called successfully (check response)
- `user_id` is correct
- RLS policies allow INSERT
- Realtime is enabled

**Fix:**
- Check Supabase logs
- Verify user_id matches logged-in user
- Test with cURL to see error messages

### Screenshots not loading

**Check:**
- `screenshots` bucket exists
- Bucket is public or has RLS policies
- Storage path is correct
- Image uploaded successfully

**Fix:**
- Verify bucket in Supabase Storage
- Check storage path in database
- Test image URL directly

### Real-time updates not working

**Check:**
- Realtime enabled for tables
- Browser console for WebSocket errors
- Network tab for connection issues
- RLS policies allow SELECT

**Fix:**
- Re-enable Realtime in Supabase
- Check browser console
- Refresh page
- Verify RLS policies

---

## 📱 Quick Reference

### URLs

- **Dashboard:** http://localhost:3000/dashboard
- **Trades:** http://localhost:3000/trades
- **Signals:** http://localhost:3000/signals
- **Alerts:** http://localhost:3000/alerts
- **Settings:** http://localhost:3000/settings
- **Login:** http://localhost:3000/login
- **Signup:** http://localhost:3000/signup

### Webhook Endpoints

- **Trade:** `/api/webhooks/trade`
- **Account:** `/api/webhooks/account`
- **Signal:** `/api/webhooks/signal`
- **Alert:** `/api/webhooks/alert`
- **Screenshot:** `/api/webhooks/screenshot`

### Required Headers

```
Authorization: Bearer YOUR_WEBHOOK_SECRET
Content-Type: application/json
```

---

## 🎯 Next Steps

1. ✅ Complete initial setup
2. ✅ Create your user account
3. ✅ Test webhooks with cURL
4. ✅ Set up n8n workflows
5. ✅ Connect MT4/MT5 EA
6. ✅ Start receiving real-time data!

For detailed API documentation, see `WEBHOOK_CONTRACTS.md`
For deployment instructions, see `DEPLOYMENT.md`
For architecture details, see `ARCHITECTURE.md`

Happy trading! 🚀

