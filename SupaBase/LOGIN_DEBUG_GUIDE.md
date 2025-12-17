# Login Debugging Guide

## Quick Debug Steps

### Step 1: Use Debug Page

1. Go to http://localhost:3000/login-debug
2. Enter your email and password
3. Click "Test Login"
4. Check the logs to see what's happening

This will show you:
- If login succeeds
- If session is created
- If cookies are set
- Any errors

### Step 2: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for error messages

### Step 3: Check Network Tab

1. Open DevTools → Network tab
2. Try logging in
3. Look for requests to Supabase
4. Check if they return 200 (success) or errors

### Step 4: Check Cookies

1. Open DevTools → Application → Cookies
2. Look for cookies starting with `sb-` or `supabase`
3. If none exist, session isn't being saved

## Common Issues & Fixes

### Issue 1: "Invalid login credentials"

**Cause:** Wrong email/password or user doesn't exist

**Fix:**
- Verify email and password are correct
- Check if user exists in Supabase Dashboard → Authentication → Users
- Try resetting password

### Issue 2: Session created but redirect doesn't work

**Symptoms:**
- Login succeeds (no error)
- "Redirecting..." shows
- But stays on login page

**Fix:**
1. Check browser console for errors
2. Try manually going to `/dashboard` after login
3. Check if middleware is blocking (see middleware logs)

### Issue 3: Session not being created

**Symptoms:**
- Login succeeds
- But no session found
- No cookies set

**Possible Causes:**
- Cookie settings issue
- Domain mismatch
- Supabase configuration issue

**Fix:**
1. Check `.env` file has correct Supabase URL
2. Make sure you're using `http://localhost:3000` (not 127.0.0.1)
3. Clear all cookies and try again
4. Check Supabase project settings

### Issue 4: Middleware redirecting back to login

**Symptoms:**
- Login succeeds
- Redirects to dashboard
- But immediately redirects back to login

**Cause:** Middleware doesn't see the session

**Fix:**
1. Check middleware code
2. Increase delay before redirect
3. Check if cookies are being set correctly

## Manual Testing

### Test 1: Check Session After Login

After clicking "Sign in", open browser console and run:

```javascript
const { data } = await supabase.auth.getSession()
console.log('Session:', data.session)
console.log('User:', data.session?.user)
```

### Test 2: Check Cookies

```javascript
console.log('Cookies:', document.cookie)
```

### Test 3: Manual Redirect

After login, manually navigate:
```
http://localhost:3000/dashboard
```

If this works, the redirect timing is the issue.

## Environment Check

Verify your `.env` file:

```bash
cat .env
```

Should show:
- `NEXT_PUBLIC_SUPABASE_URL=https://...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`

Make sure:
- No extra spaces
- No quotes around values
- Values are on single lines

## Supabase Check

1. Go to Supabase Dashboard
2. Check Authentication → Users
3. Find your user
4. Check:
   - Email confirmed? ✅
   - Status: Active? ✅
   - Last sign in? Recent?

## Still Not Working?

1. **Clear everything:**
   ```bash
   # Clear browser cache and cookies
   # Restart dev server
   npm run dev
   ```

2. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors

3. **Try magic link instead:**
   - Click "Send Magic Link"
   - Check email
   - Click link
   - See if that works

4. **Check if account record exists:**
   - Go to Supabase → Table Editor → `accounts`
   - Look for your user_id
   - If missing, create it manually

## What to Report

If still having issues, provide:
1. Error message (if any)
2. Browser console errors
3. Network tab errors
4. Debug page logs
5. Supabase user status

This will help identify the exact issue!


