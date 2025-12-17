# Getting Started - Quick Checklist

Follow these steps to get your AI Trading Dashboard up and running.

## ✅ Setup Checklist

### 1. Install & Configure (5 minutes)

- [ ] Run `npm install`
- [ ] Verify `.env` file has all credentials
- [ ] Start dev server: `npm run dev`
- [ ] Visit http://localhost:3000

### 2. Database Setup (5 minutes)

- [ ] Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor
- [ ] Run `supabase/migrations/002_enable_realtime.sql` in Supabase SQL Editor
- [ ] Create `screenshots` bucket in Supabase Storage (make it public)
- [ ] Verify tables exist: `accounts`, `trades`, `signals`, `alerts`, `screenshots`

### 3. Create Your Account (2 minutes)

- [ ] Go to http://localhost:3000/signup
- [ ] Enter email and password
- [ ] Complete signup
- [ ] Get your User ID from Supabase Dashboard → Authentication → Users

### 4. Test the System (10 minutes)

- [ ] Test account update webhook (see USER_GUIDE.md)
- [ ] Test trade creation webhook
- [ ] Test signal creation webhook
- [ ] Test alert creation webhook
- [ ] Verify real-time updates work (open 2 browser tabs)

### 5. Set Up n8n (Optional - 15 minutes)

- [ ] Create n8n workflow for trades
- [ ] Create n8n workflow for account updates
- [ ] Create n8n workflow for signals
- [ ] Create n8n workflow for alerts
- [ ] Test workflows with sample data

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test webhook (replace YOUR_USER_ID and YOUR_WEBHOOK_SECRET)
curl -X POST http://localhost:3000/api/webhooks/account \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"YOUR_USER_ID","balance":10000,"equity":10050,"bot_status":true}'
```

## 📚 Documentation

- **USER_GUIDE.md** - Complete usage guide (start here!)
- **QUICKSTART.md** - 10-minute setup guide
- **WEBHOOK_CONTRACTS.md** - API documentation
- **DEPLOYMENT.md** - Production deployment
- **ARCHITECTURE.md** - System design

## 🎯 What to Do Next

1. **Read USER_GUIDE.md** for detailed instructions
2. **Test webhooks** using the examples
3. **Set up n8n workflows** to automate data flow
4. **Connect your MT4/MT5 EA** to start receiving real data
5. **Deploy to production** when ready (see DEPLOYMENT.md)

## 💡 Pro Tips

- Keep your `WEBHOOK_SECRET` secure
- Test everything locally before deploying
- Use Supabase dashboard to verify data
- Check browser console for errors
- Enable email confirmation for production

## 🆘 Need Help?

- Check **USER_GUIDE.md** for detailed instructions
- Review **Troubleshooting** section in USER_GUIDE.md
- Check Supabase logs for errors
- Verify environment variables are correct
- Test webhooks with cURL first

---

**Ready to start?** Open `USER_GUIDE.md` for the complete walkthrough! 🚀


