# System Architecture

## Overview

The AI Trading Dashboard is a real-time web application that displays trading data, signals, and alerts. It integrates with MT4/MT5 Expert Advisors via n8n workflows and Discord.

## Architecture Diagram

```
┌─────────────┐
│   MT4/MT5   │
│     EA      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Discord   │
│    Bot      │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│     n8n     │─────▶│   Webhooks   │─────▶│  Supabase   │
│  Workflows  │      │   (Next.js)  │      │  Database   │
└─────────────┘      └──────────────┘      └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  Supabase   │
                                            │   Storage   │
                                            └─────────────┘
                                                   │
                                                   ▼
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │◀─────│   Next.js    │◀─────│  Supabase  │
│   (React)   │      │   App Router │      │  Realtime  │
└─────────────┘      └──────────────┘      └─────────────┘
```

## Component Breakdown

### 1. Frontend (Next.js App Router)

**Pages:**
- `/login` - Authentication (email/password, magic link)
- `/dashboard` - Main dashboard with metrics and charts
- `/trades` - Trade history with screenshots
- `/signals` - AI trading signals
- `/alerts` - System alerts and notifications
- `/settings` - User settings and account info

**Key Features:**
- Server-side rendering for initial load
- Client-side realtime subscriptions via Supabase
- Responsive design with Tailwind CSS
- Chart visualizations with Recharts

**State Management:**
- React hooks for local state
- Supabase Realtime for server state
- Custom hooks (`useRealtimeAccount`, `useRealtimeTrades`, `useRealtimeAlerts`)

### 2. Backend (Supabase)

**Database Tables:**
- `accounts` - User account balances and bot status
- `trades` - Trading history
- `screenshots` - Trade screenshot metadata
- `signals` - AI trading signals
- `alerts` - System alerts

**Security:**
- Row Level Security (RLS) on all tables
- User isolation via `user_id` foreign keys
- Service role key for webhook operations only

**Storage:**
- `screenshots` bucket for trade screenshots
- Public URLs for image access
- Automatic cleanup on trade deletion (CASCADE)

**Realtime:**
- PostgreSQL change notifications
- WebSocket connections per user
- Efficient filtering by `user_id`

### 3. Webhook API (Next.js API Routes)

**Endpoints:**
- `/api/webhooks/trade` - Trade create/update
- `/api/webhooks/account` - Account balance/equity updates
- `/api/webhooks/signal` - Signal creation
- `/api/webhooks/alert` - Alert creation
- `/api/webhooks/screenshot` - Screenshot upload

**Security:**
- Bearer token authentication
- Service role key for database operations
- Input validation with Zod schemas
- Error handling and logging

### 4. Integration Layer (n8n)

**Workflows:**
1. **Trade Flow:**
   - Discord webhook → Parse trade data → Call trade webhook → Download screenshot → Call screenshot webhook → Create alert

2. **Account Flow:**
   - MT4/MT5 EA → n8n webhook → Transform data → Call account webhook

3. **Signal Flow:**
   - AI service → n8n webhook → Call signal webhook → Create alert

## Data Flow

### Trade Creation Flow

1. **MT4/MT5 EA** executes trade
2. **EA** sends notification to Discord
3. **Discord Bot** posts message with trade details and screenshot
4. **n8n Workflow** triggered by Discord webhook
5. **n8n** extracts trade data and image URL
6. **n8n** calls `/api/webhooks/trade` with trade data
7. **Webhook** creates/updates trade in Supabase
8. **n8n** calls `/api/webhooks/screenshot` with image URL
9. **Webhook** downloads image, uploads to Supabase Storage, creates screenshot record
10. **Supabase Realtime** broadcasts trade change to connected clients
11. **Frontend** receives update and re-renders

### Account Update Flow

1. **MT4/MT5 EA** detects balance/equity change
2. **EA** sends update to n8n webhook
3. **n8n** transforms and calls `/api/webhooks/account`
4. **Webhook** updates account record
5. **Supabase Realtime** broadcasts account change
6. **Frontend** updates dashboard metrics

### Signal Generation Flow

1. **AI Service** analyzes market and generates signal
2. **AI Service** sends signal to n8n webhook
3. **n8n** calls `/api/webhooks/signal`
4. **Webhook** creates signal record
5. **Supabase Realtime** broadcasts signal
6. **Frontend** displays new signal

## Security Architecture

### Authentication
- Supabase Auth handles user sessions
- JWT tokens stored in HTTP-only cookies
- Middleware validates sessions on protected routes

### Authorization
- Row Level Security (RLS) policies enforce user isolation
- All queries filtered by `auth.uid()`
- Service role key bypasses RLS (webhook operations only)

### Data Protection
- Environment variables for secrets
- No sensitive data in client-side code
- HTTPS enforced in production
- Webhook authentication required

## Performance Considerations

### Database
- Indexes on frequently queried columns (`user_id`, `status`, `created_at`)
- Efficient RLS policies
- Connection pooling via Supabase

### Frontend
- Server-side rendering for initial load
- Client-side realtime subscriptions
- Efficient re-rendering with React hooks
- Chart data limited to last 50 points

### Realtime
- Filtered subscriptions (by `user_id`)
- Single channel per user per table
- Automatic cleanup on component unmount

## Scalability

### Current Limitations
- Single Supabase project
- No horizontal scaling for webhooks
- Realtime connections limited by Supabase plan

### Future Enhancements
- Read replicas for heavy read workloads
- Webhook queue system (Redis/RabbitMQ)
- CDN for screenshot delivery
- Edge functions for webhook processing

## Monitoring & Observability

### Metrics to Track
- Webhook call frequency and latency
- Realtime connection count
- Database query performance
- Storage usage
- Error rates

### Logging
- Webhook errors logged to console
- Frontend errors visible in browser console
- Supabase logs available in dashboard

### Alerts
- Database connection failures
- Webhook authentication failures
- High error rates
- Storage quota warnings

## Deployment Architecture

### Production (Vercel)
- Next.js app deployed as serverless functions
- Edge network for global distribution
- Automatic HTTPS
- Environment variables in Vercel dashboard

### Database (Supabase)
- Managed PostgreSQL
- Automatic backups
- Point-in-time recovery
- Connection pooling

### Storage (Supabase)
- Object storage for screenshots
- CDN delivery
- Automatic cleanup policies

## Development Workflow

1. **Local Development:**
   - `npm run dev` starts Next.js dev server
   - Connect to Supabase project
   - Test webhooks with ngrok or similar

2. **Database Changes:**
   - Create migration SQL file
   - Run in Supabase SQL editor
   - Test RLS policies

3. **Deployment:**
   - Push to Git repository
   - Vercel auto-deploys
   - Update environment variables if needed

## Error Handling

### Frontend
- Try-catch blocks in async operations
- Error boundaries for React components
- User-friendly error messages

### Backend
- Zod validation for webhook inputs
- Database error handling
- HTTP status codes for different error types
- Detailed error messages in development

### Realtime
- Automatic reconnection on disconnect
- Error callbacks for failed subscriptions
- Graceful degradation if Realtime unavailable

## Testing Strategy

### Unit Tests
- Webhook validation logic
- Data transformation functions
- Utility functions

### Integration Tests
- Webhook endpoints with test data
- Database operations
- Realtime subscriptions

### E2E Tests
- User authentication flow
- Dashboard data display
- Trade creation and display
- Screenshot upload and display

## Future Enhancements

1. **Multi-Account Support**
   - Allow users to manage multiple trading accounts
   - Account switching in UI

2. **Advanced Analytics**
   - Trade performance analysis
   - Risk metrics
   - Portfolio optimization

3. **Mobile App**
   - React Native app
   - Push notifications
   - Mobile-optimized UI

4. **AI Enhancements**
   - Real-time market analysis
   - Predictive signals
   - Risk assessment

5. **Social Features**
   - Share trades
   - Follow other traders
   - Leaderboards



