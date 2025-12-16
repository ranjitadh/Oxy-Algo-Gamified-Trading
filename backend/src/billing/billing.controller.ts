import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { BillingService } from './billing.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('purchase-credits')
  async purchaseCredits(@Body() body: { amount: number; credits: number }, @Request() req) {
    return this.billingService.createPayPalOrder(req.user.id, body.amount, body.credits)
  }

  @Post('webhook/paypal')
  async handlePayPalWebhook(@Body() body: any) {
    return this.billingService.handlePayPalWebhook(body)
  }

  @Get('subscriptions')
  async getSubscriptions(@Request() req) {
    return this.billingService.getSubscriptions(req.user.id)
  }
}

