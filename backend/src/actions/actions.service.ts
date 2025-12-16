import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ActionType, ActionStatus } from '@prisma/client'

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    type: ActionType,
    requestPayload?: any,
  ) {
    return this.prisma.action.create({
      data: {
        userId,
        type,
        status: 'QUEUED',
        requestPayload,
      },
    })
  }

  async updateStatus(
    id: string,
    status: ActionStatus,
    responsePayload?: any,
    errorMessage?: string,
  ) {
    return this.prisma.action.update({
      where: { id },
      data: {
        status,
        responsePayload,
        errorMessage,
      },
    })
  }

  async findAll(userId: string, limit = 50) {
    return this.prisma.action.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async findOne(id: string, userId: string) {
    return this.prisma.action.findFirst({
      where: { id, userId },
    })
  }
}

