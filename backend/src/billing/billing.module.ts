import { Module } from '@nestjs/common'
import { BillingService } from './billing.service'
import { BillingController } from './billing.controller'
import { CreditsModule } from '../credits/credits.module'

@Module({
  imports: [CreditsModule],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}

