# OXY ALGO – Gamified Trading Platform

A production-ready, gamified trading web application that removes complexity and fear from trading. Built with Next.js, NestJS, and PostgreSQL.

## 🎯 Product Philosophy

**Frontend = Calm, Simple, Gamified**  
**Backend = Powerful, Invisible, Automated**

- No charts, candlesticks, or technical jargon
- Gamified actions: Deploy, Engage, Lock In, Secure Win, Reduce Risk
- Credit-based usage model
- Multi-user support with PayPal integration
- AI-powered trading assistant
- Seamless n8n integration for automation

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Framer Motion (animations)
- TanStack Query (data fetching)
- Zod + React Hook Form (validation)

**Backend:**
- NestJS (Node.js framework)
- Prisma ORM
- PostgreSQL
- JWT authentication
- Redis (optional, for queues/rate limiting)

**Infrastructure:**
- Docker Compose (local development)
- PostgreSQL database
- Redis (optional)

## 📁 Project Structure

```
Oxy-Algo-Gamified-Trading/
├── backend/                 # NestJS backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── credits/        # Credit ledger system
│   │   ├── instruments/    # Trading instruments
│   │   ├── strategies/     # Trading strategies
│   │   ├── trades/         # Trade history
│   │   ├── actions/        # Trade actions
│   │   ├── chat/           # AI assistant
│   │   ├── webhooks/       # n8n webhook handlers
│   │   ├── n8n/            # n8n integration
│   │   ├── billing/        # PayPal integration
│   │   └── admin/          # Admin dashboard
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Seed script
├── frontend/                # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   └── lib/                # Utilities
├── shared-types/            # Shared TypeScript types
└── docker-compose.yml       # Docker setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and Setup

```bash
# Clone the repository
cd Oxy-Algo-Gamified-Trading

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Configure Environment Variables

Edit `.env` with your settings:

```env
# Database
DATABASE_URL=postgresql://oxy_user:oxy_password@localhost:5432/oxy_algo

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# n8n Integration
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_SECRET=your-n8n-webhook-secret

# PayPal (optional for development)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Credit Costs
AI_MESSAGE_COST=10
STRATEGY_ACTIVATION_COST=50
ANALYSIS_RUN_COST=25
```

### 3. Start with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Setup (Alternative)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start development server
npm run start:dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Prisma Studio:** `cd backend && npx prisma studio`

## 📊 Database Schema

### Core Tables

- `users` - User accounts
- `subscriptions` - PayPal subscriptions
- `credit_ledger` - Credit transactions
- `instruments` - Trading instruments (EURUSD, GBPJPY, etc.)
- `strategies` - Trading strategies/EAs
- `strategy_activation` - User strategy activations
- `signals_snapshot` - Market signals
- `trades` - Trade history
- `actions` - User actions (secure profits, reduce risk, etc.)
- `chat_threads` & `chat_messages` - AI assistant conversations

See `backend/prisma/schema.prisma` for full schema.

## 🔌 n8n Integration

### Webhook Endpoints (Inbound from n8n)

The backend exposes webhook endpoints that n8n can call:

1. **POST `/webhooks/signal-snapshot`**
   - Updates instrument signals
   - Payload: `{ instrumentId, confidence, status, risk, activeStrategyName }`

2. **POST `/webhooks/trade-update`**
   - Creates or updates trades
   - Payload: `{ userId, instrumentId, outcome, pnlPct, beforeImageUrl, afterImageUrl, aiSummary }`

3. **POST `/webhooks/action-update`**
   - Updates action status
   - Payload: `{ actionId, status, responsePayload, errorMessage }`

**Security:** All webhooks verify HMAC signature using `N8N_WEBHOOK_SECRET`.

### Outbound Calls (Backend to n8n)

The backend calls n8n webhooks for:

- **Strategy Activation/Deactivation**
- **Trade Actions** (secure profits, reduce risk, exit, pause)
- **AI Assistant Requests**

Configure n8n workflows to receive these calls at:
- `/webhook/oxy-action`
- `/webhook/oxy-chat`
- `/webhook/oxy-activate-strategy`
- `/webhook/oxy-deactivate-strategy`

## 💳 PayPal Integration

### Setup

1. Create a PayPal app at https://developer.paypal.com
2. Get Client ID and Client Secret
3. Add to `.env`:
   ```
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret
   PAYPAL_MODE=sandbox  # or 'live' for production
   ```

### Webhook Configuration

Configure PayPal webhook to call:
- `POST /billing/webhook/paypal`

Events to listen for:
- `PAYMENT.CAPTURE.COMPLETED`

## 🎮 Core Features

### 1. Dashboard
- View all trading instruments
- See confidence levels, status, and risk
- Click to view detailed instrument information

### 2. Strategy Hub
- Browse available strategies
- Activate/deactivate strategies
- View performance metrics
- Credits consumed on activation

### 3. Trade Control Panel
- **Secure Profits** - Lock in gains
- **Reduce Exposure** - Lower risk
- **Exit Clean** - Close positions safely
- **Pause System** - Halt all activity

### 4. Trade History
- View completed trades
- See before/after images
- Read AI explanations
- Track win rate and P&L

### 5. AI Trading Assistant
- Chat interface
- Ask questions about markets
- Get trading insights
- Credits consumed per message

### 6. Billing
- Purchase credit packs
- View credit history
- Manage subscriptions

## 🔐 Authentication

- Email/password registration and login
- JWT tokens (7-day expiration)
- Protected routes with guards
- Role-based access (USER, ADMIN)

## 💰 Credit System

### Credit Consumption

- **AI Message:** 10 credits (configurable)
- **Strategy Activation:** 50 credits (configurable)
- **Analysis Run:** 25 credits (configurable)

### Credit Sources

- Welcome bonus (100 credits on registration)
- PayPal purchases
- Admin grants
- Subscription bonuses

### Balance Calculation

Credits are calculated as `SUM(delta)` from `credit_ledger` table.

## 👨‍💼 Admin Dashboard

Access admin features at `/admin/*` (requires ADMIN role):

- Grant credits to users
- View all actions
- System statistics

## 🧪 Seeding Data

Run the seed script to populate initial data:

```bash
cd backend
npm run prisma:seed
```

This creates:
- 8 trading instruments (EURUSD, GBPJPY, XAUUSD, etc.)
- 5 trading strategies
- Sample signal snapshots

## 🛠️ Development

### Backend Commands

```bash
cd backend

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database
npx prisma migrate dev      # Create migration
npx prisma generate         # Generate client
npx prisma studio           # Open database GUI
npm run prisma:seed         # Seed database
```

### Frontend Commands

```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild
docker-compose up -d --build

# Remove volumes (clean database)
docker-compose down -v
```

## 📝 API Documentation

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Instruments

- `GET /instruments` - List all instruments
- `GET /instruments/with-signals` - Instruments with latest signals
- `GET /instruments/:id` - Get instrument details

### Strategies

- `GET /strategies` - List all strategies
- `GET /strategies/my-activations` - User's active strategies
- `POST /strategies/:id/activate` - Activate strategy
- `POST /strategies/activations/:id/deactivate` - Deactivate
- `POST /strategies/activations/:id/pause` - Pause

### Actions

- `POST /actions` - Create action (secure profits, reduce risk, etc.)
- `GET /actions` - List user actions

### Trades

- `GET /trades` - List user trades
- `GET /trades/stats` - Trade statistics
- `GET /trades/:id` - Get trade details

### Chat

- `GET /chat/threads` - List chat threads
- `GET /chat/threads/:id` - Get thread messages
- `POST /chat/message` - Send message to AI

### Credits

- `GET /credits/balance` - Get credit balance
- `GET /credits/ledger` - Get credit history

### Billing

- `POST /billing/purchase-credits` - Purchase credits
- `GET /billing/subscriptions` - List subscriptions
- `POST /billing/webhook/paypal` - PayPal webhook

### Admin

- `POST /admin/grant-credits` - Grant credits (ADMIN only)
- `GET /admin/actions` - View all actions (ADMIN only)
- `GET /admin/stats` - System statistics (ADMIN only)

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Webhook signature verification (HMAC)
- Input validation with class-validator
- Rate limiting with @nestjs/throttler
- CORS configuration
- SQL injection protection (Prisma)
- XSS protection (React)

## 🚢 Production Deployment

### VPS Deployment

1. **Setup Server**
   ```bash
   # Install Node.js, Docker, PostgreSQL
   # Configure firewall
   ```

2. **Database**
   - Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)
   - Or install PostgreSQL on VPS

3. **Environment Variables**
   - Set production values in `.env`
   - Use strong JWT_SECRET
   - Configure PayPal live credentials

4. **Build & Deploy**
   ```bash
   # Backend
   cd backend
   npm run build
   npm run start:prod

   # Frontend
   cd frontend
   npm run build
   npm run start
   ```

5. **Reverse Proxy**
   - Use Nginx or Caddy
   - Configure SSL with Let's Encrypt
   - Proxy to backend (port 3001) and frontend (port 3000)

### Docker Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests (when added)
cd frontend
npm run test
```

## 📚 Adding Instruments/Strategies

### Add Instrument

```sql
INSERT INTO instruments (symbol, display_name, enabled)
VALUES ('BTCUSD', 'Bitcoin/USD', true);
```

Or use Prisma Studio:
```bash
cd backend
npx prisma studio
```

### Add Strategy

```sql
INSERT INTO strategies (key, name, description, risk_profile, enabled)
VALUES ('scalper_v2', 'Scalper V2', 'Improved scalping strategy', 'HIGH', true);
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps

# Check connection string
echo $DATABASE_URL

# Reset database
docker-compose down -v
docker-compose up -d postgres
cd backend && npx prisma migrate dev
```

### Port Conflicts

Edit `docker-compose.yml` to change ports:
```yaml
ports:
  - "3002:3001"  # Change backend port
  - "3001:3000"  # Change frontend port
```

### n8n Integration Issues

1. Verify `N8N_BASE_URL` is correct
2. Check n8n webhook URLs match backend expectations
3. Verify `N8N_WEBHOOK_SECRET` matches in both systems
4. Check n8n workflow logs

## 📄 License

MIT

## 🤝 Contributing

This is a production application. Follow these guidelines:

1. Test all changes thoroughly
2. Update documentation
3. Follow existing code style
4. Add proper error handling
5. Write meaningful commit messages

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check logs: `docker-compose logs`

## 🎉 Next Steps

After setup:

1. **Configure n8n workflows** to connect to webhook endpoints
2. **Set up PayPal** for credit purchases
3. **Add more instruments/strategies** via Prisma Studio
4. **Customize credit costs** in `.env`
5. **Deploy to production** when ready

---

**Built with ❤️ for simple, gamified trading**
