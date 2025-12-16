# Local Setup Guide - OXY ALGO Trading Platform

This guide will help you set up and run the OXY ALGO trading platform locally on your machine.

## 📋 Prerequisites

- **Node.js** 20+ (check with `node --version`)
- **PostgreSQL** 15+ (or use a cloud database)
- **npm** or **yarn** package manager

## 🔧 Step 1: Environment Variables Setup

Create a `.env` file in the **backend** directory with the following variables:

```env
# Database Configuration
# For local PostgreSQL:
DATABASE_URL=postgresql://oxy_user:oxy_password@localhost:5432/oxy_algo

# JWT Authentication (REQUIRED)
# IMPORTANT: Use a strong, random secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# n8n Integration (Optional - for automation workflows)
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_SECRET=your-n8n-webhook-secret-change-this

# PayPal Integration (Optional - for billing)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Credit Costs Configuration
AI_MESSAGE_COST=10
STRATEGY_ACTIVATION_COST=50
ANALYSIS_RUN_COST=25
```

Create a `.env.local` file in the **frontend** directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🗄️ Step 2: Database Setup

### Option A: Local PostgreSQL (macOS with Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
createdb oxy_algo
psql oxy_algo -c "CREATE USER oxy_user WITH PASSWORD 'oxy_password';"
psql oxy_algo -c "GRANT ALL PRIVILEGES ON DATABASE oxy_algo TO oxy_user;"
psql oxy_algo -c "ALTER USER oxy_user WITH SUPERUSER;"
```

### Option B: Cloud PostgreSQL (Free Tier)

You can use any of these free PostgreSQL services:
- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

1. Create a PostgreSQL database
2. Get the connection string
3. Update `DATABASE_URL` in your `.env` file

## 🚀 Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data (instruments, strategies)
npm run prisma:seed

# Start the development server
npm run start:dev
```

The backend should now be running on **http://localhost:3001**

**Expected output:**
```
🚀 Backend running on http://localhost:3001
```

## 🎨 Step 4: Frontend Setup

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend should now be running on **http://localhost:3000**

## ✅ Step 5: Verify Setup

### 1. Check Backend Health

Open your browser or use curl:
```bash
curl http://localhost:3001
```

You should see a response (or a 404, which is fine - it means the server is running).

### 2. Access Frontend

Open **http://localhost:3000** in your browser.

### 3. Create Your First Account

1. Go to **http://localhost:3000/login**
2. Click "Don't have an account? Sign up"
3. Enter an email and password (minimum 8 characters)
4. Click "Sign Up"
5. You'll be automatically logged in and receive 100 welcome credits

### 4. Test Navigation

After logging in, you should be able to navigate to:
- ✅ **Dashboard** (`/dashboard`) - View trading instruments
- ✅ **Strategy Hub** (`/strategies`) - Browse and activate strategies
- ✅ **Trade Control** (`/control`) - Execute trading actions
- ✅ **History** (`/history`) - View trade history
- ✅ **AI Assistant** (`/chat`) - Chat with AI trading assistant
- ✅ **Billing** (`/billing`) - View credit balance and purchase credits

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `Can't reach database server` or `Connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@15

# Test connection
psql -U oxy_user -d oxy_algo -h localhost
```

### Port Already in Use

**Error:** `Port 3001 is already in use` or `Port 3000 is already in use`

**Solution:**
1. Find what's using the port:
   ```bash
   lsof -i :3001  # For backend
   lsof -i :3000  # For frontend
   ```
2. Kill the process or change the port in `.env`:
   ```env
   PORT=3002  # Change backend port
   ```

### Prisma Migration Errors

**Error:** `Migration failed` or `Database schema is not in sync`

**Solution:**
```bash
cd backend

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Run migrations again
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### JWT Secret Missing

**Error:** `JWT_SECRET is required` or authentication fails

**Solution:**
1. Make sure `.env` file exists in the `backend` directory
2. Add `JWT_SECRET` with a strong random string (min 32 characters)
3. Restart the backend server

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Verify backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Check CORS settings in backend `main.ts` - should allow `http://localhost:3000`

### Module Not Found Errors

**Error:** `Cannot find module` or `Module not found`

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Required Environment Variables Summary

### Backend (`.env` in `backend/` directory)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | ✅ Yes | Secret for JWT tokens (min 32 chars) | `your-super-secret-key-here` |
| `JWT_EXPIRES_IN` | ❌ No | JWT expiration time | `7d` |
| `PORT` | ❌ No | Backend port | `3001` |
| `FRONTEND_URL` | ❌ No | Frontend URL for CORS | `http://localhost:3000` |
| `N8N_BASE_URL` | ❌ No | n8n instance URL | `http://localhost:5678` |
| `N8N_WEBHOOK_SECRET` | ❌ No | Secret for n8n webhooks | `webhook-secret` |
| `PAYPAL_CLIENT_ID` | ❌ No | PayPal client ID | `your-client-id` |
| `PAYPAL_CLIENT_SECRET` | ❌ No | PayPal client secret | `your-secret` |
| `PAYPAL_MODE` | ❌ No | PayPal mode | `sandbox` or `live` |
| `AI_MESSAGE_COST` | ❌ No | Credits per AI message | `10` |
| `STRATEGY_ACTIVATION_COST` | ❌ No | Credits per strategy activation | `50` |
| `ANALYSIS_RUN_COST` | ❌ No | Credits per analysis run | `25` |

### Frontend (`.env.local` in `frontend/` directory)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend API URL | `http://localhost:3001` |

## 🎯 Quick Start Checklist

- [ ] Node.js 20+ installed
- [ ] PostgreSQL installed and running
- [ ] Backend `.env` file created with `DATABASE_URL` and `JWT_SECRET`
- [ ] Frontend `.env.local` file created with `NEXT_PUBLIC_API_URL`
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Prisma client generated (`npm run prisma:generate`)
- [ ] Database migrations run (`npm run prisma:migrate`)
- [ ] Database seeded (`npm run prisma:seed`)
- [ ] Backend server running (`npm run start:dev`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can create account and login
- [ ] Can navigate to all pages

## 🎉 Success!

If you've completed all steps and can:
- ✅ Access the frontend at http://localhost:3000
- ✅ Create an account and login
- ✅ Navigate to all pages (Dashboard, Strategies, Control, History, Chat, Billing)
- ✅ See instruments on the dashboard
- ✅ View strategies in the Strategy Hub

Then your setup is complete! 🚀

## 📚 Additional Resources

- **Prisma Studio** (Database GUI): `cd backend && npx prisma studio`
- **Backend API Docs**: Check `README.md` for API endpoints
- **Database Schema**: See `backend/prisma/schema.prisma`

---

**Need Help?** Check the troubleshooting section above or review the main `README.md` file.


