# How to Get Environment Variables

## Step-by-Step Guide

### 1. Get Supabase Credentials

#### Create a Supabase Project (if you don't have one)

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "AI Trading Dashboard")
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works fine

5. Wait 2-3 minutes for project setup

#### Get Your Supabase Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see three values you need:

   **a) Project URL:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   ```
   - Copy the "Project URL" value
   - It looks like: `https://abcdefghijklmnop.supabase.co`

   **b) Anon/Public Key:**
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Copy the "anon" or "public" key
   - This is safe to expose in client-side code
   - It's a long JWT token starting with `eyJ`

   **c) Service Role Key:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Copy the "service_role" key
   - ⚠️ **KEEP THIS SECRET!** Never expose this in client-side code
   - It bypasses Row Level Security
   - It's also a long JWT token starting with `eyJ`

### 2. Generate WEBHOOK_SECRET

The webhook secret is used to authenticate requests from n8n. Generate a secure random string:

**Option A: Using OpenSSL (Recommended)**
```bash
openssl rand -hex 32
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**Option D: Online Generator**
- Go to https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" or generate a random string
- Make it at least 32 characters long

Copy the generated string - you'll use this same value in both:
- Your `.env` file
- Your n8n webhook configuration

### 3. Update Your .env File

Open `.env` in your project root and replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
WEBHOOK_SECRET=your-generated-secret-string-here
```

### 4. Verify Your Setup

After updating `.env`, verify it works:

```bash
# Check if .env file exists and has content
cat .env

# Start the dev server (it will use .env automatically)
npm run dev
```

If you see errors about missing environment variables, double-check:
- No extra spaces around the `=` sign
- No quotes around the values (unless the value itself contains spaces)
- Values are on single lines (no line breaks)

## Visual Guide

### Supabase Dashboard Navigation

```
Supabase Dashboard
├── Home (Overview)
├── Table Editor
├── SQL Editor
├── Authentication
├── Storage
├── Edge Functions
└── Settings ⚙️  ← Click here
    ├── General
    ├── API ← Click here for credentials
    ├── Database
    ├── Auth
    └── ...
```

### API Settings Page Layout

```
┌─────────────────────────────────────┐
│ API Settings                        │
├─────────────────────────────────────┤
│                                     │
│ Project URL                         │
│ https://xxxxx.supabase.co          │
│ [Copy]                              │
│                                     │
│ Project API keys                    │
│                                     │
│ anon / public                       │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │
│ [Copy] [Reveal]                     │
│                                     │
│ service_role                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │
│ [Copy] [Reveal]                     │
│                                     │
│ ⚠️ service_role key has admin      │
│    privileges. Keep it secret!     │
└─────────────────────────────────────┘
```

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the entire key (they're very long)
- Check for extra spaces or line breaks
- Verify you're using the correct key type (anon vs service_role)

### "Project not found" error
- Verify the Project URL is correct
- Make sure your Supabase project is active (not paused)

### Webhook authentication fails
- Ensure `WEBHOOK_SECRET` matches exactly in:
  - Your `.env` file
  - Your n8n webhook Authorization header
- No extra spaces or quotes

### Environment variables not loading
- Make sure file is named exactly `.env` (not `.env.local` or `.env.example`)
- Restart your dev server after changing `.env`
- Check you're in the project root directory

## Security Best Practices

1. ✅ **DO:**
   - Keep `.env` in `.gitignore` (already done)
   - Use different secrets for dev/staging/production
   - Rotate secrets periodically
   - Use strong, random WEBHOOK_SECRET

2. ❌ **DON'T:**
   - Commit `.env` to Git
   - Share service_role key publicly
   - Use the same WEBHOOK_SECRET everywhere
   - Hardcode secrets in your code

## Next Steps

After setting up your `.env` file:

1. ✅ Run database migrations (see `QUICKSTART.md`)
2. ✅ Create storage bucket (see `QUICKSTART.md`)
3. ✅ Start development server: `npm run dev`
4. ✅ Test authentication at http://localhost:3000/login



