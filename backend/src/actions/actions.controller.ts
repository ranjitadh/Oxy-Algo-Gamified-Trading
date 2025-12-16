import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common'
import { ActionsService } from './actions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ActionType } from '@prisma/client'
import { N8nService } from '../n8n/n8n.service'

@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(
    private actionsService: ActionsService,
    private n8nService: N8nService,
  ) {}

  @Post()
  async create(@Body() body: { type: ActionType; payload?: any }, @Request() req) {
    const action = await this.actionsService.create(req.user.id, body.type, body.payload)

    // Send to n8n
    await this.n8nService.sendAction(action.id, req.user.id, body.type, body.payload)

    return action
  }

  @Get()
  async findAll(@Request() req) {
    return this.actionsService.findAll(req.user.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.actionsService.findOne(id, req.user.id)
  }
}

