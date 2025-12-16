import { Module } from '@nestjs/common'
import { ActionsService } from './actions.service'
import { ActionsController } from './actions.controller'
import { N8nModule } from '../n8n/n8n.module'

@Module({
  imports: [N8nModule],
  providers: [ActionsService],
  controllers: [ActionsController],
  exports: [ActionsService],
})
export class ActionsModule {}

