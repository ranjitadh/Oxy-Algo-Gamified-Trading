# Login Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Invalid login credentials"

**Possible Causes:**
- User doesn't exist (need to sign up first)
- Wrong email or password
- Email not confirmed (if email confirmation is enabled)

**Solutions:**

1. **Check if user exists:**
   - Go to Supabase Dashboard → Authentication → Users
   - Look for your email address
   - If not found, you need to sign up first

2. **Sign up first:**
   - Go to http://localhost:3000/signup
   - Create a new account
   - Then try logging in

3. **Reset password:**
   - If user exists but forgot password:
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user
   - Click "Reset Password" or use Supabase's password reset flow

4. **Check email confirmation:**
   - If email confirmation is enabled in Supabase:
   - Check your email for confirmation link
   - Click the link to verify your account
   - Then try logging in again

### Issue 2: "Email not confirmed"

**Solution:**
1. Check your email inbox (and spam folder)
2. Look for email from Supabase
3. Click the confirmation link
4. Try logging in again

**To disable email confirmation (for development):**
1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle it OFF
4. Now you can login immediately after signup

### Issue 3: Page redirects to login immediately after login

**Possible Causes:**
- Session not being saved
- Cookie issues
- Environment variables incorrect

**Solutions:**

1. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors
   - Check Network tab for failed requests

2. **Check environment variables:**
   ```bash
   # Verify .env file exists and has correct values
   cat .env
   ```
   - Make sure `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - No extra spaces or quotes

3. **Clear browser cookies:**
   - Open DevTools → Application → Cookies
   - Delete all cookies for localhost:3000
   - Try logging in again

4. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Issue 4: "Failed to sign in" or network error

**Possible Causes:**
- Supabase connection issue
- Wrong Supabase URL or key
- CORS issues
- Network problems

**Solutions:**

1. **Verify Supabase credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the exact Project URL and anon key
   - Update `.env` file with correct values
   - Restart dev server

2. **Test Supabase connection:**
   ```bash
   # Test if Supabase is accessible
   curl https://icrpihjhujopqicoktgw.supabase.co/rest/v1/
   ```

3. **Check Supabase project status:**
   - Go to Supabase Dashboard
   - Make sure project is not paused
   - Check if there are any service issues

4. **Check browser network tab:**
   - Open DevTools → Network
   - Try logging in
   - Look for failed requests to Supabase
   - Check error messages

### Issue 5: Magic link not working

**Possible Causes:**
- Email not sent
- Wrong redirect URL
- Email in spam folder

**Solutions:**

1. **Check email settings in Supabase:**
   - Go to Authentication → Settings
   - Verify email is configured
   - Check SMTP settings (if using custom email)

2. **Check spam folder:**
   - Look in spam/junk folder
   - Add Supabase to safe senders

3. **Verify redirect URL:**
   - Make sure `emailRedirectTo` matches your app URL
   - Should be: `http://localhost:3000/dashboard` (for dev)
   - Or: `https://your-domain.com/dashboard` (for production)

### Issue 6: User exists but can't login

**Solutions:**

1. **Check user status in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user
   - Check if status is "Active"
   - Check if email is confirmed

2. **Manually confirm email (for testing):**
   - In Supabase Dashboard → Authentication → Users
   - Find your user
   - Click on user
   - Toggle "Email Confirmed" to ON
   - Try logging in again

3. **Reset user password:**
   - In Supabase Dashboard → Authentication → Users
   - Find your user
   - Click "Send password reset email"
   - Or manually set a new password

## Step-by-Step Debugging

### Step 1: Check if you have an account

1. Go to Supabase Dashboard → Authentication → Users
2. Look for your email
3. If not found → **Sign up first** at http://localhost:3000/signup
4. If found → Continue to Step 2

### Step 2: Check user status

1. Click on your user in Supabase
2. Check:
   - ✅ Email Confirmed: Should be checked
   - ✅ Status: Should be "Active"
   - ✅ Last Sign In: Should show recent activity

### Step 3: Check environment variables

```bash
# Verify .env file
cat .env

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://icrpihjhujopqicoktgw.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 4: Check browser console

1. Open http://localhost:3000/login
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try logging in
5. Look for any red error messages
6. Copy error messages for debugging

### Step 5: Check network requests

1. Open DevTools → Network tab
2. Try logging in
3. Look for requests to Supabase
4. Check if any return errors (red status codes)
5. Click on failed requests to see error details

### Step 6: Test Supabase connection

1. Go to Supabase Dashboard → SQL Editor
2. Run a simple query:
   ```sql
   SELECT * FROM auth.users LIMIT 1;
   ```
3. If this works, Supabase is accessible
4. If this fails, there's a Supabase issue

## Quick Fixes

### Fix 1: Create account if doesn't exist

```bash
# Option 1: Use signup page
# Visit: http://localhost:3000/signup

# Option 2: Create via Supabase Dashboard
# Go to Authentication → Users → Add User
```

### Fix 2: Disable email confirmation (for development)

1. Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle OFF
4. Now signup works immediately

### Fix 3: Reset password

1. Supabase Dashboard → Authentication → Users
2. Find your user
3. Click "Send password reset email"
4. Or manually set password in user settings

### Fix 4: Clear everything and start fresh

```bash
# 1. Clear browser cookies
# DevTools → Application → Cookies → Clear All

# 2. Restart dev server
npm run dev

# 3. Try signup again
# Visit: http://localhost:3000/signup
```

## Testing Login

### Test 1: Verify Supabase Connection

```bash
# Test Supabase API
curl https://icrpihjhujopqicoktgw.supabase.co/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

### Test 2: Check if user exists

1. Go to Supabase Dashboard → Authentication → Users
2. Search for your email
3. Verify user exists and is active

### Test 3: Test login with correct credentials

1. Make sure you know the exact email and password
2. Try logging in
3. Check browser console for errors
4. Check network tab for failed requests

## Common Error Messages

### "Invalid login credentials"
- User doesn't exist → Sign up first
- Wrong password → Reset password
- Email not confirmed → Check email and confirm

### "Email not confirmed"
- Check email inbox
- Click confirmation link
- Or disable email confirmation in Supabase settings

### "Failed to fetch"
- Check Supabase URL in .env
- Check internet connection
- Check Supabase project status

### "Network error"
- Check Supabase is accessible
- Check CORS settings
- Check firewall/proxy settings

## Still Having Issues?

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors

2. **Check Browser Console:**
   - Open DevTools → Console
   - Look for JavaScript errors

3. **Verify Setup:**
   - Database migrations run? ✅
   - Storage bucket created? ✅
   - Realtime enabled? ✅
   - Environment variables set? ✅

4. **Try Magic Link Instead:**
   - Sometimes magic link works when password doesn't
   - Click "Send Magic Link" on login page
   - Check email and click link

## Need More Help?

1. Check `USER_GUIDE.md` for complete setup instructions
2. Check `QUICKSTART.md` for quick setup
3. Review Supabase documentation
4. Check browser console for specific error messages

---

**Quick Checklist:**
- [ ] User exists in Supabase?
- [ ] Email confirmed?
- [ ] Environment variables correct?
- [ ] Dev server running?
- [ ] Browser console shows errors?
- [ ] Tried magic link?



