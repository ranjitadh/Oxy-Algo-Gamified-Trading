# Quick Start Guide

## 🚀 Fastest Way to Get Running

### 1. Database Setup (One-time)

```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15
createdb oxy_algo
psql oxy_algo -c "CREATE USER oxy_user WITH PASSWORD 'oxy_password';"
psql oxy_algo -c "GRANT ALL PRIVILEGES ON DATABASE oxy_algo TO oxy_user;"
psql oxy_algo -c "ALTER USER oxy_user WITH SUPERUSER;"
```

### 2. Backend Setup

```bash
cd backend

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://oxy_user:oxy_password@localhost:5432/oxy_algo
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF

npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

npm install
npm run dev
```

### 4. Access & Test

1. Open http://localhost:3000
2. Click "Sign up"
3. Create account (email + password)
4. You're in! 🎉

## 📍 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `cd backend && npx prisma studio`

## 🔑 Required Environment Variables

**Backend** (`backend/.env`):
- `DATABASE_URL` ✅ Required
- `JWT_SECRET` ✅ Required (min 32 chars)

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_API_URL` ✅ Required

## ⚡ Troubleshooting

**Database connection error?**
```bash
brew services start postgresql@15
```

**Port in use?**
```bash
lsof -i :3001  # Find process
kill -9 <PID>  # Kill it
```

**Migration errors?**
```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes data
npm run prisma:migrate
npm run prisma:seed
```

---

For detailed instructions, see `LOCAL_SETUP_GUIDE.md`


