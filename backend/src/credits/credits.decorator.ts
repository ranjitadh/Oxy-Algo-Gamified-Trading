import { SetMetadata } from '@nestjs/common'

export const CREDIT_COST_KEY = 'creditCost'
export const RequiresCredits = (cost: number) => SetMetadata(CREDIT_COST_KEY, cost)

