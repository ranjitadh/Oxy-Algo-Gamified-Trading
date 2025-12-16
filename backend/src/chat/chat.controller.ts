import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreditsService } from '../credits/credits.service'
import { RequiresCredits } from '../credits/credits.decorator'
import { CreditsGuard } from '../credits/credits.guard'
import { N8nService } from '../n8n/n8n.service'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private creditsService: CreditsService,
    private n8nService: N8nService,
  ) {}

  @Get('threads')
  async getThreads(@Request() req) {
    return this.chatService.getUserThreads(req.user.id)
  }

  @Get('threads/:threadId')
  async getThread(@Param('threadId') threadId: string, @Request() req) {
    return this.chatService.getThread(threadId, req.user.id)
  }

  @Post('message')
  @UseGuards(CreditsGuard)
  @RequiresCredits(parseInt(process.env.AI_MESSAGE_COST || '10'))
  async sendMessage(@Body() body: { message: string; threadId?: string }, @Request() req) {
    const threadId = body.threadId || (await this.chatService.getOrCreateThread(req.user.id)).id

    // Add user message
    await this.chatService.addMessage(threadId, 'user', body.message)

    // Consume credits
    const cost = parseInt(process.env.AI_MESSAGE_COST || '10')
    await this.creditsService.consumeCredits(req.user.id, cost, 'AI_MESSAGE', 'chat_message', threadId)

    // Call n8n for AI response
    const aiResponse = await this.n8nService.sendChatMessage(req.user.id, threadId, body.message)

    // Add assistant message
    const assistantMessage = await this.chatService.addMessage(
      threadId,
      'assistant',
      aiResponse.content || 'I apologize, but I could not generate a response at this time.',
      cost,
    )

    return {
      threadId,
      message: assistantMessage,
    }
  }
}

