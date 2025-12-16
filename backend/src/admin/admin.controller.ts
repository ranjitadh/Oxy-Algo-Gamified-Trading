import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('grant-credits')
  async grantCredits(@Body() body: { userId: string; amount: number; reason: string }) {
    return this.adminService.grantCredits(body.userId, body.amount, body.reason)
  }

  @Get('actions')
  async getAllActions() {
    return this.adminService.getAllActions()
  }

  @Get('stats')
  async getSystemStats() {
    return this.adminService.getSystemStats()
  }
}

