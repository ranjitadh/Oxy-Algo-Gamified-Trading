# Setup Without Docker

Since Docker is not installed, here are options to run the application:

## Option 1: Install PostgreSQL Locally (Recommended for Development)

### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
createdb oxy_algo
psql oxy_algo -c "CREATE USER oxy_user WITH PASSWORD 'oxy_password';"
psql oxy_algo -c "GRANT ALL PRIVILEGES ON DATABASE oxy_algo TO oxy_user;"
```

### Update .env

Make sure your `.env` file has:
```env
DATABASE_URL=postgresql://oxy_user:oxy_password@localhost:5432/oxy_algo
```

### Run Migrations

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
```

### Start Backend

```bash
cd backend
npm run start:dev
```

### Start Frontend (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

## Option 2: Use Cloud PostgreSQL (Free Tier)

### Services:
- **Supabase** (free tier): https://supabase.com
- **Neon** (free tier): https://neon.tech
- **Railway** (free tier): https://railway.app

1. Create a PostgreSQL database
2. Get the connection string
3. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

4. Run migrations:
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Option 3: Install Docker Desktop

1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Then use the main setup instructions with `docker compose up -d`

## Redis (Optional)

Redis is optional. If you don't have it, the app will work without it (some features like rate limiting might be limited).

To install Redis on macOS:
```bash
brew install redis
brew services start redis
```

Or skip Redis - the app will work without it.

## Quick Start (Local PostgreSQL)

```bash
# 1. Install PostgreSQL (see Option 1 above)

# 2. Setup backend
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev

# 3. Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if not running
brew services start postgresql@15

# Test connection
psql -U oxy_user -d oxy_algo -h localhost
```

### Port Already in Use

If port 5432 is in use:
1. Find what's using it: `lsof -i :5432`
2. Stop the service or change port in `.env`

### Migration Errors

```bash
# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate
npm run prisma:seed
```

