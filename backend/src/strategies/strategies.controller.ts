import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common'
import { StrategiesService } from './strategies.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreditsService } from '../credits/credits.service'
import { RequiresCredits } from '../credits/credits.decorator'
import { CreditsGuard } from '../credits/credits.guard'

@Controller('strategies')
@UseGuards(JwtAuthGuard)
export class StrategiesController {
  constructor(
    private strategiesService: StrategiesService,
    private creditsService: CreditsService,
  ) {}

  @Get()
  async findAll() {
    return this.strategiesService.findAll()
  }

  @Get('my-activations')
  async getMyActivations(@Request() req) {
    return this.strategiesService.getUserActivations(req.user.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.strategiesService.findOne(id)
  }

  @Post(':id/activate')
  @UseGuards(CreditsGuard)
  @RequiresCredits(parseInt(process.env.STRATEGY_ACTIVATION_COST || '50'))
  async activate(
    @Param('id') strategyId: string,
    @Body() body: { instrumentId?: string },
    @Request() req,
  ) {
    const activation = await this.strategiesService.activate(
      req.user.id,
      strategyId,
      body.instrumentId,
    )

    // Consume credits
    await this.creditsService.consumeCredits(
      req.user.id,
      parseInt(process.env.STRATEGY_ACTIVATION_COST || '50'),
      'STRATEGY_ACTIVATION',
      'strategy_activation',
      activation.id,
    )

    return activation
  }

  @Post('activations/:activationId/deactivate')
  async deactivate(@Param('activationId') activationId: string) {
    return this.strategiesService.deactivate(activationId)
  }

  @Post('activations/:activationId/pause')
  async pause(@Param('activationId') activationId: string) {
    return this.strategiesService.pause(activationId)
  }
}

