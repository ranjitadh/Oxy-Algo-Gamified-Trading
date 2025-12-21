# Quick Start Guide

Get your AI Trading Dashboard up and running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- n8n instance (optional, for webhook testing)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. **Create a new Supabase project** at https://supabase.com
2. **Run the database migration:**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and execute

3. **Create Storage Bucket:**
   - Go to Storage → Create Bucket
   - Name: `screenshots`
   - Make it public (or configure RLS policies)

4. **Enable Realtime:**
   - Go to Database → Replication
   - Enable replication for: `accounts`, `trades`, `signals`, `alerts`

5. **Get your credentials:**
   - Go to Settings → API
   - Copy: Project URL, anon key, service_role key

## Step 3: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WEBHOOK_SECRET=your-random-secret-string-here
```

Generate a secure `WEBHOOK_SECRET`:
```bash
openssl rand -hex 32
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5: Create Your First User

1. Go to http://localhost:3000/login
2. Click "Send Magic Link"
3. Enter your email
4. Check email and click magic link
5. You'll be redirected to dashboard

## Step 6: Test Webhooks (Optional)

Use curl to test webhook endpoints:

```bash
# Test account update
curl -X POST http://localhost:3000/api/webhooks/account \
  -H "Authorization: Bearer your-random-secret-string-here" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_FROM_SUPABASE",
    "balance": 10000.00,
    "equity": 10050.00,
    "bot_status": true
  }'
```

Get your user ID:
1. Go to Supabase Dashboard → Authentication → Users
2. Copy the UUID of your user

## Step 7: Test Realtime Updates

1. Open dashboard in two browser tabs
2. Call the account webhook (from Step 6)
3. Watch both tabs update in real-time!

## Common Issues

### "Cannot find module" errors
Run `npm install` again. Make sure you're in the project directory.

### Realtime not working
- Check Realtime is enabled in Supabase
- Verify RLS policies allow SELECT
- Check browser console for errors

### Webhooks returning 401
- Verify `WEBHOOK_SECRET` matches in `.env.local` and your request header
- Check Authorization header format: `Bearer {secret}`

### Screenshots not loading
- Verify `screenshots` bucket exists
- Check bucket is public or has proper RLS policies
- Verify storage paths in database match bucket structure

## Next Steps

1. **Set up n8n workflows** - See `WEBHOOK_CONTRACTS.md`
2. **Deploy to Vercel** - See `DEPLOYMENT.md`
3. **Customize UI** - Edit components in `app/` and `components/`
4. **Add features** - Extend database schema and add new pages

## Need Help?

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for system design
- See `WEBHOOK_CONTRACTS.md` for API details
- Check `DEPLOYMENT.md` for production setup

## Production Checklist

Before going live:

- [ ] Change `WEBHOOK_SECRET` to a strong random value
- [ ] Set up Supabase backups
- [ ] Configure custom domain in Vercel
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Test all webhook endpoints
- [ ] Verify RLS policies work correctly
- [ ] Test authentication flows
- [ ] Load test webhook endpoints
- [ ] Set up monitoring alerts
- [ ] Document your n8n workflows

Happy trading! 🚀



