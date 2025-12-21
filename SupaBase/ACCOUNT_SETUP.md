# Account Setup Verification

## Your Account Details

✅ **User ID:** `d60f254c-b41a-49c2-9788-12975c94f085`  
✅ **Email:** `nikeshpyakurel32@gmail.com`  
✅ **Status:** Confirmed and Active  
✅ **Last Sign In:** 2025-12-16 17:15:20  
✅ **Email Verified:** Yes  

## Next Steps

### 1. Verify Account Record Exists

Your user account exists in Supabase Auth, but you need an account record in the `accounts` table.

**Option A: Automatic (via webhook)**
Run the test script to create your account record:
```bash
./test_login.sh
```

**Option B: Manual (via Supabase Dashboard)**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
```sql
INSERT INTO accounts (user_id, balance, equity, bot_status)
VALUES (
  'd60f254c-b41a-49c2-9788-12975c94f085',
  0,
  0,
  false
)
ON CONFLICT (user_id) DO NOTHING;
```

### 2. Test Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: `nikeshpyakurel32@gmail.com`
   - Password: (your password)
3. Click "Sign in"
4. You should be redirected to `/dashboard`

### 3. Verify Dashboard Works

After login, you should see:
- Your account balance and equity
- Empty state (if no trades yet)
- Navigation menu working

### 4. Populate Test Data (Optional)

Run the test script to add sample data:
```bash
./test_login.sh
```

This will create:
- Account record with balance/equity
- A test trade
- A test signal
- A welcome alert

## Troubleshooting

### If login still doesn't redirect:

1. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors
   - Check if session is created

2. **Check account record:**
   - Go to Supabase → Table Editor → `accounts`
   - Look for your user_id
   - If missing, create it (see above)

3. **Try manual navigation:**
   - After login, manually go to `/dashboard`
   - If this works, redirect timing is the issue

4. **Clear cookies and retry:**
   - DevTools → Application → Cookies
   - Delete all cookies for localhost:3000
   - Try login again

## Quick Test Commands

### Test Account Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/account \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "d60f254c-b41a-49c2-9788-12975c94f085",
    "balance": 10000.00,
    "equity": 10050.00,
    "bot_status": true
  }'
```

### Check Account in Supabase
```sql
SELECT * FROM accounts WHERE user_id = 'd60f254c-b41a-49c2-9788-12975c94f085';
```

## Your User ID for Webhooks

When setting up n8n workflows or testing webhooks, use:
- **User ID:** `d60f254c-b41a-49c2-9788-12975c94f085`
- **Email:** `nikeshpyakurel32@gmail.com`

## Status Checklist

- [x] User account created in Supabase Auth
- [x] Email confirmed
- [x] User has signed in before
- [ ] Account record exists in `accounts` table
- [ ] Can login successfully
- [ ] Redirects to dashboard
- [ ] Dashboard loads correctly

Complete the unchecked items above to finish setup!



