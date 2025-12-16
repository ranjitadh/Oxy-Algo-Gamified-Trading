# Quick Setup Guide

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

## Step-by-Step Setup

### 1. Clone and Navigate

```bash
cd Oxy-Algo-Gamified-Trading
```

### 2. Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit with your values (minimum required)
nano .env
```

**Minimum required in `.env`:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random string (min 32 chars)
- `N8N_WEBHOOK_SECRET` - Random string for webhook security

### 3. Start with Docker

```bash
# Start all services
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps

# Check logs if needed
docker-compose logs -f backend
```

### 4. Initialize Database

```bash
# Enter backend container
docker-compose exec backend sh

# Or run from host (if you have Node.js installed)
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 5. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432 (user: oxy_user, password: oxy_password)

### 6. Create First User

1. Go to http://localhost:3000/login
2. Click "Sign up"
3. Enter email and password
4. You'll receive 100 welcome credits

### 7. Configure n8n (Optional)

If you have n8n running:

1. Set `N8N_BASE_URL` in `.env` to your n8n instance
2. Set `N8N_WEBHOOK_SECRET` to match n8n webhook secret
3. Configure n8n workflows to call:
   - `POST http://localhost:3001/webhooks/signal-snapshot`
   - `POST http://localhost:3001/webhooks/trade-update`
   - `POST http://localhost:3001/webhooks/action-update`

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart if needed
docker-compose restart postgres

# Check connection
docker-compose exec postgres psql -U oxy_user -d oxy_algo
```

### Port Already in Use

Edit `docker-compose.yml` to change ports:
```yaml
ports:
  - "3002:3001"  # Change backend
  - "3001:3000"  # Change frontend
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Missing .env file
# - Database not ready (wait longer)
# - Port conflict
```

### Frontend Not Loading

```bash
# Check if backend is running
curl http://localhost:3001/auth/me

# Check frontend logs
docker-compose logs frontend

# Rebuild if needed
docker-compose up -d --build frontend
```

## Next Steps

1. ✅ Application is running
2. ✅ Create user account
3. ⏭️ Configure n8n workflows
4. ⏭️ Set up PayPal (for production)
5. ⏭️ Add more instruments/strategies
6. ⏭️ Deploy to production

## Development Mode

To run without Docker:

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Make sure PostgreSQL is running separately.

## Production Deployment

See main README.md for production deployment instructions.

