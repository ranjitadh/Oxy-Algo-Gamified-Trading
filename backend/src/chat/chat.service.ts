import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateThread(userId: string) {
    const existing = await this.prisma.chatThread.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      return existing
    }

    return this.prisma.chatThread.create({
      data: { userId },
    })
  }

  async getThread(threadId: string, userId: string) {
    return this.prisma.chatThread.findFirst({
      where: { id: threadId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  async addMessage(
    threadId: string,
    role: 'user' | 'assistant',
    content: string,
    creditsCost?: number,
  ) {
    return this.prisma.chatMessage.create({
      data: {
        threadId,
        role,
        content,
        creditsCost,
      },
    })
  }

  async getUserThreads(userId: string) {
    return this.prisma.chatThread.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }
}

