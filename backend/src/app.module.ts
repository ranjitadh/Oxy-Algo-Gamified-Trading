import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { InstrumentsModule } from './instruments/instruments.module'
import { StrategiesModule } from './strategies/strategies.module'
import { TradesModule } from './trades/trades.module'
import { ActionsModule } from './actions/actions.module'
import { ChatModule } from './chat/chat.module'
import { CreditsModule } from './credits/credits.module'
import { WebhooksModule } from './webhooks/webhooks.module'
import { N8nModule } from './n8n/n8n.module'
import { BillingModule } from './billing/billing.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    InstrumentsModule,
    StrategiesModule,
    TradesModule,
    ActionsModule,
    ChatModule,
    CreditsModule,
    WebhooksModule,
    N8nModule,
    BillingModule,
    AdminModule,
  ],
})
export class AppModule {}

