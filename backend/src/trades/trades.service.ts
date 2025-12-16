import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, limit = 50) {
    return this.prisma.trade.findMany({
      where: { userId },
      include: {
        instrument: true,
        strategy: true,
      },
      orderBy: { openedAt: 'desc' },
      take: limit,
    })
  }

  async findOne(id: string, userId: string) {
    return this.prisma.trade.findFirst({
      where: { id, userId },
      include: {
        instrument: true,
        strategy: true,
      },
    })
  }

  async getStats(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
    })

    const total = trades.length
    const wins = trades.filter((t) => t.outcome === 'WIN').length
    const losses = trades.filter((t) => t.outcome === 'LOSS').length
    const winRate = total > 0 ? (wins / total) * 100 : 0
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnlPct || 0), 0)

    return {
      total,
      wins,
      losses,
      winRate: Math.round(winRate * 100) / 100,
      totalPnl: Math.round(totalPnl * 100) / 100,
    }
  }
}

