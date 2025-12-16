import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common'
import { TradesService } from './trades.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get()
  async findAll(@Request() req, @Query('limit') limit?: string) {
    return this.tradesService.findAll(req.user.id, limit ? parseInt(limit) : 50)
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.tradesService.getStats(req.user.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tradesService.findOne(id, req.user.id)
  }
}

