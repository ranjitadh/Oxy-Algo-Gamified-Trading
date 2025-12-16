import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto, LoginDto } from './dto/auth.dto'
import { CreditsService } from '../credits/credits.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private creditsService: CreditsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new UnauthorizedException('Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    })

    // Grant welcome credits
    await this.creditsService.addCredits(user.id, 100, 'SUBSCRIPTION_BONUS', 'welcome_bonus')

    const access_token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role })

    const creditsBalance = await this.creditsService.getBalance(user.id)

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        creditsBalance,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const access_token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role })

    const creditsBalance = await this.creditsService.getBalance(user.id)

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        creditsBalance,
      },
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    return user
  }
}

