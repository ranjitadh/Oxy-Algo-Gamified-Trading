import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { CreditsModule } from '../credits/credits.module'
import { N8nModule } from '../n8n/n8n.module'

@Module({
  imports: [CreditsModule, N8nModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}

