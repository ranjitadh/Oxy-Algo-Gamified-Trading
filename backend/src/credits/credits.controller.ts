import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common'
import { CreditsService } from './credits.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    const balance = await this.creditsService.getBalance(req.user.id)
    return { balance }
  }

  @Get('ledger')
  async getLedger(@Request() req, @Query('limit') limit?: string) {
    const ledger = await this.creditsService.getLedger(req.user.id, limit ? parseInt(limit) : 50)
    return { ledger }
  }
}

