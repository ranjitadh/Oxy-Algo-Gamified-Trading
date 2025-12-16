import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreditsService } from '../credits/credits.service'
import axios from 'axios'

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name)

  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {}

  async createPayPalOrder(userId: string, amount: number, credits: number) {
    // This is a simplified version - in production, use PayPal SDK
    // For now, return a mock order ID
    const orderId = `PAYPAL_${Date.now()}_${userId}`

    return {
      orderId,
      amount,
      credits,
    }
  }

  async handlePayPalWebhook(data: any) {
    // Verify PayPal webhook signature in production
    const { event_type, resource } = data

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const { custom_id, amount } = resource
      const [userId, credits] = custom_id.split(':')

      await this.creditsService.addCredits(
        userId,
        parseInt(credits),
        'PURCHASE',
        'paypal_purchase',
        resource.id,
      )
    }

    return { success: true }
  }

  async getSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}

