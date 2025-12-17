# AI Trading Dashboard

A production-ready, real-time trading dashboard built with Next.js, Supabase, and Tailwind CSS.

## 🏗️ Architecture

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Supabase Realtime** for live updates

### Backend
- **Supabase** (PostgreSQL, Auth, Storage, Realtime)
- **Row Level Security (RLS)** for data isolation
- **Webhook API endpoints** for n8n integration

### Database Schema
- `accounts` - User account balances and bot status
- `trades` - Trading history with AI comments
- `screenshots` - Trade screenshots stored in Supabase Storage
- `signals` - Daily and weekly AI trading signals
- `alerts` - System alerts and notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account and project
- n8n instance (for webhook automation)

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
WEBHOOK_SECRET=your_webhook_secret_for_n8n
```

3. **Run database migrations:**
Execute the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

4. **Create Supabase Storage bucket:**
- Go to Storage in Supabase dashboard
- Create a bucket named `screenshots`
- Set it to public or configure RLS policies

5. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` and sign in.

## 📡 Webhook Integration

### Endpoints

All webhooks require authentication via `Authorization: Bearer {WEBHOOK_SECRET}` header.

#### 1. Trade Webhook
**POST** `/api/webhooks/trade`

```json
{
  "user_id": "uuid",
  "account_id": "uuid (optional)",
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "exit_price": 1.08600,
  "lot_size": 0.01,
  "profit": 10.50,
  "status": "CLOSED",
  "ai_comment": "Strong bullish momentum detected",
  "opened_at": "2024-01-01T10:00:00Z",
  "closed_at": "2024-01-01T12:00:00Z",
  "trade_id": "uuid (optional, for updates)"
}
```

#### 2. Account Webhook
**POST** `/api/webhooks/account`

```json
{
  "user_id": "uuid",
  "balance": 10000.00,
  "equity": 10050.00,
  "bot_status": true
}
```

#### 3. Signal Webhook
**POST** `/api/webhooks/signal`

```json
{
  "user_id": "uuid",
  "symbol": "EURUSD",
  "direction": "BUY",
  "entry_price": 1.08500,
  "take_profit": 1.09000,
  "stop_loss": 1.08000,
  "confidence_score": 85.5,
  "notes": "Strong support level identified",
  "signal_type": "DAILY",
  "expires_at": "2024-01-02T00:00:00Z"
}
```

#### 4. Alert Webhook
**POST** `/api/webhooks/alert`

```json
{
  "user_id": "uuid",
  "title": "Trade Executed",
  "message": "EURUSD BUY order filled at 1.08500",
  "alert_type": "SUCCESS"
}
```

#### 5. Screenshot Webhook
**POST** `/api/webhooks/screenshot`

```json
{
  "trade_id": "uuid",
  "storage_path": "trade_id/timestamp.png",
  "image_url": "https://discord.com/...",
  "image_data": "base64_encoded_image (optional)"
}
```

### n8n Workflow Example

1. **MT4/MT5 EA** → Sends trade data to Discord
2. **Discord Bot** → Captures screenshot and trade info
3. **n8n Workflow** → Processes Discord webhook
4. **n8n HTTP Request** → POSTs to `/api/webhooks/trade` with auth header
5. **n8n Image Download** → Downloads screenshot from Discord
6. **n8n HTTP Request** → POSTs to `/api/webhooks/screenshot` with image

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Webhook endpoints protected with secret token
- Supabase Auth handles session management
- Service role key only used server-side

## 📊 Features

### Dashboard
- Real-time balance and equity
- Win rate calculation
- Open trades count
- Equity/Balance charts
- Profit charts
- Bot status indicator

### Trades Page
- Filter by status (All/Open/Closed)
- Screenshot thumbnails with modal view
- AI comments display
- Sortable table with profit/loss

### Signals Page
- Daily and weekly signals
- Confidence scores
- Entry/TP/SL levels
- Filter by signal type

### Alerts Page
- Real-time alert notifications
- Seen/Unseen toggle
- Alert type filtering
- Mark all as read

### Settings Page
- Account information
- Bot status (read-only)
- Notification preferences
- Account statistics

## 🚢 Deployment

### Vercel

1. **Connect repository** to Vercel
2. **Add environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBHOOK_SECRET`

3. **Deploy:**
```bash
vercel --prod
```

### Environment Variables Checklist
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- [ ] `WEBHOOK_SECRET` - Secret token for webhook authentication

## 🧪 Testing Checklist

- [ ] User authentication (email/password and magic link)
- [ ] Dashboard loads with real-time data
- [ ] Trades page displays all trades
- [ ] Screenshot modal opens and displays images
- [ ] Signals page shows AI signals
- [ ] Alerts page updates in real-time
- [ ] Settings page displays account info
- [ ] Webhook endpoints accept valid requests
- [ ] RLS policies prevent cross-user data access
- [ ] Realtime subscriptions work correctly

## 📝 Database Migrations

All migrations are in `supabase/migrations/`. Run them in order:

1. `001_initial_schema.sql` - Creates all tables, indexes, RLS policies

## 🔧 Troubleshooting

### Realtime not working
- Check Supabase Realtime is enabled in project settings
- Verify RLS policies allow SELECT operations
- Check browser console for connection errors

### Screenshots not loading
- Verify `screenshots` bucket exists in Supabase Storage
- Check bucket is public or RLS policies allow access
- Verify storage paths are correct in database

### Webhooks failing
- Check `WEBHOOK_SECRET` matches in n8n and environment
- Verify `Authorization` header is set correctly
- Check Supabase service role key is valid
- Review server logs for detailed error messages

## 📄 License

Proprietary - All rights reserved


