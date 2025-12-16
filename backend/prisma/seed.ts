import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create instruments
  const instruments = [
    { symbol: 'EURUSD', displayName: 'EUR/USD' },
    { symbol: 'GBPUSD', displayName: 'GBP/USD' },
    { symbol: 'USDJPY', displayName: 'USD/JPY' },
    { symbol: 'GBPJPY', displayName: 'GBP/JPY' },
    { symbol: 'XAUUSD', displayName: 'Gold (XAU/USD)' },
    { symbol: 'AUDUSD', displayName: 'AUD/USD' },
    { symbol: 'USDCAD', displayName: 'USD/CAD' },
    { symbol: 'NZDUSD', displayName: 'NZD/USD' },
  ]

  for (const instrument of instruments) {
    await prisma.instrument.upsert({
      where: { symbol: instrument.symbol },
      update: {},
      create: instrument,
    })
  }

  console.log(`✅ Created ${instruments.length} instruments`)

  // Create strategies
  const strategies = [
    {
      key: 'momentum_scalper',
      name: 'Momentum Scalper',
      description: 'High-frequency scalping strategy for volatile markets',
      riskProfile: 'HIGH',
    },
    {
      key: 'trend_follower',
      name: 'Trend Follower',
      description: 'Follows strong trends with trailing stops',
      riskProfile: 'MEDIUM',
    },
    {
      key: 'mean_reversion',
      name: 'Mean Reversion',
      description: 'Trades against extremes, waiting for price to revert',
      riskProfile: 'LOW',
    },
    {
      key: 'breakout_hunter',
      name: 'Breakout Hunter',
      description: 'Captures breakouts from consolidation patterns',
      riskProfile: 'MEDIUM',
    },
    {
      key: 'news_trader',
      name: 'News Trader',
      description: 'Trades on high-impact news events',
      riskProfile: 'HIGH',
    },
  ]

  for (const strategy of strategies) {
    await prisma.strategy.upsert({
      where: { key: strategy.key },
      update: {},
      create: strategy,
    })
  }

  console.log(`✅ Created ${strategies.length} strategies`)

  // Create sample signal snapshots
  const eurusd = await prisma.instrument.findUnique({ where: { symbol: 'EURUSD' } })
  const gbpjpy = await prisma.instrument.findUnique({ where: { symbol: 'GBPJPY' } })
  const xauusd = await prisma.instrument.findUnique({ where: { symbol: 'XAUUSD' } })

  if (eurusd) {
    await prisma.signalSnapshot.create({
      data: {
        instrumentId: eurusd.id,
        confidence: 75,
        status: 'GOOD',
        risk: 'LOW',
        activeStrategyName: 'Trend Follower',
      },
    })
  }

  if (gbpjpy) {
    await prisma.signalSnapshot.create({
      data: {
        instrumentId: gbpjpy.id,
        confidence: 45,
        status: 'NEUTRAL',
        risk: 'MEDIUM',
        activeStrategyName: null,
      },
    })
  }

  if (xauusd) {
    await prisma.signalSnapshot.create({
      data: {
        instrumentId: xauusd.id,
        confidence: 20,
        status: 'AVOID',
        risk: 'HIGH',
        activeStrategyName: null,
      },
    })
  }

  console.log('✅ Created sample signal snapshots')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
