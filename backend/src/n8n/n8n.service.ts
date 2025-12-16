import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { ActionType } from '@prisma/client'

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name)
  private readonly axiosInstance: AxiosInstance
  private readonly baseUrl: string

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('N8N_BASE_URL') || 'http://localhost:5678'
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    })
  }

  async sendAction(actionId: string, userId: string, type: ActionType, payload?: any) {
    try {
      const response = await this.axiosInstance.post('/webhook/oxy-action', {
        actionId,
        userId,
        type,
        payload,
      })

      this.logger.log(`Action ${actionId} sent to n8n successfully`)
      return response.data
    } catch (error) {
      this.logger.error(`Failed to send action to n8n: ${error.message}`)
      throw error
    }
  }

  async sendChatMessage(userId: string, threadId: string, message: string) {
    try {
      const response = await this.axiosInstance.post('/webhook/oxy-chat', {
        userId,
        threadId,
        message,
      })

      return response.data
    } catch (error) {
      this.logger.error(`Failed to send chat message to n8n: ${error.message}`)
      return {
        content: 'I apologize, but I could not generate a response at this time. Please try again later.',
        confidence: 0,
      }
    }
  }

  async activateStrategy(userId: string, strategyId: string, instrumentId?: string) {
    try {
      const response = await this.axiosInstance.post('/webhook/oxy-activate-strategy', {
        userId,
        strategyId,
        instrumentId,
      })

      return response.data
    } catch (error) {
      this.logger.error(`Failed to activate strategy via n8n: ${error.message}`)
      throw error
    }
  }

  async deactivateStrategy(userId: string, activationId: string) {
    try {
      const response = await this.axiosInstance.post('/webhook/oxy-deactivate-strategy', {
        userId,
        activationId,
      })

      return response.data
    } catch (error) {
      this.logger.error(`Failed to deactivate strategy via n8n: ${error.message}`)
      throw error
    }
  }
}

