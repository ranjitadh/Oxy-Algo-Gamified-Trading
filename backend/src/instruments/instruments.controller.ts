import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { InstrumentsService } from './instruments.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('instruments')
@UseGuards(JwtAuthGuard)
export class InstrumentsController {
  constructor(private instrumentsService: InstrumentsService) {}

  @Get()
  async findAll() {
    return this.instrumentsService.findAll()
  }

  @Get('with-signals')
  async getWithSignals() {
    return this.instrumentsService.getLatestSignals()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.instrumentsService.findOne(id)
  }
}

