import { Module } from '@nestjs/common'
import { StrategiesService } from './strategies.service'
import { StrategiesController } from './strategies.controller'
import { CreditsModule } from '../credits/credits.module'

@Module({
  imports: [CreditsModule],
  providers: [StrategiesService],
  controllers: [StrategiesController],
  exports: [StrategiesService],
})
export class StrategiesModule {}

