import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class InstrumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.instrument.findMany({
      where: { enabled: true },
      orderBy: { symbol: 'asc' },
    })
  }

  async findOne(id: string) {
    return this.prisma.instrument.findUnique({
      where: { id },
      include: {
        signals: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })
  }

  async getLatestSignals() {
    const instruments = await this.prisma.instrument.findMany({
      where: { enabled: true },
      include: {
        signals: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })

    return instruments.map((instrument) => ({
      ...instrument,
      signal: instrument.signals[0] || null,
    }))
  }
}

