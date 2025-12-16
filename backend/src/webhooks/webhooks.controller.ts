import { Controller, Post, Body, Headers, BadRequestException, Logger } from '@nestjs/common'
import { WebhooksService } from './webhooks.service'
import * as crypto from 'crypto'

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name)

  constructor(private webhooksService: WebhooksService) {}

  private verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const expectedSignature = hmac.digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  }

  @Post('signal-snapshot')
  async handleSignalSnapshot(
    @Body() body: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    const secret = process.env.N8N_WEBHOOK_SECRET || ''
    const payload = JSON.stringify(body)

    if (secret && !this.verifySignature(payload, signature || '', secret)) {
      throw new BadRequestException('Invalid webhook signature')
    }

    return this.webhooksService.handleSignalSnapshot(body)
  }

  @Post('trade-update')
  async handleTradeUpdate(
    @Body() body: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    const secret = process.env.N8N_WEBHOOK_SECRET || ''
    const payload = JSON.stringify(body)

    if (secret && !this.verifySignature(payload, signature || '', secret)) {
      throw new BadRequestException('Invalid webhook signature')
    }

    return this.webhooksService.handleTradeUpdate(body)
  }

  @Post('action-update')
  async handleActionUpdate(
    @Body() body: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    const secret = process.env.N8N_WEBHOOK_SECRET || ''
    const payload = JSON.stringify(body)

    if (secret && !this.verifySignature(payload, signature || '', secret)) {
      throw new BadRequestException('Invalid webhook signature')
    }

    return this.webhooksService.handleActionUpdate(body)
  }
}

