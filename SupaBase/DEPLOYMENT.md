# Deployment Guide

## Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] Create Supabase project
- [ ] Run database migrations (`supabase/migrations/001_initial_schema.sql`)
- [ ] Create `screenshots` storage bucket
- [ ] Configure bucket as public or set RLS policies
- [ ] Enable Realtime for all tables
- [ ] Note down project URL and API keys

### 2. Environment Variables
Create `.env.local` for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WEBHOOK_SECRET=your_secure_random_string
```

### 3. n8n Configuration
- [ ] Set up n8n workflows to call webhook endpoints
- [ ] Configure webhook authentication header: `Authorization: Bearer {WEBHOOK_SECRET}`
- [ ] Test webhook endpoints with sample data

## Vercel Deployment

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time) or **Yes** (updates)
- Project name? `ai-trading-dashboard`
- Directory? `./`
- Override settings? **No**

### Step 4: Add Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WEBHOOK_SECRET`

### Step 5: Redeploy
After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```

Or redeploy from Vercel dashboard.

## Post-Deployment

### 1. Update n8n Webhook URLs
Update your n8n workflows to use production URLs:
- `https://your-app.vercel.app/api/webhooks/trade`
- `https://your-app.vercel.app/api/webhooks/account`
- `https://your-app.vercel.app/api/webhooks/signal`
- `https://your-app.vercel.app/api/webhooks/alert`
- `https://your-app.vercel.app/api/webhooks/screenshot`

### 2. Test Authentication
- Visit your deployed app
- Test email/password login
- Test magic link login
- Verify redirects work correctly

### 3. Test Webhooks
Use curl or Postman to test webhook endpoints:

```bash
curl -X POST https://your-app.vercel.app/api/webhooks/trade \
  -H "Authorization: Bearer your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-uuid",
    "symbol": "EURUSD",
    "direction": "BUY",
    "entry_price": 1.08500,
    "status": "OPEN"
  }'
```

### 4. Verify Realtime
- Open dashboard in multiple browser tabs
- Trigger a webhook update
- Verify all tabs update in real-time

### 5. Test Screenshot Upload
- Upload a test screenshot via webhook
- Verify it appears in Supabase Storage
- Check it displays correctly in the Trades page

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and errors

### Supabase Monitoring
- Check Supabase dashboard for:
  - Database query performance
  - Realtime connection status
  - Storage usage
  - API usage limits

### Error Tracking
Consider adding error tracking:
- Sentry
- LogRocket
- Vercel Analytics

## Security Checklist

- [ ] `WEBHOOK_SECRET` is strong and unique
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed client-side
- [ ] RLS policies are enabled and tested
- [ ] Storage bucket has appropriate access controls
- [ ] Environment variables are set in Vercel (not in code)
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] CORS is configured if needed

## Troubleshooting

### Build Errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check TypeScript errors: `npm run build`

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Check Supabase connection
- Verify RLS policies allow operations

### Realtime Not Working
- Check Supabase Realtime is enabled
- Verify RLS policies allow SELECT
- Check browser console for errors
- Verify WebSocket connections in Network tab

### Webhooks Failing
- Verify `WEBHOOK_SECRET` matches
- Check Authorization header format
- Verify JSON payload structure
- Check Supabase service role key is valid
- Review Vercel function logs

## Rollback

If deployment fails:
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Production Best Practices

1. **Use Environment-Specific Secrets**
   - Different `WEBHOOK_SECRET` for dev/staging/prod
   - Rotate secrets periodically

2. **Monitor API Usage**
   - Set up Supabase usage alerts
   - Monitor Vercel function execution time
   - Track webhook call frequency

3. **Database Backups**
   - Enable Supabase daily backups
   - Test restore procedures

4. **Performance Optimization**
   - Enable Vercel Edge Caching where appropriate
   - Optimize database queries
   - Use Supabase connection pooling

5. **Scaling Considerations**
   - Monitor database connection limits
   - Consider read replicas for heavy read workloads
   - Implement rate limiting on webhooks if needed



