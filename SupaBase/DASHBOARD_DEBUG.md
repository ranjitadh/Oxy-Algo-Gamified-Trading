# Dashboard Not Showing - Debug Guide

## Quick Checks

### 1. Check Browser Console

Open DevTools (F12) → Console tab and look for:
- "Dashboard: User loaded: [your email]" - User is loaded
- Any error messages
- "Not authenticated" - Session issue

### 2. Check Network Tab

DevTools → Network tab:
- Look for requests to `/dashboard`
- Check status codes (should be 200)
- Look for failed requests

### 3. Check Current URL

What URL are you on?
- `/login` - Still on login page
- `/dashboard` - On dashboard but not loading
- Something else?

### 4. Check Cookies

DevTools → Application → Cookies:
- Look for cookies starting with `sb-` or `supabase`
- If none exist, session isn't saved

## Common Issues

### Issue 1: Redirecting Back to Login

**Symptoms:** Login succeeds, redirects to dashboard, but immediately goes back to login

**Cause:** Middleware doesn't see the session (cookies not set)

**Fix:**
1. Check if cookies exist (see above)
2. Clear cookies and try again
3. Make sure using `http://localhost:3000` (not 127.0.0.1)

### Issue 2: Dashboard Shows "Loading..." Forever

**Cause:** Account record doesn't exist or can't be loaded

**Fix:**
1. Go to Supabase Dashboard → Table Editor → `accounts`
2. Look for your user_id: `d60f254c-b41a-49c2-9788-12975c94f085`
3. If missing, run this SQL:
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

### Issue 3: Dashboard Shows "Not authenticated"

**Cause:** Session not found

**Fix:**
1. Check browser console for errors
2. Try logging in again
3. Check if cookies are set

### Issue 4: Blank Page

**Cause:** JavaScript error preventing render

**Fix:**
1. Check browser console for errors
2. Check Network tab for failed requests
3. Try refreshing the page

## Step-by-Step Debugging

### Step 1: Verify Login Works

1. Go to http://localhost:3000/login
2. Open console (F12)
3. Login
4. Check console for:
   - "Session confirmed"
   - "Found Supabase cookies"
   - "Redirecting to /dashboard..."

### Step 2: Check What Happens After Redirect

After login redirects:
1. What URL are you on? (check address bar)
2. What do you see? (blank, loading, error?)
3. Check console for errors
4. Check Network tab for failed requests

### Step 3: Manual Navigation Test

1. After login, manually type in address bar: `http://localhost:3000/dashboard`
2. Press Enter
3. Does it work now?
4. If yes, redirect timing is the issue
5. If no, session/middleware is the issue

### Step 4: Check Account Record

1. Go to Supabase Dashboard → Table Editor → `accounts`
2. Search for user_id: `d60f254c-b41a-49c2-9788-12975c94f085`
3. Does it exist?
4. If no, create it (see SQL above)

## Quick Fixes

### Fix 1: Create Account Record

Run this SQL in Supabase:
```sql
INSERT INTO accounts (user_id, balance, equity, bot_status)
SELECT id, 0, 0, false
FROM auth.users
WHERE id = 'd60f254c-b41a-49c2-9788-12975c94f085'
ON CONFLICT (user_id) DO NOTHING;
```

### Fix 2: Clear Everything and Retry

```bash
# 1. Clear browser cookies
# DevTools → Application → Cookies → Clear All

# 2. Restart dev server
npm run dev

# 3. Try login again
```

### Fix 3: Check Supabase Configuration

1. Go to Supabase Dashboard → Settings → API
2. Check "Site URL" is: `http://localhost:3000`
3. Check "Redirect URLs" includes: `http://localhost:3000/**`

## What to Report

If still not working, provide:
1. What URL you're on after login
2. What you see (blank, loading, error message?)
3. Browser console errors (copy/paste)
4. Network tab errors
5. Whether account record exists in Supabase

This will help identify the exact issue!



