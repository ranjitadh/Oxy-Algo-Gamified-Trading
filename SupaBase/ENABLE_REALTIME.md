# How to Enable Realtime in Supabase

There are two ways to enable Realtime for your tables. Choose the method you prefer.

## Method 1: Using Supabase Dashboard (Visual)

### Step-by-Step Instructions

1. **Open your Supabase project dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Database → Replication**
   - In the left sidebar, click **Database**
   - Click **Replication** (or look for "Replication" under Database section)
   - You'll see a list of all your tables

3. **Enable Realtime for each table**
   - Find each table in the list:
     - `accounts`
     - `trades`
     - `signals`
     - `alerts`
   - Toggle the switch/checkbox next to each table name to enable Realtime
   - The switch should turn green/blue when enabled

4. **Verify**
   - All four tables should show as enabled
   - You may see a small indicator (like a green dot) next to enabled tables

### Visual Guide

```
Supabase Dashboard
├── Home
├── Table Editor
├── SQL Editor
├── Database
│   ├── Tables
│   ├── Functions
│   ├── Extensions
│   └── Replication ← Click here
│       ┌─────────────────────────────┐
│       │ Table Name        │ Realtime │
│       ├─────────────────────────────┤
│       │ accounts          │ [✓ ON]  │ ← Toggle ON
│       │ trades            │ [✓ ON]  │ ← Toggle ON
│       │ signals           │ [✓ ON]  │ ← Toggle ON
│       │ alerts            │ [✓ ON]  │ ← Toggle ON
│       │ screenshots       │ [ ] OFF │ (optional)
│       └─────────────────────────────┘
```

## Method 2: Using SQL (Faster)

If you prefer SQL, you can enable Realtime directly in the SQL Editor.

### Steps

1. **Open SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run this SQL command:**

```sql
-- Enable Realtime for all required tables
ALTER PUBLICATION supabase_realtime ADD TABLE accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
```

3. **Click "Run"** (or press Cmd/Ctrl + Enter)

4. **Verify it worked:**
   - You should see "Success. No rows returned"
   - Or go to Database → Replication and verify the tables show as enabled

### Optional: Enable for screenshots too

If you want Realtime updates for screenshots as well:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE screenshots;
```

## Method 3: Enable All Tables at Once

If you want to enable Realtime for ALL tables in your database:

```sql
-- Enable Realtime for all tables (use with caution)
ALTER PUBLICATION supabase_realtime ADD TABLE accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE screenshots;
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
```

## Verify Realtime is Working

### Test in Your Application

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open dashboard in two browser tabs:**
   - Tab 1: http://localhost:3000/dashboard
   - Tab 2: http://localhost:3000/dashboard

3. **Make a change via webhook or SQL:**
   ```sql
   -- Test update (replace with your actual user_id)
   UPDATE accounts 
   SET balance = 10000.00 
   WHERE user_id = 'your-user-id-here';
   ```

4. **Watch both tabs update in real-time!**

### Check Realtime Status

You can also verify in Supabase:

1. Go to **Database → Replication**
2. All four tables should show as enabled
3. You might see connection counts or activity indicators

## Troubleshooting

### "Table not found" error
- Make sure you've run the migration SQL first
- Verify table names are correct (case-sensitive)

### Realtime not working in app
- Check browser console for WebSocket errors
- Verify RLS policies allow SELECT operations
- Make sure you're subscribed to the correct table
- Check Supabase project status (not paused)

### Can't find Realtime/Replication option
- Some Supabase projects have it under **Database → Replication**
- Or look for **Realtime** in the left sidebar
- If still not found, try the SQL method (Method 2)

### SQL method shows error
- Make sure you're using the SQL Editor (not Table Editor)
- Verify you have the correct permissions
- Try enabling one table at a time

## What Realtime Does

When enabled, Realtime allows your frontend to:
- ✅ Receive instant updates when data changes
- ✅ See new trades appear automatically
- ✅ Watch balance/equity update live
- ✅ Get alerts without page refresh
- ✅ See signals appear in real-time

Without Realtime, your app would need to poll the database every few seconds, which is inefficient and slow.

## Next Steps

After enabling Realtime:

1. ✅ Test with the verification steps above
2. ✅ Check that your app receives updates
3. ✅ Monitor Supabase dashboard for connection activity
4. ✅ Continue with the rest of the setup (see `QUICKSTART.md`)

## Quick Reference

**Tables that need Realtime:**
- `accounts` - For live balance/equity updates
- `trades` - For new trades appearing instantly
- `signals` - For new signals showing up
- `alerts` - For alerts appearing in real-time

**Tables that don't need Realtime (optional):**
- `screenshots` - Usually loaded on-demand, not needed in real-time



