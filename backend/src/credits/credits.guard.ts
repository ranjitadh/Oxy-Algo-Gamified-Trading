import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CreditsService } from './credits.service'
import { CREDIT_COST_KEY } from './credits.decorator'

@Injectable()
export class CreditsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private creditsService: CreditsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const creditCost = this.reflector.getAllAndOverride<number>(CREDIT_COST_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!creditCost) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id

    if (!userId) {
      throw new BadRequestException('User not authenticated')
    }

    const balance = await this.creditsService.getBalance(userId)

    if (balance < creditCost) {
      throw new BadRequestException(
        `Insufficient credits. Required: ${creditCost}, Available: ${balance}`,
      )
    }

    return true
  }
}

