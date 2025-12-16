import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreditsService } from '../credits/credits.service'

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {}

  async grantCredits(userId: string, amount: number, reason: string) {
    return this.creditsService.addCredits(userId, amount, 'ADMIN_GRANT', 'admin_grant', reason)
  }

  async getAllActions(limit = 100) {
    return this.prisma.action.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })
  }

  async getSystemStats() {
    const [users, trades, actions, totalCredits] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.trade.count(),
      this.prisma.action.count(),
      this.prisma.creditLedger.aggregate({
        _sum: {
          delta: true,
        },
      }),
    ])

    return {
      users,
      trades,
      actions,
      totalCreditsIssued: totalCredits._sum.delta || 0,
    }
  }
}

