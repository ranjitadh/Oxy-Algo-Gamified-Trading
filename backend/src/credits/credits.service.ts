import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreditReason } from '@prisma/client'

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string): Promise<number> {
    const result = await this.prisma.creditLedger.aggregate({
      where: { userId },
      _sum: {
        delta: true,
      },
    })

    return result._sum.delta || 0
  }

  async addCredits(
    userId: string,
    amount: number,
    reason: CreditReason,
    refType?: string,
    refId?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive')
    }

    return this.prisma.creditLedger.create({
      data: {
        userId,
        delta: amount,
        reason,
        refType,
        refId,
      },
    })
  }

  async consumeCredits(
    userId: string,
    amount: number,
    reason: CreditReason,
    refType?: string,
    refId?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive')
    }

    const balance = await this.getBalance(userId)

    if (balance < amount) {
      throw new BadRequestException('Insufficient credits')
    }

    return this.prisma.creditLedger.create({
      data: {
        userId,
        delta: -amount,
        reason,
        refType,
        refId,
      },
    })
  }

  async checkAndConsume(
    userId: string,
    amount: number,
    reason: CreditReason,
    refType?: string,
    refId?: string,
  ): Promise<boolean> {
    const balance = await this.getBalance(userId)

    if (balance < amount) {
      return false
    }

    await this.consumeCredits(userId, amount, reason, refType, refId)
    return true
  }

  async getLedger(userId: string, limit = 50) {
    return this.prisma.creditLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}

