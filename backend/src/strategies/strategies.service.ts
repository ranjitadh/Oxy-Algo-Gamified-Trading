import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StrategiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.strategy.findMany({
      where: { enabled: true },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    return this.prisma.strategy.findUnique({
      where: { id },
    })
  }

  async getUserActivations(userId: string) {
    return this.prisma.strategyActivation.findMany({
      where: { userId },
      include: {
        strategy: true,
        instrument: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async activate(userId: string, strategyId: string, instrumentId?: string) {
    return this.prisma.strategyActivation.create({
      data: {
        userId,
        strategyId,
        instrumentId: instrumentId || null,
        status: 'ACTIVE',
      },
      include: {
        strategy: true,
        instrument: true,
      },
    })
  }

  async deactivate(activationId: string) {
    return this.prisma.strategyActivation.update({
      where: { id: activationId },
      data: { status: 'INACTIVE' },
    })
  }

  async pause(activationId: string) {
    return this.prisma.strategyActivation.update({
      where: { id: activationId },
      data: { status: 'PAUSED' },
    })
  }
}

