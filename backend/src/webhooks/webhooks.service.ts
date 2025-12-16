import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name)

  constructor(private prisma: PrismaService) {}

  async handleSignalSnapshot(data: any) {
    try {
      const { instrumentId, instrumentSymbol, confidence, status, risk, activeStrategyName } = data

      let instrument = await this.prisma.instrument.findUnique({
        where: { id: instrumentId },
      })

      if (!instrument && instrumentSymbol) {
        instrument = await this.prisma.instrument.findUnique({
          where: { symbol: instrumentSymbol },
        })
      }

      if (!instrument) {
        this.logger.warn(`Instrument not found: ${instrumentId || instrumentSymbol}`)
        return { success: false, message: 'Instrument not found' }
      }

      await this.prisma.signalSnapshot.create({
        data: {
          instrumentId: instrument.id,
          confidence: confidence || 50,
          status: status || 'NEUTRAL',
          risk: risk || 'MEDIUM',
          activeStrategyName,
        },
      })

      return { success: true }
    } catch (error) {
      this.logger.error(`Error handling signal snapshot: ${error.message}`)
      throw error
    }
  }

  async handleTradeUpdate(data: any) {
    try {
      const {
        id,
        userId,
        instrumentId,
        instrumentSymbol,
        strategyId,
        openedAt,
        closedAt,
        outcome,
        pnlPct,
        beforeImageUrl,
        afterImageUrl,
        aiSummary,
      } = data

      let instrument = await this.prisma.instrument.findUnique({
        where: { id: instrumentId },
      })

      if (!instrument && instrumentSymbol) {
        instrument = await this.prisma.instrument.findUnique({
          where: { symbol: instrumentSymbol },
        })
      }

      if (!instrument) {
        this.logger.warn(`Instrument not found: ${instrumentId || instrumentSymbol}`)
        return { success: false, message: 'Instrument not found' }
      }

      if (id) {
        // Update existing trade
        await this.prisma.trade.update({
          where: { id },
          data: {
            closedAt: closedAt ? new Date(closedAt) : null,
            outcome: outcome || 'BREAKEVEN',
            pnlPct,
            beforeImageUrl,
            afterImageUrl,
            aiSummary,
          },
        })
      } else {
        // Create new trade
        await this.prisma.trade.create({
          data: {
            userId,
            instrumentId: instrument.id,
            strategyId: strategyId || null,
            openedAt: openedAt ? new Date(openedAt) : new Date(),
            closedAt: closedAt ? new Date(closedAt) : null,
            outcome: outcome || 'BREAKEVEN',
            pnlPct,
            beforeImageUrl,
            afterImageUrl,
            aiSummary,
          },
        })
      }

      return { success: true }
    } catch (error) {
      this.logger.error(`Error handling trade update: ${error.message}`)
      throw error
    }
  }

  async handleActionUpdate(data: any) {
    try {
      const { actionId, status, responsePayload, errorMessage } = data

      if (!actionId) {
        throw new BadRequestException('actionId is required')
      }

      const action = await this.prisma.action.findUnique({
        where: { id: actionId },
      })

      if (!action) {
        throw new NotFoundException(`Action not found: ${actionId}`)
      }

      await this.prisma.action.update({
        where: { id: actionId },
        data: {
          status: status || action.status,
          responsePayload: responsePayload || action.responsePayload,
          errorMessage: errorMessage || action.errorMessage,
        },
      })

      return { success: true }
    } catch (error) {
      this.logger.error(`Error handling action update: ${error.message}`)
      throw error
    }
  }
}
